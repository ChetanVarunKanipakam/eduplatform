import Subject from '../models/Subject.js';

// @desc    Get all subjects
// @route   GET /api/subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single subject with its lessons populated
// @route   GET /api/subjects/:subjectId
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId).populate('lessons');
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};