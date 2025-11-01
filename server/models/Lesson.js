import mongoose from 'mongoose';

/**
 * @description
 * A simple sub-schema for individual links. Re-used in the 'linkList' content block.
 * { _id: false } prevents Mongoose from creating an _id for each link.
 */
const LinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

/**
 * @description
 * Defines a single, self-contained block of content.
 * A lesson is composed of an array of these blocks.
 * { _id: false } prevents Mongoose from creating an _id for each block.
 */
const ContentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['heading', 'paragraph', 'image', 'code', 'linkList'], // Defines the allowed block types
  },
  // --- Fields for text-based blocks ---
  text: {
    type: String, // Used for 'heading' and 'paragraph'
    trim: true,
  },
  level: {
    type: Number, // For headings (e.g., 1 for <h1>, 2 for <h2>)
    default: 1,
  },
  // --- Fields for image blocks ---
  src: {
    type: String, // The URL of the image
  },
  caption: {
    type: String, // A caption for the image
    trim: true,
  },
  // --- Fields for code blocks ---
  code: {
    type: String, // The code snippet itself
  },
  language: {
    type: String, // e.g., 'javascript', 'python', 'cpp' for syntax highlighting
    default: 'javascript',
  },
  // --- Field for a list of links block ---
  links: [LinkSchema],
}, { _id: false });

/**
 * @description
 * The main Lesson schema. It keeps essential metadata at the top level
 * and uses the `contentBlocks` array for the flexible lesson body.
 */
const LessonSchema = new mongoose.Schema({
  title: { // The main title of the lesson, used for listings and SEO
    type: String,
    required: [true, "Please add a lesson title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  subject: { // The parent subject or course
    type: mongoose.Schema.ObjectId,
    ref: 'Subject',
    required: true,
  },
  contentBlocks: { // The array of content blocks that make up the lesson
    type: [ContentBlockSchema],
    default: [],
  },
  // You might also want a 'slug' for clean URLs
  slug: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

export default mongoose.model('Lesson', LessonSchema);