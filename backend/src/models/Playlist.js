import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    isPublic: { type: Boolean, default: false },
    thumbnail: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Playlist', playlistSchema);
