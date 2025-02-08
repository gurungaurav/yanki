import { Router } from "express";
import { loginLimiter } from "../middlewares/auth/loginLimiter.middleware.js";
import {
  checkUserExistence,
  checkUserLogin,
} from "../middlewares/user/user.middleware.js";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../validations/user.schema.js";
import { validateSchema } from "../validator/index.js";
import { authController } from "../controller/auth.controller.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  validateSchema(userRegisterSchema),
  checkUserExistence,
  authController.registerUser
);

authRoutes.post(
  "/loginUser",
  loginLimiter,
  validateSchema(userLoginSchema),
  checkUserLogin,
  authController.loginUser
);

authRoutes.post("/logout", authController.logout);
