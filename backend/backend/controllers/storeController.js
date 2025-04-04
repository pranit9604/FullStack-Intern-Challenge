import Store from "../models/Store.js";
import Rating from "../models/Rating.js";

export const createStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    // Validate input
    if (!name || !email || !address) {
      return res.status(400).json({ message: "Name, email, and address are required" });
    }

    // Ensure the owner is set to the logged-in user
    const store = await Store.create({ ...req.body, owner: req.user.userId });
    res.status(201).json({ message: "Store created successfully", store });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    // Build query filters
    const filters = {};
    if (name) {
      filters.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }
    if (address) {
      filters.address = { $regex: address, $options: "i" }; // Case-insensitive search
    }

    // Fetch stores with filters
    const stores = await Store.find(filters);

    // Calculate average ratings for each store
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
            email: store.email, // Include email
            address: store.address,
            averageRating: averageRating.toFixed(1), // Round to 1 decimal place
          };
        })
      );

    res.json(storesWithRatings);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByIdAndDelete(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ message: "Failed to delete store" });
  }
};

export const getMyStoreDetails = async (req, res) => {
  try {
    console.log("Fetching store for user:", req.user.userId); // Debugging log

    // Find the store owned by the logged-in user
    const store = await Store.findOne({ owner: req.user.userId });
    if (!store) {
      console.log("No store found for user:", req.user.userId); // Debugging log
      return res.status(404).json({ message: "Store not found" });
    }

    // Fetch ratings for the store
    const ratings = await Rating.find({ store: store._id }).populate("user", "name");
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
        : 0;

    // Add the average rating to the store object
    const storeWithRating = {
      ...store._doc,
      averageRating: averageRating.toFixed(1),
    };

    res.status(200).json({ store: storeWithRating, ratings });
  } catch (error) {
    console.error("Error fetching store details:", error);
    res.status(500).json({ message: "Failed to fetch store details", error: error.message });
  }
};