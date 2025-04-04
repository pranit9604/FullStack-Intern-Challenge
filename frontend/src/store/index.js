import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import ratingReducer from "./ratingSlice";
import storeReducer from "./storeSlice";
import userReducer from "./userSlice"; // For managing user-related state

const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication state
    rating: ratingReducer, // Ratings state
    store: storeReducer, // Stores state
    user: userReducer, // Users state (e.g., admin user management)
  },
});

export default store;