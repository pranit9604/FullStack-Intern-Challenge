import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  stores: [], // List of all stores
  loading: false, // Loading state for API calls
  error: null, // Error state for API calls
};

const storeSlice = createSlice({
  name: "store",
  initialState,
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

// Thunk to fetch all stores
export const fetchStores = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get("/api/stores");
    dispatch(setStores(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch stores"));
  }
};

// Thunk to filter stores by name or address
export const filterStores = (searchTerm) => (dispatch, getState) => {
  const { stores } = getState().store;
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  dispatch(setStores(filteredStores));
};

// Thunk to sort stores by a specific key and order
export const sortStores = (key, order = "asc") => (dispatch, getState) => {
  const { stores } = getState().store;
  const sortedStores = [...stores].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
  dispatch(setStores(sortedStores));
};

// Thunk to create a new store (admin functionality)
export const createStore = (storeData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.post("/api/admin/stores", storeData);
    dispatch(fetchStores()); // Refresh store list
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to create store"));
  }
};

export default storeSlice.reducer;