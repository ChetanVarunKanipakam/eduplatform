import express from "express";
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
} from "../controllers/subjectController.js";
import { addLesson} from "../controllers/lessonController.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.route("/")
  .get(getAllSubjects)
  .post(upload.single("image"), createSubject);

router.route("/:subjectId")
  .get(getSubjectById)
  .put(upload.single("image"), updateSubject);

router.route("/:subjectId/lessons")
  .post(upload.single("image"), addLesson);

export default router;
