import mongoose from "mongoose";
import { categorySchema } from "../models/category.js";
import { productSchema } from "../models/products.js";

class CategoryService {
  async getCategories(filters) {
    return await categorySchema.find(filters);
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

    // Check if category exists
    const category = await categorySchema.findOne({
      _id: categoryId,
    });

    if (!category) {
      throw new Error("Category not found or already deleted");
    }

    // Check if there are any products associated with this category
    const associatedProducts = await productSchema.find({
      categoryId: categoryId,
      isDeleted: false,
    });

    if (associatedProducts.length > 0) {
      const productNames = associatedProducts
        .map((product) => product.name)
        .join(", ");
      throw new Error(
        `Cannot delete category. It is associated with the following products: ${productNames}`
      );
    }

    // If the category is already deleted, it will be undeleted
    const isDeleted = !category.isDeleted;

    // Soft delete by setting `isDeleted: true`
    return await categorySchema.findByIdAndUpdate(categoryId, { isDeleted });
  }

  async updateCategory(categoryId, name) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid Category ID");
    }

    // Check if category exists and is not already deleted
    const category = await categorySchema.findOne({
      _id: categoryId,
    });

    if (!category) {
      throw new Error("Category not found or already deleted");
    }

    // Update category
    return await categorySchema.findOneAndUpdate(
      { _id: categoryId },
      { name },
      { new: true } // Return the updated document
    );
  }
}

export const categoryService = new CategoryService();
