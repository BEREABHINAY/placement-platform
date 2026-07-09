import express from "express";
import { getMyCertificates, verifyCertificate, getAllCertificates } from "../controllers/certificateController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-certificates", protect, authorize("student"), getMyCertificates);
router.get("/verify/:certificateId", verifyCertificate); // public — no auth, recruiters can check
router.get("/", protect, authorize("admin"), getAllCertificates);

export default router;
