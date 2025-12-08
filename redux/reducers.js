import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from './products/productSlice';
import collectionsReducer from './collections/collectionSlice'

const rootReducer = combineReducers({
    collections: collectionsReducer,
    products: productsReducer,
});

export default rootReducer;