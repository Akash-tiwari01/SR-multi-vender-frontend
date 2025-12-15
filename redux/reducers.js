import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from '@/modules/products/state/productSlice'
import collectionsReducer from './collections/collectionSlice'
import userReducer from '@/modules/user/state/userSlice'
const rootReducer = combineReducers({
    user: userReducer,
    collections: collectionsReducer,
    product: productsReducer,
});

export default rootReducer;