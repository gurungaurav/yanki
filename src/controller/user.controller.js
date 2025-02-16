import { successHandler } from "../handlers/success/successHandler.js";
import { userService } from "../services/user.service.js";

class UserController {
  //For getting all users
  getUserDetailsById = async (req, res, next) => {
    try {
      console.log(req.params, "user");

      const userDetails = await userService.getUserById(req.params.id);

      return successHandler(res, 200, userDetails, "Required user details");
    } catch (e) {
      next(e);
    }
  };
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
}

export const userController = new UserController();
