import Lesson from '../models/Lesson.js';
import Subject from '../models/Subject.js';

// @desc    Get a single lesson
// @route   GET /api/lessons/:lessonId
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(200).json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new lesson within a subject
// @route   POST /api/subjects/:subjectId/lessons
export const createLessonForSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const lesson = await Lesson.create(req.body);
    
    // Add lesson to the subject's lessons array
    subject.lessons.push(lesson._id);
    await subject.save();

    res.status(201).json(lesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};