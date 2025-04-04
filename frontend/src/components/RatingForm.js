import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert, MenuItem } from "@mui/material";
import API from "../utils/api";

const RatingForm = ({ email, onRatingSubmit }) => { // Use email instead of storeId
  const [rating, setRating] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate rating input
    if (!rating || rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      setError(null); // Clear previous errors
      setSuccess(null); // Clear previous success messages

      console.log("Submitting rating:", { email, rating }); // Debugging log

      // Submit the rating to the backend
      const response = await API.post("/ratings", { email, rating }); // Use email instead of storeId
      setSuccess(response.data.message || "Rating submitted successfully!");

      // Clear the rating input
      setRating("");

      // Trigger callback to refresh ratings (if provided)
      if (onRatingSubmit) {
        onRatingSubmit(rating);
      }
    } catch (err) {
      console.error("Error submitting rating:", err.response || err);
      setError(err.response?.data?.message || "Failed to submit rating. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6">Submit Your Rating</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        select
        label="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        fullWidth
        required
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Submit Rating
      </Button>
    </Box>
  );
};

export default RatingForm;