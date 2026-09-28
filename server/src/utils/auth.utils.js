import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function createAccessToken(payload) {
  return jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: "15m"
  });
}

export function createRefreshToken(payload) {
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: "7d"
  });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, config.accessTokenSecret);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.refreshTokenSecret);
  } catch (error) {
    return null;
  }
}