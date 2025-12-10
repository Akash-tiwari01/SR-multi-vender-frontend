// src/modules/user/sagas/userSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { UserService } from '@/modules/user/services/UserService';
// import { callSetAuthCookie, callRemoveAuthCookie } from '@/utils/authServerHelper';
import { loginRequest, loginSuccess, loginFailure, logout, otpRequest, otpRequestSuccess, otpRequestFailure } from '@/modules/user/state/userSlice';
import { UserAPIRepository } from '../repositories/UserAPIRepository';



// --- WORKERS (SRP & OCP) ---

function* loginWorker(action) { // Handles traditional Email/Password
  const userService = new UserService();
  const userRepository = new UserAPIRepository();
  try {
    const { user, token } = yield call(userService.login, action.payload);
    yield call(userRepository.setSessionCookie, token); 
    yield put(loginSuccess({ user, token }));
  } catch (error) {
    console.log(error);
    yield put(loginFailure(error.message));
  }
}

function* otpRequestWorker(action) {
    const userService = new UserService();
    try {
        const { phone } = action.payload;
        // Call service to send OTP
        yield call(userService.requestOtp, phone);
        // Success: transition UI state
        yield put(otpRequestSuccess({ phone }));
    } catch (error) {
        yield put(otpRequestFailure(error.message));
    }
}

function* otpVerifyWorker(action) { // Note: This action is handled directly in the UI component/Saga trigger
    const userService = new UserService();
    const userRepository = new UserAPIRepository();

    try {
        const { otp_id, otp } = action.payload;

        // Call service to verify OTP and get token
        const { user, token } = yield call(userService.verifyOtp, otp_id, otp);
        
        // Secure Session: Set the HTTP-only cookie
        yield call(userRepository.setSessionCookie, token); 

        // Update the local state (using the shared loginSuccess action)
        yield put(loginSuccess({ user, token })); 

    } catch (error) {
        yield put(loginFailure(error.message)); // Use loginFailure for final step failure
    }
}

function* logoutWorker() {
  const userRepository = new UserAPIRepository();
    try {
        yield call(userRepository.clearSessionCookie);
        yield put(logout()); 
    } catch (error) {
        console.error("Logout process error:", error);
    }
}

// --- WATCHER ---
export function* userSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(otpRequest.type, otpRequestWorker);
  // OTP Verify worker needs a dedicated type to be triggered
  yield takeLatest('user/otpVerify', otpVerifyWorker); 
  yield takeLatest(logout.type, logoutWorker);
}