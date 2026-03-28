import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  page: 1,
  pages: 1,
  count: 0,
  isLoading: false,
  error: null,
  isReturnLoading: false,
  returnError: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    fetchOrdersRequest: (state, action) => {
      // action.payload can contain query params, e.g. { search: {...}, exact: {status: 'PENDING'} }
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders || [];
      state.page = action.payload.page || 1;
      state.pages = action.payload.pages || 1;
      state.count = action.payload.count || 0;
    },
    fetchOrdersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createReturnRequest: (state, action) => {
        // payload: { order: "ID", subject: "str", message: "str" }
        state.isReturnLoading = true;
        state.returnError = null;
    },
    createReturnSuccess: (state) => {
        state.isReturnLoading = false;
        state.returnError = null;
    },
    createReturnFailure: (state, action) => {
        state.isReturnLoading = false;
        state.returnError = action.payload;
    }
  },
});

export const { 
    fetchOrdersRequest, fetchOrdersSuccess, fetchOrdersFailure,
    createReturnRequest, createReturnSuccess, createReturnFailure
} = orderSlice.actions;

export default orderSlice.reducer;
