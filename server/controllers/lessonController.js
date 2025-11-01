// controllers/lessonController.js

import Lesson from "../models/Lesson.js";
import Subject from "../models/Subject.js";
import { slugify } from "../utils/slugify.js"; // Import our new utility

/**
 * ✅ 1. Get all lessons for a given subject
 * @description More efficient query that directly finds lessons by subject ID.
 */
export const getLessonsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const lessons = await Lesson.find({ subject: subjectId }).select('title slug subject createdAt contentBlocks');
    res.status(200).json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).json({ message: "Server error fetching lessons" });
  }
};

/**
 * ✅ 2. Get a single lesson by its ID
 * @description No changes needed, but included for completeness.
 */
export const getLessonById = async (req, res) => {
  try {
    // Note: It's common to use 'id' as the param name for consistency
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json(lesson);

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


/**
 * ✅ 3. Add a new lesson to a subject
 * @description Accepts a 'contentBlocks' array and generates a slug.
 */
export const addLesson = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { title, contentBlocks } = req.body;

    // 1. Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // 2. Create a new lesson instance with the new schema
    const newLesson = new Lesson({
      title,
      subject: subjectId,
      contentBlocks: contentBlocks || [], // Default to empty array
      slug: slugify(title), // Generate the URL-friendly slug
    });

    // 3. Save the lesson
    const savedLesson = await newLesson.save();

    res.status(201).json(savedLesson);
    
  } catch (err) {
    console.error("Error adding lesson:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error adding lesson" });
  }
};

/**
 * ✅ 4. Update an existing lesson
 * @description Handles updates to title (and slug) and/or contentBlocks.
 */
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, contentBlocks } = req.body;

    const updateData = {};

    if (title) {
      updateData.title = title;
      updateData.slug = slugify(title); // Re-generate slug if title changes
    }
    if (contentBlocks) {
      updateData.contentBlocks = contentBlocks;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation rules are applied
    });

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(updatedLesson);
  } catch (err) {
    console.error("Error updating lesson:", err);
    res.status(500).json({ message: "Server error updating lesson" });
  }
};

/**
 * ✅ 5. Delete a lesson
 * @description Simplified logic - no need to update the Subject model anymore.
 */
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLesson = await Lesson.findByIdAndDelete(id);

    if (!deletedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err)
  {
    console.error("Error deleting lesson:", err);
    res.status(500).json({ message: "Server error deleting lesson" });
  }
};