import { userService } from "../../services/user.service.js";

export const checkUserExistence = async (req, res, next) => {
  try {
    const userDTO = req.body;
    const userExists = await userService.getUserByEmail(userDTO.email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: [
          {
            field: "email",
            message: "User has been already registered with this email",
          },
        ],
      });
    }

    req.user = userExists;
    next();
  } catch (e) {
    next(e);
  }
};

export const checkUserLogin = async (req, res, next) => {
  try {
    const userDTO = req.body;
    const user = await userService.getUserByEmail(userDTO.email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: [
          {
            field: "email",
            message: "User has not been registered yet",
          },
        ],
      });
    }

    //Injecting the values for reusing
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
