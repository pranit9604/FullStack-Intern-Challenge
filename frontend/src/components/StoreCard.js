import React, { useState } from "react";
import { Card, CardContent, Typography, Rating, Button, Box } from "@mui/material";
import RatingForm from "./RatingForm";

const StoreCard = ({ store, userRating, onRatingSubmit }) => {
  const [showRatingForm, setShowRatingForm] = useState(false);

  const handleRatingClick = () => {
    setShowRatingForm(!showRatingForm);
  };

  return (
    <Card sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {store.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {store.address}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">Overall Rating:</Typography>
          <Rating value={store.averageRating || 0} precision={0.5} readOnly />
        </Box>
        {userRating !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Typography variant="body2">Your Rating:</Typography>
            <Rating value={userRating} precision={0.5} readOnly />
          </Box>
        )}
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleRatingClick}
        >
          {showRatingForm ? "Cancel" : userRating ? "Update Rating" : "Submit Rating"}
        </Button>
        {showRatingForm && (
          <RatingForm
            storeId={store._id}
            existingRating={userRating}
            onRatingSubmit={onRatingSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StoreCard;