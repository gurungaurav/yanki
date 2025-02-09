import { Router } from "express";
import { categoryRoutes } from "./category.routes.js";
import { productController } from "../controller/product.controller.js";
import { upload } from "../config/multer.config.js";

export const productRoutes = Router();

productRoutes.post(
  "/addProduct",
  upload.array("images", 10),
  // validateSchema(userRegisterSchema),
  productController.addProduct
);
productRoutes.get("/getProducts", productController.getAllProducts);

productRoutes.get(
  "/getProductById/:productId",
  productController.getProductById
);

productRoutes.patch(
  "/deleteProduct/:productId",
  productController.softDeleteProduct
);

productRoutes.use("/category", categoryRoutes);
