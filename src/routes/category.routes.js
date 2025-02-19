import { Router } from "express";
import { categoryController } from "../controller/category.controller.js";

export const categoryRoutes = Router();

categoryRoutes.get("/getCategories", categoryController.getCategories);

categoryRoutes.post("/addCategory", categoryController.addCategory);

categoryRoutes.patch(
  "/updateCategory/:categoryId",
  categoryController.updateCategory
);

categoryRoutes.delete(
  "/deleteCategory/:categoryId",
  categoryController.deleteCategory
);
