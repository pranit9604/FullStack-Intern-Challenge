import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 20, maxlength: 60 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validate email format
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 16,
    match: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
  },
  address: { type: String, required: true, maxlength: 400 },
  role: { type: String, enum: ["admin", "user", "store_owner"], default: "user" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;