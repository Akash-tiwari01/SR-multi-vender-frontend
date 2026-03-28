import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  fetchWishlistRequest,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  syncWishlistRequest,
  syncWishlistSuccess,
  syncWishlistFailure,
  toggleWishlistItemRequest,
  toggleWishlistItemSuccess,
  toggleWishlistItemFailure,
  clearWishlistRequest,
  clearWishlistSuccess,
  clearWishlistFailure,
  selectWishlistItems
} from './wishlistSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5000';

function* fetchWishlistSaga() {
  try {
    const token = yield select((state) => state.user?.token);
    if (!token) return;

    const response = yield call(fetch, `${API_URL}/api/wishlist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch wishlist');

    const data = yield call([response, 'json']);
    yield put(fetchWishlistSuccess(data.items || []));
  } catch (error) {
    console.error('Fetch wishlist error:', error);
    yield put(fetchWishlistFailure(error.message));
  }
}

function* syncWishlistSaga() {
  try {
    const token = yield select((state) => state.user?.token);
    if (!token) return; // Only sync if logged in

    const localItems = yield select(selectWishlistItems);

    const response = yield call(fetch, `${API_URL}/api/wishlist/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ localItems }),
    });

    if (!response.ok) throw new Error('Failed to sync wishlist');

    const data = yield call([response, 'json']);
    
    // Update frontend state with merged DB data
    yield put(syncWishlistSuccess(data.items || []));
  } catch (error) {
    console.error('Sync wishlist error:', error);
    yield put(syncWishlistFailure(error.message));
  }
}

function* toggleWishlistSaga(action) {
  try {
    const token = yield select((state) => state.user?.token);
    if (!token) {
      // If not logged in, just update locally (handled by slice)
      return; 
    }

    const productData = action.payload;

    const response = yield call(fetch, `${API_URL}/api/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productData }),
    });

    if (!response.ok) throw new Error('Failed to toggle wishlist item');

    const data = yield call([response, 'json']);
    
    // Server returns the updated wishlist
    yield put(toggleWishlistItemSuccess(data.items || []));
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    yield put(toggleWishlistItemFailure(error.message));
  }
}

function* clearWishlistSaga() {
  try {
    const token = yield select((state) => state.user?.token);
    if (!token) return;

    const response = yield call(fetch, `${API_URL}/api/wishlist/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to clear wishlist');

    yield put(clearWishlistSuccess());
  } catch (error) {
    console.error('Clear wishlist error:', error);
    yield put(clearWishlistFailure(error.message));
  }
}

export default function* wishlistSaga() {
  yield takeLatest(fetchWishlistRequest.type, fetchWishlistSaga);
  yield takeLatest(clearWishlistRequest.type, clearWishlistSaga);
  yield takeLatest(syncWishlistRequest.type, syncWishlistSaga);
  yield takeLatest(toggleWishlistItemRequest.type, toggleWishlistSaga);
}
