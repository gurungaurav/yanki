import { checkPassword, hashPassword } from "../utils/bcryptPass.js";
import { userService } from "../services/user.service.js";
import { successHandler } from "../handlers/success/successHandler.js";
import { JWTCreation } from "../utils/token-manager.js";
import { userSchema } from "../models/user.js";

//!Class for controlling authentication and authorization like login, regi,logout, refresh tokens, etc.
class AuthController {
  //For registration of the user
  registerUser = async (req, res, next) => {
    try {
      const userDTO = req.body;

      if (userDTO.confirmPassword !== userDTO.password) {
        throw new Error("Password should match", 400);
      }

      const userExists = await userService.getUserByEmail(userDTO.email);

      if (userExists) {
        throw new Error("User has already been registered");
      }

      const hashedPass = await hashPassword(userDTO.confirmPassword);

      const newUser = new userSchema({
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        email: userDTO.email,
        username: userDTO.username,
        password: hashedPass,
        phoneNumber: userDTO.phoneNumber,
        address: userDTO.address,
        role: userDTO.role,
      });

      await userService.registerUser(newUser);

      return successHandler(res, 201, null, "User registered successfully.");
    } catch (e) {
      next(e);
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const userDTO = req.body;

      const user = await userService.getUserByEmail(userDTO.email);

      if (!user) {
        throw new Error("User not found");
      }

      const passCheck = await checkPassword(userDTO.password, user.password);

      if (!passCheck) {
        throw new Error("Password did'not matched", 400);
      }

      const jwtPayload = {
        userId: user._id,
        role: user.role,
      };

      const jwt = JWTCreation(jwtPayload);

      //!Extend gareko userdetails lai with token variable
      const userDetails = {
        id: user._id,
        username: user.username,
        role: user.role,
        token: jwt,
      };

      successHandler(res, 201, userDetails, "User logged in successfully!");
    } catch (e) {
      next(e);
    }
  };
}

export const authController = new AuthController();
