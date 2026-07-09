import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },

    // Student / Company / Admin all live in one collection, distinguished by role.
    role: {
      type: String,
      enum: ["student", "company", "admin"],
      default: "student",
    },

    // --- Student-specific ---
    college: { type: String, trim: true },
    branch: { type: String, trim: true },
    graduationYear: { type: Number },

    // --- Company-specific ---
    companyName: { type: String, trim: true },
    companyWebsite: { type: String, trim: true },

    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // admin can deactivate accounts
    lastLoginAt: { type: Date },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
