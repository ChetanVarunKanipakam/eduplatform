import express from 'express';
import { getLessonById } from '../controllers/lessonController.js';

const router = express.Router();

router.route('/:lessonId').get(getLessonById);

export default router;