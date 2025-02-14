import mongoose from "mongoose";
import { successHandler } from "../handlers/success/successHandler.js";
import { productSchema } from "../models/products.js";
import { categoryService } from "../services/category.service.js";
import { imageService } from "../services/image.service.js";
import { productService } from "../services/product.service.js";
import path from "path";
import { imageSchema } from "../models/image.js";
import { Console } from "console";

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

      console.log("Received Filters:", req.body);

      if (categoryId) {
        filter.categoryId = new mongoose.Types.ObjectId(categoryId);
      }

      // Ensure price range values are numbers before applying filters
      const min = minPrice !== undefined ? Number(minPrice) : undefined;
      const max = maxPrice !== undefined ? Number(maxPrice) : undefined;

      if (!isNaN(min) || !isNaN(max)) {
        filter.price = {};
        if (!isNaN(min)) filter.price.$gte = min;
        if (!isNaN(max)) filter.price.$lte = max;
      }

      // Handle stock availability filter
      if (inStock !== undefined) {
        filter.stockQuantity = inStock ? { $gt: 0 } : { $eq: 0 };
      }

      // Ensure search term is not an empty string
      if (search && search.trim() !== "") {
        filter.name = { $regex: search.trim(), $options: "i" };
      }

      console.log("Final MongoDB Filter:", JSON.stringify(filter, null, 2));

      const products = await productService.getProducts(filter);
      return successHandler(res, 200, products, "All products fetched.");
    } catch (e) {
      console.error("Error fetching products:", e);
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

  // update product
  updateProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { body: productDTO } = req; // Destructure to get product data from body
      const images = req.files || []; // Correctly access the files (req.files)

      console.log("Received Product ID:", productId);
      console.log("Product Data from Body:", productDTO);
      console.log("Uploaded Images:", images);

      // Fetch the existing product to check for validity
      const existingProduct = await productService.getProductById(productId);
      if (!existingProduct) {
        console.log("Product not found.");
        return next(new Error("Product not found."));
      }
      console.log("Existing Product Found:", existingProduct);

      // Construct updated product data from the request body
      const updatedData = {
        name: productDTO.name,
        price: productDTO.price,
        description: productDTO.description,
        stockQuantity: productDTO.stockQuantity,
      };

      console.log("Updated Product Data:", updatedData);

      // Update the product with new data
      const updatedProduct = await productService.updateProduct(
        productId,
        updatedData
      );
      console.log("Updated Product:", updatedProduct);

      // Handle image updates: delete old images
      if (Array.isArray(productDTO.imagesToDelete)) {
        for (const imageId of productDTO.imagesToDelete) {
          if (imageId.trim() !== "") {
            // Ensure it's not an empty string
            console.log(`Deleting image with ID: ${imageId}`);
            await imageService.deleteImage(imageId);
          }
        }
      }

      // Handle image updates: delete old images
      if (productDTO.imagesToDelete) {
        const imageIdsToDelete = productDTO.imagesToDelete.split(","); // Assuming multiple IDs are comma-separated in body
        console.log("Deleting images with IDs:", imageIdsToDelete);

        for (const imageId of imageIdsToDelete) {
          console.log(`Deleting image with ID: ${imageId}`);
          await imageService.deleteImage(imageId);
        }
      } else {
        console.log("No images to delete.");
      }

      // Skip image upload if no new images are provided
      if (images.length > 0) {
        console.log("Processing new images...");
        for (const image of images) {
          const imagePath = path.join(
            "http://localhost:8000/uploads",
            image.filename
          );
          console.log(`Adding new image with path: ${imagePath}`);
          await imageService.addImage({ productId, imageUrl: imagePath });
        }
      } else {
        console.log("No new images to upload.");
      }

      return successHandler(
        res,
        200,
        updatedProduct,
        "Product updated successfully."
      );
    } catch (error) {
      console.error("Error updating product:", error);
      next(error);
    }
  };
}

export const productController = new ProductController();
