import mongoose from "mongoose";
import { categorySchema } from "../models/category.js";

class CategoryService {
  async getCategories() {
    const categories = await categorySchema.find({ isDeleted: false });

    if (!categories.length) {
      throw new Error("No categories found");
    }

    return categories;
  }

  async getCategoryById(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid Category ID");
    }

    const category = await categorySchema.findOne({
      _id: categoryId,
      isDeleted: false,
    });

    if (!category) {
      throw new Error("Category not found or deleted");
    }

    return category;
  }

  async addCategory(categoryDTO) {
    // Check if a category with the same name already exists
    const existedCategory = await categorySchema.findOne({
      name: categoryDTO.name,
    });

    if (existedCategory) {
      throw new Error("Category already exists");
    }

    // Create new category if it does not exist
    return await categorySchema.create(categoryDTO);
  }

  async deleteCategory(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid Category ID");
    }

    // Check if category exists and is not already deleted
    const category = await categorySchema.findOne({
      _id: categoryId,
      isDeleted: false,
    });

    if (!category) {
      throw new Error("Category not found or already deleted");
    }

    // Soft delete by setting `isDeleted: true`
    await categorySchema.findByIdAndUpdate(categoryId, { isDeleted: true });

    return { message: "Category deleted successfully" };
  }

  async updateCategory(categoryId, categoryDTO) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid Category ID");
    }

    // Check if category exists and is not already deleted
    const category = await categorySchema.findOne({
      _id: categoryId,
      isDeleted: false,
    });

    if (!category) {
      throw new Error("Category not found or already deleted");
    }

    // Update category
    return await categorySchema.findByIdAndUpdate(categoryId, categoryDTO, {
      new: true,
    });
  }
}

export const categoryService = new CategoryService();
