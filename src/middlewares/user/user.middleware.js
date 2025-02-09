import { userService } from "../../services/user.service.js";

export const checkUserExistence = async (req, res, next) => {
  try {
    const userDTO = req.body;
    console.log(userDTO);

    const userExists = await userService.getUserByEmail(userDTO.email);
    if (userExists) {
      throw new Error("User has already been registered");
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
      throw new Error("User not found");
    }

    //Injecting the values for reusing
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
