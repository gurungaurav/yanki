import { userSchema } from "../models/user.js";
import { checkPassword, hashPassword } from "../utils/bcryptPass.js";

class UserService {
  async getUserById(userId) {
    const user = await userSchema.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await userSchema.findOne({ email }).select();

    return user;
  }

  async getAllUsers() {
    //exclude role admin
    const users = await userSchema
      .find({
        role: {
          $ne: "admin",
        },
      })
      .select("-password");

    return users;
  }

  async registerUser(userDTO) {
    return await userSchema.create(userDTO);
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await userSchema.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await checkPassword(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Incorrect current password");
    }

    user.password = await hashPassword(newPassword);
    await user.save();
    return { message: "Password updated successfully" };
  }

  async updateUser(userId, userDTO) {
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const success = await userSchema
      .findByIdAndUpdate(userId, userDTO, { new: true })
      .select("-password");

    return success;
  }
}

export const userService = new UserService();
