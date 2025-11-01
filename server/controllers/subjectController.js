import Subject from "../models/Subject.js";
import Lesson from "../models/Lesson.js";

// Get all subjects (with lessons)
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get subject by ID
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Create a new subject
export const createSubject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const subject = await Subject.create({ title, description, imageUrl });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update a subject
export const updateSubject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updates = { title, description };

    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

    const subject = await Subject.findByIdAndUpdate(req.params.subjectId, updates, {
      new: true,
      runValidators: true,
    });

    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.status(200).json(subject);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
