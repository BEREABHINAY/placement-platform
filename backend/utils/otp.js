import crypto from "crypto";
import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";

// Generates a 6-digit numeric OTP, e.g. "042917"
export const generateOtpCode = () =>
  crypto.randomInt(0, 1000000).toString().padStart(6, "0");

export const createOtp = async (email, purpose) => {
  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(
    Date.now() + (Number(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000
  );

  // Invalidate any previous unused OTPs for this email + purpose
  await Otp.deleteMany({ email, purpose });

  await Otp.create({ email, codeHash, purpose, expiresAt });

  return code; // plaintext code, only ever returned to be emailed — never stored
};

export const verifyOtp = async (email, purpose, code) => {
  const record = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });

  if (!record) return { ok: false, reason: "No OTP found. Please request a new one." };
  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return { ok: false, reason: "OTP has expired. Please request a new one." };
  }
  if (record.attempts >= record.maxAttempts) {
    await record.deleteOne();
    return { ok: false, reason: "Too many incorrect attempts. Please request a new one." };
  }

  const match = await bcrypt.compare(code, record.codeHash);
  if (!match) {
    record.attempts += 1;
    await record.save();
    return { ok: false, reason: `Incorrect code. ${record.maxAttempts - record.attempts} attempt(s) left.` };
  }

  await record.deleteOne();
  return { ok: true };
};
