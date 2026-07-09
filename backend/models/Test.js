import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: {
      type: [String],
      validate: [(arr) => arr.length >= 2 && arr.length <= 6, "Provide 2 to 6 options."],
      required: true,
    },
    correctOptionIndex: { type: Number, required: true },
    marks: { type: Number, default: 1 },
    explanation: { type: String, default: "" },
  },
  { _id: true }
);

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["aptitude", "mock", "coding_mcq"], required: true },
    category: {
      type: String,
      enum: ["Quantitative", "Logical Reasoning", "Verbal Ability", "DSA", "Core CS", "HR / Behavioral"],
      required: true,
    },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, required: true },
    questions: { type: [questionSchema], required: true },
    passingPercent: { type: Number, default: 50 },
    relatedCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

testSchema.virtual("totalMarks").get(function () {
  return this.questions.reduce((sum, q) => sum + q.marks, 0);
});
testSchema.set("toJSON", { virtuals: true });
testSchema.set("toObject", { virtuals: true });

export default mongoose.model("Test", testSchema);
