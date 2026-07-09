import jwt from "jsonwebtoken";

export const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// Sends the JWT as an httpOnly cookie AND in the JSON body,
// so the frontend can use either cookie-based or header-based auth.
export const sendTokenResponse = (user, statusCode, res, message) => {
  const token = signToken(user);
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    // In production the frontend (e.g. vercel.app) and backend (e.g. onrender.com) live on
    // different domains, so the cookie must be "none" + secure to survive a cross-site request.
    // Locally, both run on localhost, where "lax" is fine and doesn't require HTTPS.
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user: user.toSafeObject(),
    });
};
