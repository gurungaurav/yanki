import { productService } from "./product.service.js"; // Import the productService
import { reviewSchema } from "../models/review.js"; // Import the review model
import mongoose from "mongoose";

class ReviewService {
  addReview = async (reviewDTO, userId) => {
    // Convert productId from reviewDTO into an ObjectId
    const productId = new mongoose.Types.ObjectId(reviewDTO.productId);

    // Check if the product exists
    const existProduct = await productService.getProductById(productId);

    if (!existProduct) {
      throw new Error("Product not found");
    }

    // Create a new review
    const reviewData = {
      productId,
      userId, // Instead of 'existUser', pass 'userId'
      rating: reviewDTO.rating,
      review: reviewDTO.review,
      reviewDate: new Date(),
    };

    // Save the review in the database
    return await reviewSchema.create(reviewData);
  };

  getAllReviews = async (productId, filters) => {
    // Convert productId from params into an ObjectId
    const product = new mongoose.Types.ObjectId(productId);

    // Check if the product exists
    const existProduct = await productService.getProductById(product);
    if (!existProduct) {
      throw new Error("Product not found");
    }

    // Find all reviews for the product
    return await reviewSchema
      .find({ productId: product, ...filters })
      .populate("userId", "username");
  };

  updateReview = async (reviewId, reviewDTO) => {
    // Check if the review exists
    const review = await reviewSchema.findOne({ _id: reviewId });

    if (!review) {
      throw new Error("Review not found");
    }

    return await reviewSchema.findOneAndUpdate(
      { _id: reviewId },
      { ...reviewDTO },
      { new: true }
    );
  };

  deleteReview = async (reviewId) => {
    const existReview = await reviewSchema.findOne({ _id: reviewId });

    if (!existReview) {
      throw new Error("Review not found");
    }

    return await reviewSchema.findOneAndUpdate(
      { _id: reviewId },
      { isDeleted: !existReview.isDeleted },
      { new: true }
    );
  };
}

export const reviewService = new ReviewService();
