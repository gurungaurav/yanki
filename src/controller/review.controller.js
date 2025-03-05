import { successHandler } from "../handlers/success/successHandler.js";
import { reviewService } from "../services/review.service.js";

class ReviewController {
  addReview = async (req, res, next) => {
    try {
      const reviewDTO = req.body;
      const userId = req.user._id;

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

      const filters = {};

      if (isDeleted) {
        filters.isDeleted = isDeleted;
      }

      const reviews = await reviewService.getAllReviews(productId, filters);

      return successHandler(res, 200, reviews, "Reviews fetched successfully.");
    } catch (e) {
      next(e);
    }
  };

  updateReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const reviewDTO = req.body;

      await reviewService.updateReview(reviewId, reviewDTO);

      return successHandler(res, 200, null, "Review updated successfully.");
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
