import { successHandler } from "../handlers/success/successHandler.js";
import { categoryService } from "../services/category.service.js";

class CategoryController {
  addCategory = async (req, res, next) => {
    try {
      const category = req.body;

      const categoryAddition = await categoryService.addCategory(category);

      return successHandler(
        res,
        201,
        categoryAddition,
        "Category added successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  getCategories = async (req, res, next) => {
    try {
      const { isDeleted } = req.query;
      const filters = {};

      if (isDeleted) {
        filters.isDeleted = isDeleted;
      }

      const categories = await categoryService.getCategories(filters);

      return successHandler(
        res,
        200,
        categories,
        "Categories fetched successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  deleteCategory = async (req, res, next) => {
    try {
      const { categoryId } = req.params; // Now correctly extracting from params

      await categoryService.deleteCategory(categoryId);

      return successHandler(res, 201, null, "Category deleted successfully.");
    } catch (e) {
      next(e);
    }
  };

  updateCategory = async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;

      await categoryService.updateCategory(categoryId, name);

      return successHandler(res, 201, null, "Category updated successfully.");
    } catch (e) {
      next(e);
    }
  };
}

export const categoryController = new CategoryController();
