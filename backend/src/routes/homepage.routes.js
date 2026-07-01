import { Router } from 'express';
import Video from '../models/Video.js';
import Category from '../models/Category.js';
import Homepage from '../models/Homepage.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    let homepage = await Homepage.findOne().populate('featuredCourseIds');
    if (!homepage) homepage = await Homepage.create({});

    const [featured, popular, trending, categories] = await Promise.all([
      Video.find({ isFeatured: true }).populate('category', 'name slug color icon').limit(8),
      Video.find({ isPopular: true }).populate('category', 'name slug color icon').limit(8),
      Video.find({ isTrending: true }).populate('category', 'name slug color icon').limit(8),
      Category.find({ isFeatured: true }).sort('order').limit(8),
    ]);

    res.json({
      success: true,
      data: {
        homepage,
        featured,
        popular,
        trending,
        categories,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
