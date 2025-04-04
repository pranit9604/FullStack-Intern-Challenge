import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    store: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Store", 
      required: true // Keep this field
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 // Ensure rating is between 1 and 5
    },
  },
  { timestamps: true }
);

// Prevent duplicate ratings by the same user for the same store
RatingSchema.index({ user: 1, store: 1 }, { unique: true });

const Rating = mongoose.models.Rating || mongoose.model("Rating", RatingSchema);
export default Rating;