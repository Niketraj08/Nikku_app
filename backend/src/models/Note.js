import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    title: { type: String, default: '' },
    content: { type: String, required: true },
    timestamp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);
