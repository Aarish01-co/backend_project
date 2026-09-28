import { verifyAccessToken } from "../utils/auth.utils.js";
import userModel from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token is missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }

  try {
    const user = await userModel.findById(decoded.userId).select("-passwordHash -refreshToken");

    if (!user) {
      return res.status(401).json({ message: "User account no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Failed to authenticate request" });
  }
};
