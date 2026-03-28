import { call, put, takeLatest } from 'redux-saga/effects';
import { 
    fetchOrdersRequest, fetchOrdersSuccess, fetchOrdersFailure,
    createReturnRequest, createReturnSuccess, createReturnFailure
} from '../state/orderSlice';
import { apiClient } from '@/utils/api';
import { getAuthTokenAction } from '@/lib/authActions';

function* fetchOrdersWorker(action) {
    try {
        const token = yield call(getAuthTokenAction);
        if (!token) throw new Error("No authentication token found. Please login.");

        const queryParams = action.payload || {};

        // Use custom apiClient GET helper, inject query elements logically
        const endpoint = `/api/orders`;
        // apiClient.get natively serializes params via URLSearchParams
        const responseData = yield call([apiClient, apiClient.get], endpoint, queryParams, token);
        
        yield put(fetchOrdersSuccess(responseData));
    } catch (error) {
        console.error("Order fetch error:", error);
        yield put(fetchOrdersFailure(error.message || 'Failed to fetch orders'));
    }
}

function* createReturnWorker(action) {
    try {
        const token = yield call(getAuthTokenAction);
        if (!token) throw new Error("Authentication required to request a return.");

        const payload = action.payload; 
        
        // POST to /api/returnrequests
        const responseData = yield call([apiClient, apiClient.post], `/api/returnrequests`, payload, {
            'Authorization': `Bearer ${token}` 
        });

        yield put(createReturnSuccess(responseData));

        // After successful return request, re-fetch orders so the status might show 'RETURN REQUEST'
        yield put(fetchOrdersRequest());

    } catch (error) {
        console.error("Return request error:", error);
        yield put(createReturnFailure(error.message || 'Failed to process return request'));
    }
}

export function* orderWatcherSaga() {
    yield takeLatest(fetchOrdersRequest.type, fetchOrdersWorker);
    yield takeLatest(createReturnRequest.type, createReturnWorker);
}

export default function* orderSaga() {
    yield call(orderWatcherSaga);
}
