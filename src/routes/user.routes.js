import { Router } from "express";
import { userController } from "../controller/user.controller.js";
import { ClientAuthRole } from "../middlewares/auth/roleAuth.middleware.js";

export const userRoutes = Router();

userRoutes.get(
  "/getSpecificUser",
  ClientAuthRole(),
  userController.getUserDetailsById
);

userRoutes.patch(
  "/changePassword",
  ClientAuthRole(),
  userController.changePassword
);

userRoutes.put(
  "/updateUser",
  ClientAuthRole(),
  userController.updateUserDetails
);

userRoutes.get("/getAllUsers", userController.getAllUsers);
