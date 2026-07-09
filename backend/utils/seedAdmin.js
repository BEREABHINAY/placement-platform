// One-time script to create the first Admin account, since /register never allows role=admin.
// Run with:  node utils/seedAdmin.js "Admin Name" admin@example.com StrongPass123
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.log('Usage: node utils/seedAdmin.js "Admin Name" admin@example.com StrongPass123');
  process.exit(1);
}

(async () => {
  await connectDB();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.role = "admin";
    existing.isEmailVerified = true;
    await existing.save();
    console.log(`Existing user ${email} promoted to admin.`);
  } else {
    await User.create({ name, email, password, role: "admin", isEmailVerified: true });
    console.log(`Admin account created for ${email}.`);
  }
  await mongoose.disconnect();
  process.exit(0);
})();
