import mongoose from "mongoose";
import { successHandler } from "../handlers/success/successHandler.js";
import { productSchema } from "../models/products.js";
import { categoryService } from "../services/category.service.js";
import { imageService } from "../services/image.service.js";
import { productService } from "../services/product.service.js";
import { imageSchema } from "../models/image.js";

//!Class for controlling authentication and authorization like login, regi,logout, refresh tokens, etc.
class ProductController {
  addProduct = async (req, res, next) => {
    try {
      const productDTO = req.body;

      if (!req.files || req.files.length === 0) {
        throw new Error("Please upload at least one image.");
      }

      const imagePaths = req.files.map(
        (file) => `http://localhost:8000/uploads/${file.filename}`
      );

      if (!mongoose.Types.ObjectId.isValid(productDTO.categoryId)) {
        throw new Error("Invalid Category ID");
      }

      const categoryId = new mongoose.Types.ObjectId(productDTO.categoryId);

      await categoryService.getCategoryById(categoryId);

      const newProduct = new productSchema({
        name: productDTO.productName,
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
      const {
        categoryId,
        minPrice,
        maxPrice,
        inStock,
        search,
        productId,
        limit = 100,
        isDeleted,
      } = req.query;

      const filter = {};

      //If the product id and category id exists then remove that specific product and show the categories according to the category id
      if (productId && categoryId) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          throw new Error("Invalid Product ID");
        }
        filter._id = { $ne: new mongoose.Types.ObjectId(productId) };
      }

      if (isDeleted !== undefined) {
        filter.isDeleted = isDeleted;
      }

      if (categoryId) {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          throw new Error("Invalid Category ID");
        }
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

      const options = {
        limit: parseInt(limit),
      };

      const products = await productService.getProducts(filter, options);
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

      const product = await productService.getProductById(productId);

      await productService.softDeleteProduct(product._id, product.isDeleted);

      return successHandler(res, 200, null, "Product deleted successfully.");
    } catch (e) {
      next(e);
    }
  };

  // update product
  updateProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const productDTO = req.body; // Destructure to get product data from body
      const images = req.files || []; // Correctly access the files (req.files)

      // Fetch the existing product to check for validity
      const existingProduct = await productService.getProductById(productId);
      if (!existingProduct) {
        throw new Error("Product not found.");
      }

      const updatedData = {};

      if (productDTO.name) {
        updatedData.name = productDTO.name;
      }

      if (productDTO.price) {
        updatedData.price = productDTO.price;
      }

      if (productDTO.description) {
        updatedData.description = productDTO.description;
      }

      if (productDTO.stockQuantity) {
        updatedData.stockQuantity = productDTO.stockQuantity;
      }

      if (productDTO.categoryId) {
        if (!mongoose.Types.ObjectId.isValid(productDTO.categoryId)) {
          throw new Error("Invalid Category ID");
        }

        updatedData.categoryId = new mongoose.Types.ObjectId(
          productDTO.categoryId
        );
      }

      // Update the product with new data
      const updatedProduct = await productService.updateProduct(
        productId,
        updatedData
      );

      const deletedImages = JSON.parse(productDTO.imagesToDelete);
      // Handle image updates: delete old images
      if (Array.isArray(deletedImages)) {
        for (const imageId of deletedImages) {
          if (imageId.trim() !== "") {
            // Ensure it's not an empty string
            await imageService.deleteImage(
              new mongoose.Types.ObjectId(imageId)
            );
          }
        }
      }

      // Skip image upload if no new images are provided
      if (images.length > 0) {
        console.log("Processing new images...");
        const imagePaths = req.files.map(
          (file) => `http://localhost:8000/uploads/${file.filename}`
        );
        for (const imagePath of imagePaths) {
          const imageDTO = new imageSchema({
            productId: productId,
            imageUrl: imagePath,
          });

          await imageService.addImage(imageDTO);
        }
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
