import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  verifySignupOtp,
  resendOtp,
  login,
  verifyLoginOtp,
  logout,
  getMe,
  deleteMe,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Throttle OTP-related endpoints to prevent abuse / brute force
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
});

router.post("/register", otpLimiter, register);
router.post("/verify-signup-otp", otpLimiter, verifySignupOtp);
router.post("/resend-otp", otpLimiter, resendOtp);

router.post("/login", otpLimiter, login);
router.post("/verify-login-otp", otpLimiter, verifyLoginOtp);

router.post("/forgot-password", otpLimiter, requestPasswordReset);
router.post("/reset-password", otpLimiter, resetPassword);

router.post("/logout", logout);
router.get("/me", protect, getMe);
router.delete("/me", protect, deleteMe);

export default router;
