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
      const categories = await categoryService.getCategories();

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
}

export const categoryController = new CategoryController();
