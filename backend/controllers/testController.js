import Test from "../models/Test.js";
import TestAttempt from "../models/TestAttempt.js";
import Certificate from "../models/Certificate.js";
import Enrollment from "../models/Enrollment.js";
import { generateCertificateId } from "../utils/certificateId.js";

export const getTests = async (req, res, next) => {
  try {
    const { type, category } = req.query;
    const filter = { isPublished: true };
    if (type) filter.type = type;
    if (category) filter.category = category;

    // Strip correct answers/explanations from the list view — only counts and metadata needed
    const tests = await Test.find(filter)
      .select("-questions.correctOptionIndex -questions.explanation")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: tests.length, tests });
  } catch (err) {
    next(err);
  }
};

// Fetch a test to take — never leaks the correct answer to the student before submission
export const getTestForAttempt = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id).select("-questions.correctOptionIndex -questions.explanation");
    if (!test) return res.status(404).json({ success: false, message: "Test not found." });
    res.json({ success: true, test });
  } catch (err) {
    next(err);
  }
};

// Admin-only: full test with answer key
export const getTestWithAnswers = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: "Test not found." });
    res.json({ success: true, test });
  } catch (err) {
    next(err);
  }
};

export const createTest = async (req, res, next) => {
  try {
    const test = await Test.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: "Test created.", test });
  } catch (err) {
    next(err);
  }
};

export const updateTest = async (req, res, next) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!test) return res.status(404).json({ success: false, message: "Test not found." });
    res.json({ success: true, message: "Test updated.", test });
  } catch (err) {
    next(err);
  }
};

export const deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: "Test not found." });
    res.json({ success: true, message: "Test deleted." });
  } catch (err) {
    next(err);
  }
};

// Student submits answers → server grades against the answer key (never trusts client-side scoring)
export const submitTest = async (req, res, next) => {
  try {
    const { answers, timeTakenSeconds } = req.body; // answers: [{ questionId, selectedOptionIndex }]
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: "Test not found." });

    let score = 0;
    const totalMarks = test.questions.reduce((sum, q) => sum + q.marks, 0);

    test.questions.forEach((q) => {
      const submitted = answers.find((a) => a.questionId === q._id.toString());
      if (submitted && submitted.selectedOptionIndex === q.correctOptionIndex) {
        score += q.marks;
      }
    });

    const percent = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const passed = percent >= test.passingPercent;

    const attempt = await TestAttempt.create({
      user: req.user._id,
      test: test._id,
      answers,
      score,
      totalMarks,
      percent,
      passed,
      timeTakenSeconds,
    });

    // If this test is tied to a course and the student passed, auto-issue a certificate
    let certificate = null;
    if (passed && test.relatedCourse) {
      const existingCert = await Certificate.findOne({ user: req.user._id, course: test.relatedCourse });
      if (!existingCert) {
        certificate = await Certificate.create({
          certificateId: generateCertificateId(),
          user: req.user._id,
          course: test.relatedCourse,
          title: `Certificate of Completion — ${test.title.replace(/ Assessment| Test/i, "")}`,
        });
        await Enrollment.findOneAndUpdate(
          { user: req.user._id, course: test.relatedCourse },
          { isCompleted: true, progressPercent: 100, completedAt: new Date() }
        );
      } else {
        certificate = existingCert;
      }
      certificate = await certificate.populate("course", "title category");
    }

    res.status(201).json({
      success: true,
      message: passed ? "Test passed!" : "Test submitted.",
      result: { score, totalMarks, percent, passed },
      certificate,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id })
      .populate("test", "title type category")
      .sort({ createdAt: -1 });
    res.json({ success: true, attempts });
  } catch (err) {
    next(err);
  }
};
