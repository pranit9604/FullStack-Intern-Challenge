import express from "express";
import { updateUser, updateStore, getDashboardStats, getUsers, getStores, addUser, addStore, getUserDetails, getStoreOwners } from "../controllers/adminController.js";
import { protect, roleCheck } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to update user details
router.put("/users/:id", protect, roleCheck(["admin"]), updateUser);

// Route to update store details
router.put("/stores/:id", protect, roleCheck(["admin"]), updateStore);

// Admin-only routes
router.get("/dashboard-stats", protect, roleCheck(["admin"]), getDashboardStats);
router.get("/users", protect, roleCheck(["admin"]), getUsers);
router.get("/users/:id", protect, roleCheck(["admin"]), getUserDetails); // Add route to fetch user details
router.get("/stores", protect, roleCheck(["admin"]), getStores);
router.post("/users", protect, roleCheck(["admin"]), addUser); // Add new user
router.post("/stores", protect, roleCheck(["admin"]), addStore); // Add new store
router.get("/store-owners", protect, roleCheck(["admin"]), getStoreOwners); // Fetch store owners

export default router;
