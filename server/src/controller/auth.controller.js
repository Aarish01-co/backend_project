import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken
} from "../utils/auth.utils.js";
import config from "../config/config.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({
      name,
      email,
      passwordHash
    });

    return res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userIdStr = user._id.toString();
    const accessToken = createAccessToken({ userId: userIdStr });
    const refreshToken = createRefreshToken({ userId: userIdStr });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const user = await userModel.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Refresh token is invalid or has been revoked" });
    }

    const userIdStr = user._id.toString();
    const newAccessToken = createAccessToken({ userId: userIdStr });
    const newRefreshToken = createRefreshToken({ userId: userIdStr });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during token refresh" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;

    await userModel.findByIdAndUpdate(userId, { refreshToken: null });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax"
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error during logout" });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching user profile" });
  }
};
