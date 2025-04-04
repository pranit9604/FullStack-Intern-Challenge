import express from "express";
import { registerUser, loginUser, changePassword } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to register a new user
router.post("/register", registerUser);

// Route to log in a user
router.post("/login", loginUser);

// Route to change password
router.put("/change-password", protect, changePassword); // Add route for changing password

export default router;