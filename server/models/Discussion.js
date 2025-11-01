import mongoose  from 'mongoose';
const Schema = mongoose.Schema;

const DiscussionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postType: {
    type: String,
    enum: ['esp32', 'stm32', 'lpc', 'aurdino', 'general'],
    required: true,
  },
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer',
  }],
}, { timestamps: true });

export default mongoose.model('Discussion', DiscussionSchema);