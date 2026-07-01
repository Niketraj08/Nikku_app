import mongoose from 'mongoose';

const watchLaterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  },
  { timestamps: true }
);

watchLaterSchema.index({ user: 1, video: 1 }, { unique: true });

export default mongoose.model('WatchLater', watchLaterSchema);
