import { successHandler } from "../handlers/success/successHandler.js";
import { reviewService } from "../services/review.service.js";

class ReviewController {
  addReview = async (req, res, next) => {
    try {
      const reviewDTO = req.body;
      const userId = req.user._id; // Access userId from req.user (set by JWT middleware)

      // Pass userId and reviewDTO to service method
      const newReview = await reviewService.addReview(reviewDTO, userId);

      return successHandler(res, 201, newReview, "Review added successfully.");
    } catch (e) {
      next(e);
    }
  };

  getAllReviews = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { isDeleted } = req.query;
      console.log(req.query, "sdsasasa");

      const filters = {};

      if (isDeleted) {
        filters.isDeleted = isDeleted;
      }
      console.log(filters, "sdsasasa");

      const reviews = await reviewService.getAllReviews(productId, filters);

      return successHandler(res, 200, reviews, "Reviews fetched successfully.");
    } catch (e) {
      next(e);
    }
  };

  deleteReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;

      const response = await reviewService.deleteReview(reviewId);

      return successHandler(res, 200, response, "Review deleted successfully.");
    } catch (e) {
      next(e);
    }
  };
}

export const reviewController = new ReviewController();
