import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import resumeUpload from "../config/multer.js";
import { developerForm } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/developerForm",
  authenticateToken,
  resumeUpload.single("resume"),
  developerForm,
);

export default router;
