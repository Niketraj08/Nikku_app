import { Router } from 'express';
import Category from '../models/Category.js';
import Video from '../models/Video.js';
import { slugify } from '../utils/helpers.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().sort('order name');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/featured', async (_req, res) => {
  try {
    const categories = await Category.find({ isFeatured: true }).sort('order').limit(8);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const videos = await Video.find({ category: category._id })
      .sort('-createdAt')
      .populate('category', 'name slug color');

    res.json({ success: true, data: { category, videos } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
