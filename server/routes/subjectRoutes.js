import express from 'express';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
} from '../controllers/subjectController.js';
import { createLessonForSubject } from '../controllers/lessonController.js';

const router = express.Router();

router.route('/').get(getAllSubjects).post(createSubject);
router.route('/:subjectId').get(getSubjectById);
router.route('/:subjectId/lessons').post(createLessonForSubject);

export default router;