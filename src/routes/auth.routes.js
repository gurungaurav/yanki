import { Router } from "express";
import { authController } from "../controller/auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", authController.registerUser);

authRoutes.post("/login", authController.loginUser);
