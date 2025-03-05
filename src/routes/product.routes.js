import { Router } from "express";
import { productController } from "../controller/product.controller.js";
import { upload } from "../config/multer.config.js";

export const productRoutes = Router();

productRoutes.post(
  "/addProduct",
  upload.array("images", 10), // Allow up to 10 image uploads
  productController.addProduct
);

productRoutes.get("/getProducts", productController.getAllProducts);

productRoutes.get(
  "/getProductById/:productId",
  productController.getProductById
);

productRoutes.patch(
  "/updateProduct/:productId",
  upload.array("images", 10), // Handle image uploads while updating
  productController.updateProduct
);

productRoutes.patch(
  "/deleteProduct/:productId",
  productController.softDeleteProduct
);
