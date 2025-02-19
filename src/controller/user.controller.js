import { successHandler } from "../handlers/success/successHandler.js";

class UserController {
  //For getting all users
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
