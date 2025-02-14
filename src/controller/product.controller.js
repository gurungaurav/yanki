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
        path.join("http://localhost:8000/uploads", file.filename)
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

  getAllProducts = async (req, res, next) => {
    try {
      const filter = { isDeleted: false };

      const { categoryId, minPrice, maxPrice, inStock, search } = req.body;
      console.log(req.body);

      if (categoryId) {
        filter.categoryId = new mongoose.Types.ObjectId(categoryId);
      }

      if (minPrice !== undefined) {
        // $gte (Greater Than or Equal) → Filters products with price >= minPrice
        filter.price = { ...filter.price, $gte: minPrice };
      }

      if (maxPrice !== undefined) {
        // $lte (Less Than or Equal) → Filters products with price <= maxPrice
        filter.price = { ...filter.price, $lte: maxPrice };
      }

      if (inStock !== undefined) {
        // $gt (Greater Than) → Filters products with stock > 0 (available)
        // $eq (Equal) → Filters products with stock = 0 (out of stock)
        filter.stockQuantity = inStock ? { $gt: 0 } : { $eq: 0 };
      }

      if (search) {
        // $regex (Regular Expression) → Performs case-insensitive search on product name
        filter.name = { $regex: search, $options: "i" };
      }

      const products = await productService.getProducts(filter);
      return successHandler(res, 200, products, "All products fetched.");
    } catch (e) {
      next(e);
    }
  };

  getProductById = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const product = await productService.getProductById(productId);
      return successHandler(res, 200, product, "Product fetched successfully.");
    } catch (e) {
      next(e);
    }
  };

  softDeleteProduct = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const isDeleted = await productService.softDeleteProduct(productId);

      if (!isDeleted) {
        throw new Error("Product not found.");
      }

      return successHandler(res, 200, null, "Product deleted successfully.");
    } catch (e) {
      next(e);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const productDTO = req.body;
      const images = productDTO.images || [];

      // Validate product existence
      const existingProduct = await productService.getProductById(productId);
      if (!existingProduct) {
        throw new Error("Product not found.");
      }

      // Construct updated product data
      const updatedData = {
        name: productDTO.name,
        price: productDTO.price,
        description: productDTO.description,
        stockQuantity: productDTO.quantity,
      };

      // Update product
      const updatedProduct = await productService.updateProduct(
        productId,
        updatedData
      );

      // Handle image updates
      for (const image of images) {
        if (image.id) {
          // If image ID exists, delete it
          await imageService.deleteImage(image.id);
        } else if (image.file) {
          // If no ID, add new image
          const imagePath = path.join(
            "http://localhost:8000/uploads",
            image.file.filename
          );
          await imageService.addImage({ productId, imageUrl: imagePath });
        }
      }

      return successHandler(
        res,
        200,
        updatedProduct,
        "Product updated successfully."
      );
    } catch (e) {
      next(e);
    }
  };
}

export const productController = new ProductController();
