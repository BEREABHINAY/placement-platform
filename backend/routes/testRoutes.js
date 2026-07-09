import express from "express";
import {
  getTests, getTestForAttempt, getTestWithAnswers,
  createTest, updateTest, deleteTest, submitTest, getMyAttempts,
} from "../controllers/testController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getTests);
router.get("/my-attempts", protect, authorize("student"), getMyAttempts);
router.get("/:id/attempt", protect, authorize("student"), getTestForAttempt);
router.get("/:id/answers", protect, authorize("admin"), getTestWithAnswers);

router.post("/", protect, authorize("admin"), createTest);
router.put("/:id", protect, authorize("admin"), updateTest);
router.delete("/:id", protect, authorize("admin"), deleteTest);

router.post("/:id/submit", protect, authorize("student"), submitTest);

export default router;
