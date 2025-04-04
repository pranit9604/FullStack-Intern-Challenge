import { createSlice } from "@reduxjs/toolkit";

const ratingSlice = createSlice({
    name: "ratings",
    initialState: {
        ratings: [],
        loading: false,
        error: null,
    },
    reducers: {
        setRatings: (state, action) => {
            state.ratings = action.payload;
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

export const { setRatings, setLoading, setError } = ratingSlice.actions;
export default ratingSlice.reducer;