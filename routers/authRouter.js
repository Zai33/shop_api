import express from "express";
import {
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  resendOpt,
  verifyUser,
} from "../controller/authController.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register/verify", verifyUser);
router.post("/register/resend-otp", resendOpt);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/get-me", protectedRoute, getUserProfile);

export default router;
