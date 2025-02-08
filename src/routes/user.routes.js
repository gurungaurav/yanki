import { Router } from "express";
import { userController } from "../controller/user.controller.js";

export const userRoutes = Router();

userRoutes.get("/getSpecificUser/:id", userController.getUserDetailsById);
