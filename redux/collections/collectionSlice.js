import { createSlice } from "@reduxjs/toolkit";



const collectionSlice = createSlice({
    name:"collections",
    initialState:{
        collections:[],
        loading:false,
        error:null,
    },
    reducers:{
        fetchCollectionsRequest: (state)=>{
            state.loading = true;
            state.error = null;
        },
        fetchCollectionSuccess: (state, action)=>{
            state.loading = false;
            state.collections = action.payload;
        },
        fetchCollectionFailure: (state)=>{
            state.loading = true;
            state.error = null;
        }
    }
})


export const {
    fetchCollectionFailure,
    fetchCollectionSuccess,
    fetchCollectionsRequest,
} = collectionSlice.actions;
export default collectionSlice.reducer;