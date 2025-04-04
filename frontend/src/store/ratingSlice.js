import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  ratings: [], // List of all ratings
  loading: false, // Loading state for API calls
  error: null, // Error state for API calls
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
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

// Thunk to fetch ratings
export const fetchRatings = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get("/api/ratings");
    dispatch(setRatings(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch ratings"));
  }
};

// Thunk to submit or update a rating
export const submitRating = (storeId, rating) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.post("/api/ratings", { storeId, rating });
    dispatch(fetchRatings()); // Refresh ratings after submission
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to submit rating"));
  }
};

export default ratingSlice.reducer;