import User from "../models/User.js";

export const generateUniqueOwnerId = async () => {
  let ownerId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 6-digit number
    ownerId = Math.floor(100000 + Math.random() * 900000);

    // Check if the ownerId already exists in the database
    const existingUser = await User.findOne({ ownerId });
    if (!existingUser) {
      isUnique = true; // The ownerId is unique
    }
  }

  return ownerId;
};
