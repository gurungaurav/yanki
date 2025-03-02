import { Router } from "express";
import { productController } from "../controller/product.controller.js";
import { upload } from "../config/multer.config.js";

export const productRoutes = Router();

// Route to add a product
productRoutes.post(
  "/addProduct",
  upload.array("images", 10), // Allow up to 10 image uploads
  // validateSchema(productSchema),
  productController.addProduct
);

// Route to get all products
productRoutes.get("/getProducts", productController.getAllProducts);

// Route to get a single product by ID
productRoutes.get(
  "/getProductById/:productId",
  productController.getProductById
);

// Route to update a product
productRoutes.patch(
  "/updateProduct/:productId",
  upload.array("images", 10), // Handle image uploads while updating
  // validateSchema(updateProductSchema), // Validate the request body for the update
  productController.updateProduct
);

// Route to soft delete a product
productRoutes.patch(
  "/deleteProduct/:productId",
  productController.softDeleteProduct
);
