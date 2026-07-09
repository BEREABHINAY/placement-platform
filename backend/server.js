import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://placementprep-wheat.vercel.app"
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is running." }));
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/certificates", certificateRoutes);

// Other module routes (resume, coding platform, job alerts, etc.) get mounted here as they're built:
// app.use("/api/resume", resumeRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] Running on port ${PORT}`));
});
