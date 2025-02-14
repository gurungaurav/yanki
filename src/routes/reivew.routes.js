import { Router } from "express";
import { reviewController } from "../controller/review.controller.js";
import { ClientAuthRole } from "../middlewares/auth/roleAuth.middleware.js";

export const reviewRoutes = Router();

reviewRoutes.post("/addReview", ClientAuthRole(), reviewController.addReview);
reviewRoutes.get("/getAllReviews/:productId", reviewController.getAllReviews);
reviewRoutes.delete("/deleteReview/:reviewId", reviewController.deleteReview);
