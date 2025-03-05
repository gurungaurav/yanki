import mongoose from "mongoose";
import { categorySchema } from "../models/category.js";
import { imageSchema } from "../models/image.js";
import { productSchema } from "../models/products.js";
import { reviewSchema } from "../models/review.js";

class ProductService {
  async getProductById(productId) {
    // Validate if the productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    const productid = new mongoose.Types.ObjectId(productId);

    const product = await productSchema
      .findOne({ _id: productid })
      .populate("categoryId", "name")
      .lean();

    if (!product) {
      throw new Error("Product not found");
    }

    const images = await imageSchema.find({ productId }).select("imageUrl");

    const reviews = await reviewSchema.find({ isDeleted: false, productId });
    const reviewCount = reviews.length;
    const rating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount;

    return { ...product, images, rating, reviewCount };
  }

  async getProducts(filter, options) {
    const { limit } = options;

    const products = await productSchema
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("categoryId", "name")
      .lean();

    const productList = await Promise.all(
      products.map(async (product) => {
        const images = await imageSchema
          .find({ productId: product._id })
          .select("imageUrl");

        return {
          ...product,
          image: images[0].imageUrl,
          hoverImage: images[1].imageUrl,
        };
      })
    );

    return productList;
  }

  async addProduct(productDTO) {
    return await productSchema.create(productDTO);
  }

  async softDeleteProduct(productId, isDeleted) {
    return await productSchema.findOneAndUpdate(
      { _id: productId },
      { isDeleted: !isDeleted },
      { new: true }
    );
  }

  // In productService.js
  async updateProduct(productId, updatedData) {
    return await productSchema.findOneAndUpdate(
      { _id: productId }, // Use _id field to find the product
      updatedData, // The updated data
      { new: true } // Return the updated product
    );
  }
}

export const productService = new ProductService();
