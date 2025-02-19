import { successHandler } from "../handlers/success/successHandler.js";
import { userService } from "../services/user.service.js";

class UserController {
  //For getting all users used by admin
  getUserDetailsById = async (req, res, next) => {
    try {
      console.log(req.user, "user");
      const user = req.user;
      const userDetails = {
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
      };

      return successHandler(res, 200, userDetails, "Required user details");
    } catch (e) {
      next(e);
    }
  };

  //change password of specific user
  changePassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.params.id;
      const response = await userService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      return successHandler(
        res,
        200,
        response,
        "Password changed successfully"
      );
    } catch (e) {
      next(e);
    }
  };

  //For updating user details
  updateUserDetails = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const userDetails = req.body;

      const response = await userService.updateUser(userId, userDetails);

      return successHandler(res, 200, response, "User details updated");
    } catch (e) {
      next(e);
    }
  };
}

export const userController = new UserController();
