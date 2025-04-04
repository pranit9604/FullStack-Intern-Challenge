import express from "express";
import { createStore, getStores, deleteStore, getMyStoreDetails } from "../controllers/storeController.js";
import { protect, roleCheck } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new store (restricted to admin or store_owner roles)
router.post("/", protect, roleCheck(["admin", "store_owner"]), createStore);

// Route to get a list of all stores (accessible to all users)
router.get("/", getStores);

// Route to delete a store (restricted to admin role)
router.delete("/:id", protect, roleCheck(["admin"]), deleteStore);

// Route to fetch store details and ratings for the logged-in store owner
router.get("/my-store", protect, roleCheck(["store_owner"]), getMyStoreDetails);

export default router;