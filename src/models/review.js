import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
});

export const reviewSchema = mongoose.model("reviews", ReviewSchema);
