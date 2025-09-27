import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  // We populate lessons from the Lesson model
  lessons: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson',
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Subject', SubjectSchema);