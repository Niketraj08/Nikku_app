import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: 'Learn Without Limits' },
    heroSubtitle: { type: String, default: 'Premium Edition — Free access to world-class educational content' },
    heroCta: { type: String, default: 'Start Learning Free' },
    testimonials: [
      {
        name: String,
        role: String,
        content: String,
        avatar: String,
        rating: { type: Number, default: 5 },
      },
    ],
    ctaTitle: { type: String, default: 'Ready to Start Your Learning Journey?' },
    ctaSubtitle: { type: String, default: 'Join thousands of students learning for free' },
    featuredCourseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  },
  { timestamps: true }
);

export default mongoose.model('Homepage', homepageSchema);
