import Rating from "../models/Rating.js";
import Store from "../models/Store.js";

// Fetch user ratings
export const getRatings = async (req, res) => {
  try {
    const userId = req.user.userId; // Ensure `req.user` is set by the `protect` middleware
    const ratings = await Rating.find({ user: userId }).populate("store", "name address");
    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ message: "No ratings found for this user" });
    }
    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Failed to fetch ratings", error: error.message });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch ratings submitted by the logged-in user
    const ratings = await Rating.find({ user: userId }).populate("store", "name address");

    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ message: "Failed to fetch user ratings" });
  }
};

// Submit or update a rating
export const submitRating = async (req, res) => {
  try {
    console.log("Submit Rating Request Body:", req.body); // Debugging log
    const { email, rating } = req.body;

    // Validate input
    if (!email) {
      console.log("Validation failed: Store email is required."); // Debugging log
      return res.status(400).json({ message: "Store email is required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      console.log("Validation failed: Invalid rating."); // Debugging log
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Validation failed: Invalid email format."); // Debugging log
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the store exists
    const store = await Store.findOne({ email });
    if (!store) {
      console.log("Validation failed: Store not found."); // Debugging log
      return res.status(404).json({ message: "Store not found" });
    }

    const userId = req.user.userId;

    // Check if the user has already rated this store
    let userRating = await Rating.findOne({ user: userId, store: store._id });
    if (userRating) {
      // Update the existing rating
      userRating.rating = rating;
      await userRating.save();
      console.log("Rating updated successfully:", userRating); // Debugging log
      return res.status(200).json({ message: "Rating updated successfully", rating: userRating });
    }

    // Create a new rating
    const newRating = await Rating.create({ user: userId, store: store._id, rating });
    console.log("Rating submitted successfully:", newRating); // Debugging log
    res.status(201).json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Failed to submit rating", error: error.message });
  }
};

// Fetch store ratings
export const getStoreRatings = async (req, res) => {
  try {
    const storeId = req.user.storeId; // Ensure `req.user` contains `storeId`
    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required" });
    }

    const ratings = await Rating.find({ store: storeId }).populate("user", "name email");
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
        : 0;

    res.status(200).json({ ratings, averageRating });
  } catch (error) {
    console.error("Error fetching store ratings:", error);
    res.status(500).json({ message: "Failed to fetch store ratings", error: error.message });
  }
};