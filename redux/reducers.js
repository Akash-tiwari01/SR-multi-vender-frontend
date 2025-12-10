import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from './products/productSlice';
import collectionsReducer from './collections/collectionSlice'
import userReducer from '@/modules/user/state/userSlice'
const rootReducer = combineReducers({
    user: userReducer,
    collections: collectionsReducer,
    products: productsReducer,
});

export default rootReducer;