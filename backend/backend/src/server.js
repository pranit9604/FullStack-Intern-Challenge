import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import storeRoutes from "../routes/storeRoutes.js";
import ratingRoutes from "../routes/ratingRoutes.js"; // Import ratingRoutes
import userRoutes from "../routes/userRoutes.js";
import adminRoutes from "../routes/adminRoutes.js"; // Ensure adminRoutes is imported
import { notFound, errorHandler } from "../middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({ origin: "http://localhost:3000" })); // Allow requests from the frontend

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes); // Register ratingRoutes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); // Register admin routes

// Handle undefined routes
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit process with failure
  });