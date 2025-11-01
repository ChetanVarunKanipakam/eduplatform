import express from "express";
import {
  getLessonsBySubject,
  updateLesson,
  deleteLesson,
  getLessonById
} from "../controllers/lessonController.js";
import upload from "../utils/upload.js";
const router = express.Router();

router.get("/lessons/subjects/:subjectId/lessons", getLessonsBySubject); // GET lessons of a subject
// router.post("/subjects/:subjectId/lessons", addLesson); // ADD new lesson
router.put("/lessons/:id",upload.single("image"), updateLesson); // UPDATE existing lesson
router.delete("/lessons/:id", deleteLesson); // DELETE lesson
router.get('/lessons/:lessonId',getLessonById);
export default router;
