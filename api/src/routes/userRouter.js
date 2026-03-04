import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import resumeUpload from "../config/multer.js";
import { developerForm, projectForm } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/developerForm",
  authenticateToken,
  resumeUpload.single("resume"),
  developerForm,
);
router.post("/projectapplication", authenticateToken, projectForm);

export default router;
