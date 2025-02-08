import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  imageUrl: { type: String, required: true },
});

export const imageSchema = mongoose.model("images", ImageSchema);
