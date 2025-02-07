import CustomError from "../handlers/errors/customError.js";
import { userSchema } from "../models/user.js";

class UserService {
  getUserById = async (userId) => {
    try {
      const user = await userSchema
        .findById({ _id: userId })
        .select("-password");
      if (!user) {
        throw new CustomError("User not found");
      }
      return user;
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  getUserByEmail = async (email) => {
    try {
      const user = await userSchema.findOne(email).select("-password");
      if (!user) {
        throw new CustomError("User not found");
      }
      return user;
    } catch (error) {
      throw new CustomError(error.message);
    }
  };

  getAllUsers = async () => {
    try {
      const users = await userSchema.find().select("-password");
      return users;
    } catch (error) {
      throw new CustomError(error.message);
    }
  };
}

export const userService = new UserService();
