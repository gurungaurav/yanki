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
    // const skip = (page - 1) * limit;

    const products = await productSchema
      .find(filter)
      .sort({ createdAt: -1 })
      // .sort(sort)
      // .skip(skip)
      .limit(limit)
      .populate("categoryId", "name")
      .lean();

    const productList = await Promise.all(
      products.map(async (product) => {
        const images = await imageSchema
          .find({ productId: product._id })
          .select("imageUrl");

        // Fetch reviews
        const reviews = await reviewSchema
          .find({ productId: product._id })
          .lean();

        const reviewsArray = reviews || []; // Ensure `reviews` is always an array

        // Calculate the reviews count
        const reviewsCount = reviewsArray.length;

        // Calculate the average rating (rounded to nearest 0.5)
        const totalRating = reviewsArray.reduce(
          (acc, review) => acc + (review.rating || 0),
          0
        );
        const averageRating =
          reviewsCount > 0
            ? Math.round((totalRating / reviewsCount) * 2) / 2 // Round to nearest 0.5
            : 0;

        return {
          ...product,
          image: images[0].imageUrl,
          hoverImage: images[1].imageUrl,
          rating: averageRating,
          reviewsCount,
        };
      })
    );

    // console.log(productList);

    return productList;
  }

  async addProduct(productDTO) {
    return await productSchema.create(productDTO);
  }

  async softDeleteProduct(productId, isDeleted) {
    const product = await productSchema.findOneAndUpdate(
      { _id: productId },
      { isDeleted: !isDeleted },
      { new: true }
    );

    return !!product;
  }

  // In productService.js
  async updateProduct(productId, updatedData) {
    const product = await productSchema.findOneAndUpdate(
      { _id: productId }, // Use _id field to find the product
      updatedData, // The updated data
      { new: true } // Return the updated product
    );
    return product;
  }
}

export const productService = new ProductService();
