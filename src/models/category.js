import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false }, // Soft delete flag
});

export const categorySchema = mongoose.model("categories", CategorySchema);
