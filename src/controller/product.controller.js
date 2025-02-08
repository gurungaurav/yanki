import mongoose from "mongoose";
import { successHandler } from "../handlers/success/successHandler.js";
import { productSchema } from "../models/products.js";
import { categoryService } from "../services/category.service.js";
import { imageService } from "../services/image.service.js";
import { productService } from "../services/product.service.js";
import path from "path";
import { imageSchema } from "../models/image.js";

//!Class for controlling authentication and authorization like login, regi,logout, refresh tokens, etc.
class ProductController {
  addProduct = async (req, res, next) => {
    try {
      const productDTO = req.body;

      if (!req.files || req.files.length === 0) {
        throw new Error("Please upload at least one image.");
      }

      const imagePaths = req.files.map((file) =>
        path.join("uploads", file.filename)
      );

      const categoryId = new mongoose.Types.ObjectId(productDTO.categoryId);

      await categoryService.getCategoryById(categoryId);

      const newProduct = new productSchema({
        name: productDTO.name,
        price: productDTO.price,
        description: productDTO.description,
        stockQuantity: productDTO.quantity,
        categoryId,
      });

      const productAddition = await productService.addProduct(newProduct);

      for (const imagePath of imagePaths) {
        const imageDTO = new imageSchema({
          productId: productAddition._id,
          imageUrl: imagePath,
        });

        await imageService.addImage(imageDTO);
      }

      return successHandler(
        res,
        201,
        productAddition,
        "Product added successfully."
      );
    } catch (e) {
      next(e);
    }
  };
}

export const productController = new ProductController();
