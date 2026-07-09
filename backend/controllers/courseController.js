import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// Public/any-authenticated-user: browse the catalog
export const getCourses = async (req, res, next) => {
  try {
    const { category, level, search } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: "i" };

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    let enrollment = null;
    if (req.user) {
      enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
    }
    res.json({ success: true, course, enrollment });
  } catch (err) {
    next(err);
  }
};

// Admin only
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: "Course created.", course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, message: "Course updated.", course });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, message: "Course deleted." });
  } catch (err) {
    next(err);
  }
};

// Student only
export const enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    const existing = await Enrollment.findOne({ user: req.user._id, course: course._id });
    if (existing) return res.status(409).json({ success: false, message: "Already enrolled in this course." });

    const enrollment = await Enrollment.create({ user: req.user._id, course: course._id });
    course.enrolledCount += 1;
    await course.save();

    res.status(201).json({ success: true, message: "Enrolled successfully.", enrollment });
  } catch (err) {
    next(err);
  }
};

export const markModuleComplete = async (req, res, next) => {
  try {
    const { moduleId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
    if (!enrollment) return res.status(400).json({ success: false, message: "Enroll in this course first." });

    if (!enrollment.completedModuleIds.some((id) => id.toString() === moduleId)) {
      enrollment.completedModuleIds.push(moduleId);
    }

    const total = course.modules.length || 1;
    enrollment.progressPercent = Math.round((enrollment.completedModuleIds.length / total) * 100);
    if (enrollment.progressPercent >= 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }
    await enrollment.save();

    res.json({ success: true, message: "Progress updated.", enrollment });
  } catch (err) {
    next(err);
  }
};

export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate("course");
    res.json({ success: true, enrollments });
  } catch (err) {
    next(err);
  }
};
