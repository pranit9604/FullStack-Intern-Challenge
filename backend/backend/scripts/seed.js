import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Store from "../models/Store.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany();
    await Store.deleteMany();

    // Seed users
    const admin = await User.create({
      name: "System Administrator",
      email: "admin@example.com",
      password: "Admin@123", // Ensure this is hashed in production
      address: "Admin Address",
      role: "admin",
    });

    const storeOwner = await User.create({
      name: "Store Owner",
      email: "owner@example.com",
      password: "Owner@123", // Ensure this is hashed in production
      address: "Owner Address",
      role: "store_owner",
    });

    const normalUser = await User.create({
      name: "Normal User",
      email: "user@example.com",
      password: "User@123", // Ensure this is hashed in production
      address: "User Address",
      role: "user",
    });

    // Seed stores
    await Store.create({
      name: "Test Store",
      email: "store@example.com",
      address: "Store Address",
      owner: storeOwner._id,
    });

    console.log("Data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
