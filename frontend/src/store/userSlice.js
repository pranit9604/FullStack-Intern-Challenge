import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null, // Current user details
  users: [], // List of all users (for admin management)
  loading: false, // Loading state for API calls
  error: null, // Error state for API calls
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
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
    logout: (state) => {
      state.user = null;
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, setUsers, setLoading, setError, logout } = userSlice.actions;

// Thunk to fetch current user details
export const fetchUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get("/api/users/me");
    dispatch(setUser(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch user details"));
  }
};

// Thunk to fetch all users (for admin management)
export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get("/api/admin/users");
    dispatch(setUsers(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch users"));
  }
};

// Thunk to update user details
export const updateUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put("/api/users/me", userData);
    dispatch(setUser(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to update user details"));
  }
};

// Thunk to create a new user (admin functionality)
export const createUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.post("/api/admin/users", userData);
    dispatch(fetchUsers()); // Refresh user list
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to create user"));
  }
};

// Thunk to update user password
export const updatePassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.put("/api/users/update-password", passwordData);
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to update password"));
  }
};

export default userSlice.reducer;