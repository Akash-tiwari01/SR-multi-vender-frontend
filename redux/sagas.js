import { all } from 'redux-saga/effects';
import { productsWatcherSaga } from './products/productSaga';
import { collectionWatcherSaga } from './collections/collectionSaga';
import userRootSaga, { userWatcher } from '@/modules/user/sagas/userSaga';
import productSaga from '@/modules/products/sagas/productSagas';
import cartSaga from './cart/cartSaga';
import { reviewSaga } from '@/modules/Reviews/reviewSaga';
import wishlistSaga from './wishlist/wishlistSaga';
import orderSaga from '@/modules/orders/sagas/orderSaga';

export default function* rootSaga() {
  yield all([
    // userRootSaga(),
    userWatcher(),
    productsWatcherSaga(),
    productSaga(),
    collectionWatcherSaga(),
    cartSaga(),
    reviewSaga(),
    wishlistSaga(),
    orderSaga(),
  ]);
}
