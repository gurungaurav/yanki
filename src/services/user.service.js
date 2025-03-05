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
    const checkUser = await userSchema.findOne({ username: userDTO.username });

    if (checkUser) {
      throw new Error("Username already exists");
    }

    return await userSchema.create(userDTO);
  }

  async changePassword(userId, oldPassword, newPassword) {
    if (oldPassword === newPassword) {
      throw new Error("Password cannot be same as old password");
    }
    //again fetch user to get password of the user
    const user = await userSchema.findById(userId);

    const isMatch = await checkPassword(oldPassword, user.password);

    if (!isMatch) {
      throw new Error("Incorrect old password");
    }

    const hashedPassword = await hashPassword(newPassword);

    return await userSchema.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
  }

  async updateUser(userId, userDTO) {
    const checkUser = await userSchema.findOne({ username: userDTO.username });

    if (checkUser) {
      throw new Error("Username already exists");
    }

    return await userSchema.findByIdAndUpdate(userId, userDTO, {
      new: true,
    });
  }
}

export const userService = new UserService();
