import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe
} from "../controller/auth.controller.js";
import {
  validateRegister,
  validateLogin
} from "../validators/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logoutUser);
router.get("/me", authenticate, getMe);

export default router;