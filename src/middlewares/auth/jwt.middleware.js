import { userService } from "../../services/user.service.js";
import { JWTVerification } from "../../utils/token-manager.js";

//! This is the actual verification of the jwt
export const verifyJwtTokenMiddleware = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      throw new Error("Access Token expired", 401);
    }

    const [bearer, token] = bearerToken.split(" ");

    if (bearer !== "Bearer") {
      throw new Error(
        "Invalid token type. Token must be in 'Bearer <token>' format.",
        400
      );
    }

    if (!token) {
      throw new Error("Invalid token. Token cannot be empty.", 400);
    }

    const verifiedToken = JWTVerification(token);

    if (!verifiedToken) {
      throw new Error("Invalid token. Failed to verify token.", 401);
    }

    const user = await userService.getUserById(verifiedToken.userId);

    if (!user) {
      throw new Error("User not found.", 404);
    }

    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
