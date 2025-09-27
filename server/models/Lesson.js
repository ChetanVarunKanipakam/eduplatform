import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  hasCodeEditor: {
    type: Boolean,
    default: false,
  },
  codeSnippet: {
    type: String,
  },
  links: [LinkSchema],
});

export default mongoose.model('Lesson', LessonSchema);