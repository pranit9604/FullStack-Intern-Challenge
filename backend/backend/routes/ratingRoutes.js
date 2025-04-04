import express from "express";
import { getUserRatings, submitRating } from "../controllers/ratingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to fetch ratings for the logged-in user
router.get("/", protect, getUserRatings);

// Route to submit a new rating
router.post("/", protect, submitRating); // Ensure this route is registered and protected

export default router;