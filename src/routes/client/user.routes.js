import { Router } from "express";
import { userController } from "../../controller/user.controller.js";
import { userProductRoutes } from "./product.routes.js";

export const userRoutes = Router();
userRoutes.use("/product", userProductRoutes);

userRoutes.get("/getSpecificUser/:id", userController.getUserDetailsById);
