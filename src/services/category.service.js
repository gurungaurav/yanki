import mongoose from "mongoose";
import { categorySchema } from "../models/category.js";

class CategoryService {
  async getCategories() {
    const categories = await categorySchema.find().select();

    if (!categories.length) {
      throw new Error("No categories found");
    }

    return categories;
  }

  async getCategoryById(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      console.log("asas");

      throw new Error("Invalid Category ID");
    }

    const category = await categorySchema.findById(categoryId).select();

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async addCategory(categoryDTO) {
    const existedCategory = await categorySchema.findOne(
      categoryDTO.categoryId
    );

    if (existedCategory) {
      throw new Error("Category already exists");
    }

    return await categorySchema.create(categoryDTO);
  }
}

export const categoryService = new CategoryService();
