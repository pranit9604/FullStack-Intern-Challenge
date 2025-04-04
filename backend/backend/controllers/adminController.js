import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    console.log("Fetching dashboard stats..."); // Debugging log
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments(); // Removed extra `)`

    console.log("Dashboard stats fetched successfully:", { totalUsers, totalStores, totalRatings }); // Debugging log
    res.status(200).json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error); // Debugging log
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

// Get all users with filters
export const getUsers = async (req, res) => {
  try {
    console.log("Fetching users with filters:", req.query); // Debugging log
    const { name, email, address, role } = req.query;
    const filters = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (email) filters.email = { $regex: email, $options: "i" };
    if (address) filters.address = { $regex: address, $options: "i" };
    if (role) filters.role = role;

    const users = await User.find(filters);
    const usersWithRatings = await Promise.all(
      users.map(async (user) => {
        if (user.role === "store_owner") {
          const store = await Store.findOne({ owner: user._id });
          const ratings = await Rating.find({ store: store?._id });
          const averageRating =
            ratings.length > 0
              ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
              : 0;
          return { ...user._doc, averageRating: averageRating.toFixed(1) };
        }
        return user;
      })
    );
    console.log("Users fetched successfully:", usersWithRatings); // Debugging log
    res.status(200).json(usersWithRatings);
  } catch (error) {
    console.error("Error fetching users:", error); // Debugging log
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Get all stores with filters
export const getStores = async (req, res) => {
  try {
    console.log("Fetching stores with filters:", req.query); // Debugging log
    const { name, email, address } = req.query;
    const filters = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (email) filters.email = { $regex: email, $options: "i" };
    if (address) filters.address = { $regex: address, $options: "i" };

    const stores = await Store.find(filters).populate("owner", "name email");
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({ store: store._id });
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
            : 0;

        return {
          id: store._id,
          name: store.name,
          email: store.email,
          address: store.address,
          averageRating: averageRating.toFixed(1),
        };
      })
    );
    res.status(200).json(storesWithRatings);
  } catch (error) {
    console.error("Error fetching stores:", error); // Debugging log
    res.status(500).json({ message: "Failed to fetch stores", error: error.message });
  }
};

// Add a new user (normal or admin)
export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validate input
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "Name must be between 20 and 60 characters." });
    }

    if (address.length > 400) {
      return res.status(400).json({ message: "Address must not exceed 400 characters." });
    }

    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(password)) {
      return res.status(400).json({
        message: "Password must be 8-16 characters long, include at least one uppercase letter and one special character.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword, address, role });
    console.log("User added successfully:", user); // Debugging log

    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    console.error("Error adding user:", error); // Debugging log
    res.status(500).json({ message: "Failed to add user", error: error.message });
  }
};

// Add a new store
export const addStore = async (req, res) => {
  try {
    const { name, email, address, owner } = req.body;

    console.log("Received store data:", { name, email, address, owner }); // Debugging log

    // Validate input
    if (!name || !email || !address || !owner) {
      console.log("Validation failed: Missing required fields."); // Debugging log
      return res.status(400).json({ message: "All fields are required" });
    }

    if (name.length < 3 || name.length > 100) {
      console.log("Validation failed: Invalid store name length."); // Debugging log
      return res.status(400).json({ message: "Store name must be between 3 and 100 characters." });
    }

    if (address.length > 400) {
      console.log("Validation failed: Address too long."); // Debugging log
      return res.status(400).json({ message: "Address must not exceed 400 characters." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Validation failed: Invalid email format."); // Debugging log
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if the owner exists
    const ownerExists = await User.findById(owner);
    if (!ownerExists || ownerExists.role !== "store_owner") {
      console.log("Validation failed: Owner is not a store owner."); // Debugging log
      return res.status(400).json({ message: "Owner must be a valid store owner." });
    }

    // Check for duplicate email
    const existingStore = await Store.findOne({ email });
    if (existingStore) {
      console.log("Validation failed: Duplicate store email."); // Debugging log
      return res.status(400).json({ message: "Store email already exists." });
    }

    // Create store
    const store = await Store.create({ name, email, address, owner });
    console.log("Store added successfully:", store); // Debugging log

    res.status(201).json({ message: "Store added successfully", store });
  } catch (error) {
    console.error("Error adding store:", error); // Debugging log
    res.status(500).json({ message: "Failed to add store", error: error.message });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, address, role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Update store details
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;
    const store = await Store.findByIdAndUpdate(
      id,
      { name, email, address },
      { new: true }
    );
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.status(200).json({ message: "Store updated successfully", store });
  } catch (error) {
    console.error("Error updating store:", error);
    res.status(500).json({ message: "Failed to update store" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "store_owner") {
      const store = await Store.findOne({ owner: user._id });
      const ratings = await Rating.find({ store: store?._id });
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
          : 0;
      return res.status(200).json({ ...user._doc, averageRating: averageRating.toFixed(1) });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

export const getStoreOwners = async (req, res) => {
  try {
    console.log("Fetching store owners..."); // Debugging log
    const storeOwners = await User.find({ role: "store_owner" }).select("_id email name");
    console.log("Store owners fetched successfully:", storeOwners); // Debugging log
    res.status(200).json(storeOwners);
  } catch (error) {
    console.error("Error fetching store owners:", error); // Debugging log
    res.status(500).json({ message: "Failed to fetch store owners", error: error.message });
  }
};