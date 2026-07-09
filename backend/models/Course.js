import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, default: 30 },
    videoUrl: { type: String, default: "" }, // lesson video for this module
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["DSA", "Web Development", "Aptitude", "System Design", "Soft Skills", "Core CS", "AI/ML"],
      required: true,
    },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    durationHours: { type: Number, required: true },
    thumbnail: { type: String, default: "" },
    instructor: { type: String, default: "Placement Platform Team" },
    tags: [{ type: String }],
    modules: [moduleSchema],
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

courseSchema.virtual("totalModules").get(function () {
  return this.modules?.length || 0;
});
courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

export default mongoose.model("Course", courseSchema);
