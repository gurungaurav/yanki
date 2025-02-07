import { checkPassword, hashPassword } from "../utils/bcryptPass.js";
import { userService } from "../services/user.service.js";
import { successHandler } from "../handlers/success/successHandler.js";
import CustomError from "../handlers/errors/customError.js";
import { JWTCreation } from "../utils/token-manager.js";

//!Class for controlling authentication and authorization like login, regi,logout, refresh tokens, etc.
class AuthController {
  //For registration of the user
  registerUser = async (req, res, next) => {
    try {
      const userDTO = req.body;

      if (userDTO.confirmPassword !== userDTO.password) {
        throw new CustomError("Password should match", 400);
      }
      const hashedPass = await hashPassword(userDTO.confirmPassword);

      //!Removing confirm password
      const { confirmPassword, ...userWithoutConfirmPassword } = userDTO;

      const hashedUser = {
        ...userWithoutConfirmPassword,
        password: hashedPass,
      };

      const userAddition = await userService.registerUser(hashedUser);

      if (userAddition) {
        return successHandler(res, 201, null, "User registered successfully.");
      } else {
        throw new CustomError("User registration failed", 400);
      }
    } catch (e) {
      next(e);
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const injectDTO = req.user;
      const userDTO = req.body;
      const passCheck = await checkPassword(
        userDTO.password,
        injectDTO.password
      );

      if (!passCheck) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: [{ field: "password", message: "Password did'not matched" }],
          // throw new CustomError("Password did'not matched", 400);
        });
      }

      const jwtPayload = {
        userId: injectDTO.userId,
        role: injectDTO.role,
      };

      const jwt = JWTCreation(jwtPayload);

      //!Extend gareko userdetails lai with token variable
      const userDetails = {
        userId: injectDTO.userId,
        name: injectDTO.name,
        email: injectDTO.email,
        picture: injectDTO.picture,
        phoneNumber: injectDTO.phoneNumber,
        token: jwt,
      };

      // res.cookie("token", jwt, {
      //   httpOnly: true, // Must be false to access in JS
      //   secure: false, // For local development. Set to true in production with HTTPS
      //   sameSite: "strict",
      //   maxAge: 10000000, //For a day 24 hrs
      // });

      successHandler(res, 201, userDetails, "User logged in successfully!");
    } catch (e) {
      next(e);
    }
  };

  logout = async (req, res, next) => {
    try {
      const cookies = req.cookies;

      if (!cookies?.token) throw new CustomError("No token recieved", 204);

      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      return successHandler(res, 200, null, "Cookie cleared logged out");
    } catch (e) {
      next(e);
    }
  };
}

export const authController = new AuthController();
