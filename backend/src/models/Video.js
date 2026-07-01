import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String }],
    videoType: {
      type: String,
      enum: ['mp4', 'youtube', 'vimeo', 'hls'],
      default: 'youtube',
    },
    videoUrl: { type: String, required: true },
    isFree: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    instructor: { type: String, default: 'AKKI STUDY X' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    order: { type: Number, default: 0 },
    relatedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Video', videoSchema);
