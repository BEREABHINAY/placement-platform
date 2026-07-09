import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        selectedOptionIndex: { type: Number },
      },
    ],
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percent: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    timeTakenSeconds: { type: Number },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One "best attempt" doesn't need enforcing at schema level — students can retake tests,
// history is kept for the progress dashboard / leaderboard to aggregate later.
attemptSchema.index({ user: 1, test: 1 });

export default mongoose.model("TestAttempt", attemptSchema);
