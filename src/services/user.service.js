import { userSchema } from "../models/user.js";

class UserService {
  async getUserById(userId) {
    const user = await userSchema.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await userSchema.findOne({ email }).select("-password");

    return user;
  }

  async getAllUsers() {
    const users = await userSchema.find().select("-password");
    if (!users.length) {
      throw new Error("No users found");
    }
    return users;
  }

  async registerUser(userDTO) {
    return await userSchema.create(userDTO);
  }
}

export const userService = new UserService();
