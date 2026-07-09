import express from "express";
import {
  getCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  enrollInCourse, markModuleComplete, getMyEnrollments,
} from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Browsing requires login (any role) but not a specific one
router.get("/", protect, getCourses);
router.get("/my-enrollments", protect, authorize("student"), getMyEnrollments);
router.get("/:id", protect, getCourseById);

// Only admins manage the catalog
router.post("/", protect, authorize("admin"), createCourse);
router.put("/:id", protect, authorize("admin"), updateCourse);
router.delete("/:id", protect, authorize("admin"), deleteCourse);

// Only students enroll / track progress
router.post("/:id/enroll", protect, authorize("student"), enrollInCourse);
router.post("/:id/complete-module", protect, authorize("student"), markModuleComplete);

export default router;
