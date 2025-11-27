import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from './products/productSlice';

const rootReducer = combineReducers({
    products: productsReducer,
});

export default rootReducer;