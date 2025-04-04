import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Alert, Rating } from "@mui/material";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch stores and user ratings when component mounts
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("/api/stores");
        setStores(response.data);
      } catch (error) {
        console.error(error);
        setError("Error fetching stores");
      }
    };

    const fetchUserRatings = async () => {
      try {
        const response = await axios.get("/api/ratings");
        const ratings = response.data.reduce((acc, rating) => {
          acc[rating.store] = rating.rating;
          return acc;
        }, {});
        setUserRatings(ratings);
      } catch (error) {
        console.error(error);
        setError("Error fetching user ratings");
      }
    };

    fetchStores();
    fetchUserRatings();
  }, []);

  // Handle rating change for each store
  const handleRatingChange = (storeId, ratingValue) => {
    setUserRatings((prevRatings) => ({ ...prevRatings, [storeId]: ratingValue }));
  };

  // Submit or update rating for the store
  const submitRating = async (storeId) => {
    if (!userRatings[storeId]) {
      setError("Please select a rating before submitting.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      await axios.post("/api/ratings", { storeId, rating: userRatings[storeId] });
      setSuccess("Rating submitted successfully");
    } catch (error) {
      console.error(error);
      setError("Error submitting rating");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stores
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {stores.length === 0 ? (
        <Typography>No stores available</Typography>
      ) : (
        stores.map((store) => (
          <Box
            key={store._id}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 4,
              p: 2,
              mb: 2,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h5">{store.name}</Typography>
            <Typography variant="body1">{store.address}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Typography variant="body2">Overall Rating:</Typography>
              <Rating value={store.averageRating || 0} precision={0.5} readOnly />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Typography variant="body2">Your Rating:</Typography>
              <Rating
                value={userRatings[store._id] || 0}
                precision={1}
                onChange={(e, newValue) => handleRatingChange(store._id, newValue)}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => submitRating(store._id)}
            >
              {userRatings[store._id] ? "Update Rating" : "Submit Rating"}
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default StoreList;