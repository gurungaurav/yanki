import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false },
});

export const categorySchema = mongoose.model("categories", CategorySchema);
