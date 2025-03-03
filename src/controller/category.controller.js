import { successHandler } from "../handlers/success/successHandler.js";
import { categoryService } from "../services/category.service.js";

class CategoryController {
  addCategory = async (req, res, next) => {
    try {
      const category = req.body;
      console.log("----->", category);

      const categoryAddition = await categoryService.addCategory(category);
      console.log("----->", categoryAddition);

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
      //if isDeleted is passed in query then it will be passed to getCategories method and if it is not passed then it will be false
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

  updateCategory = async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const category = req.body;

      if (!categoryId) {
        throw new Error("Category ID is required");
      }

      const response = await categoryService.updateCategory(
        categoryId,
        category
      );

      return successHandler(
        res,
        200,
        response,
        "Category updated successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  deleteCategory = async (req, res, next) => {
    try {
      const { categoryId } = req.params; // Now correctly extracting from params

      if (!categoryId) {
        throw new Error("Category ID is required");
      }

      const response = await categoryService.deleteCategory(categoryId);

      return successHandler(
        res,
        200,
        response,
        "Category deleted successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  updateCategory = async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;

      if (!categoryId) {
        throw new Error("Category ID is required");
      }

      const response = await categoryService.updateCategory(categoryId, name);

      return successHandler(
        res,
        200,
        response,
        "Category updated successfully."
      );
    } catch (e) {
      next(e);
    }
  };
}

export const categoryController = new CategoryController();
