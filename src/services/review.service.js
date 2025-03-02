import { productService } from "./product.service.js"; // Import the productService
import { reviewSchema } from "../models/review.js"; // Import the review model
import { userService } from "./user.service.js"; // Import the userService
import mongoose from "mongoose";
import { categorySchema } from "../models/category.js";

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
    const newReview = await reviewSchema.create(reviewData);

    return newReview; // Return the newly created review
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
    const reviews = await reviewSchema
      .find({ productId: product, ...filters })
      .populate("userId", "username");

    console.log(reviews);

    return reviews; // Return the reviews
  };

  deleteReview = async (reviewId) => {
    const existReview = await reviewSchema.findOne({ _id: reviewId });

    if (!existReview) {
      throw new Error("Review not found");
    }

    const review = await reviewSchema.findOneAndUpdate(
      { _id: reviewId },
      { isDeleted: !existReview.isDeleted },
      { new: true }
    );
    return !!review;
  };
}

export const reviewService = new ReviewService();
