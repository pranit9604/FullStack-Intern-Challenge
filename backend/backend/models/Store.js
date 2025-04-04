import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: 3,
      maxlength: 100 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validate email format
    },
    address: { 
      type: String, 
      required: true, 
      maxlength: 400 
    },
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true // Ensure this field is linked to the User model
    },
    averageRating: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
  },
  { timestamps: true }
);

const Store = mongoose.models.Store || mongoose.model("Store", StoreSchema);
export default Store;