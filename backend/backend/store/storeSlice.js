import { createSlice } from "@reduxjs/toolkit";

const storeSlice = createSlice({
    name: "stores",
    initialState: {
        stores: [],
        loading: false,
        error: null,
    },
    reducers: {
        setStores: (state, action) => {
            state.stores = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setStores, setLoading, setError } = storeSlice.actions;
export default storeSlice.reducer;