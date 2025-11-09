import express from "express";
import {
  createResume,
  deleteResume,
  getResumeById,
  updateResumeById,
} from "../controllers/resume.js";

import upload from "../config/multer.js";
import authMiddlware from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/create", authMiddleware, createResume);
route.put("/update", upload.single("image"), authMiddlware, updateResumeById);
route.delete("/delete/:resumeId", authMiddlware, deleteResume);
route.get("/get/:resumeId", authMiddlware, getResumeById);
route.get("/public/:resumeId", getResumePublicById);

export default route;
