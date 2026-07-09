import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import TestAttempt from "../models/TestAttempt.js";
import Certificate from "../models/Certificate.js";
import { createOtp, verifyOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import { sendTokenResponse } from "../utils/generateToken.js";

// Browsers match cookies for clearing by name + attributes — these must mirror
// the options used in sendTokenResponse, or the cookie won't actually clear cross-site.
const clearAuthCookie = (res) => {
  const isProd = process.env.NODE_ENV === "production";
  return res.clearCookie("token", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" });
};

// ---------------------------------------------------------------------------
// STEP 1 — Register: create the (unverified) account, send a signup OTP
// ---------------------------------------------------------------------------
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, college, branch, graduationYear, companyName, companyWebsite } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing.isEmailVerified) {
      return res.status(409).json({ success: false, message: "An account with this email already exists. Please log in." });
    }

    // Admins are never created through public signup — only seeded or promoted by another admin.
    const safeRole = role === "admin" ? "student" : role || "student";

    let user;
    if (existing && !existing.isEmailVerified) {
      // Re-registration attempt before verifying — update details and resend OTP
      Object.assign(existing, { name, password, role: safeRole, college, branch, graduationYear, companyName, companyWebsite });
      user = await existing.save();
    } else {
      user = await User.create({
        name, email, password, role: safeRole, college, branch, graduationYear, companyName, companyWebsite,
      });
    }

    const code = await createOtp(user.email, "signup");
    await sendOtpEmail({ to: user.email, code, purpose: "signup" });

    res.status(201).json({
      success: true,
      message: "Account created. Enter the OTP sent to your email to verify it.",
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// STEP 2 — Verify signup OTP: flips isEmailVerified, logs the user in
// ---------------------------------------------------------------------------
export const verifySignupOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: "Email and OTP code are required." });
    }

    const result = await verifyOtp(email.toLowerCase(), "signup", code);
    if (!result.ok) {
      return res.status(400).json({ success: false, message: result.reason });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isEmailVerified: true, lastLoginAt: new Date() },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    sendTokenResponse(user, 200, res, "Email verified successfully. Welcome aboard!");
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Resend OTP (signup or login) — rate-limited at the route level
// ---------------------------------------------------------------------------
export const resendOtp = async (req, res, next) => {
  try {
    const { email, purpose = "signup" } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "No account found with this email." });

    const code = await createOtp(user.email, purpose);
    await sendOtpEmail({ to: user.email, code, purpose });

    res.json({ success: true, message: "A new OTP has been sent to your email." });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// STEP 1 of login — check password, then trigger a login OTP (2FA)
// ---------------------------------------------------------------------------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "This account has been deactivated. Contact support." });
    }
    if (!user.isEmailVerified) {
      const code = await createOtp(user.email, "signup");
      await sendOtpEmail({ to: user.email, code, purpose: "signup" });
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: "Please verify your email first. A new OTP has been sent.",
      });
    }

    // Password correct → send a fresh OTP as a second factor before issuing the session
    const code = await createOtp(user.email, "login");
    await sendOtpEmail({ to: user.email, code, purpose: "login" });

    res.json({
      success: true,
      requiresOtp: true,
      email: user.email,
      message: "Password verified. Enter the OTP sent to your email to complete login.",
    });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// STEP 2 of login — verify the login OTP, issue the JWT session
// ---------------------------------------------------------------------------
export const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const result = await verifyOtp(email?.toLowerCase(), "login", code);
    if (!result.ok) {
      return res.status(400).json({ success: false, message: result.reason });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { lastLoginAt: new Date() },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });

    sendTokenResponse(user, 200, res, `Welcome back, ${user.name.split(" ")[0]}.`);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
export const logout = (req, res) => {
  clearAuthCookie(res).json({ success: true, message: "Logged out successfully." });
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
};

// Permanently deletes the account and everything tied to it.
// Requires the current password as confirmation — a delete button alone is too easy to misclick.
export const deleteMe = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!password || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Incorrect password. Account not deleted." });
    }

    await Promise.all([
      Enrollment.deleteMany({ user: user._id }),
      TestAttempt.deleteMany({ user: user._id }),
      Certificate.deleteMany({ user: user._id }),
    ]);
    await user.deleteOne();

    clearAuthCookie(res).json({ success: true, message: "Your account and all associated data have been permanently deleted." });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// Password reset flow (OTP-based, no email links needed)
// ---------------------------------------------------------------------------
export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    // Always respond success (don't leak which emails exist)
    if (user) {
      const code = await createOtp(user.email, "password_reset");
      await sendOtpEmail({ to: user.email, code, purpose: "password_reset" });
    }
    res.json({ success: true, message: "If that email exists, a reset code has been sent." });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
    }

    const result = await verifyOtp(email?.toLowerCase(), "password_reset", code);
    if (!result.ok) return res.status(400).json({ success: false, message: result.reason });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password reset successfully.");
  } catch (err) {
    next(err);
  }
};
