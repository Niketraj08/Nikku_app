import { Router } from 'express';
import Video from '../models/Video.js';
import Category from '../models/Category.js';
import WatchHistory from '../models/WatchHistory.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { slugify } from '../utils/helpers.js';

const router = Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      featured,
      popular,
      trending,
      sort = '-createdAt',
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (popular === 'true') filter.isPopular = true;
    if (trending === 'true') filter.isTrending = true;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [videos, total] = await Promise.all([
      Video.find(filter)
        .populate('category', 'name slug color icon')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Video.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: videos,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/search/suggestions', async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json({ success: true, data: [] });

    const videos = await Video.find({ $text: { $search: q } })
      .select('title slug thumbnail duration category')
      .populate('category', 'name slug')
      .limit(8);

    const categories = await Category.find({
      name: { $regex: q, $options: 'i' },
    }).limit(4);

    res.json({ success: true, data: { videos, categories } });
  } catch {
    const videos = await Video.find({ title: { $regex: req.query.q, $options: 'i' } })
      .select('title slug thumbnail duration')
      .limit(8);
    res.json({ success: true, data: { videos, categories: [] } });
  }
});

router.get('/continue-watching', protect, async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id, completed: false })
      .sort('-lastWatchedAt')
      .limit(10)
      .populate({ path: 'video', populate: { path: 'category', select: 'name slug color' } });

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/recently-watched', protect, async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id })
      .sort('-lastWatchedAt')
      .limit(20)
      .populate({ path: 'video', populate: { path: 'category', select: 'name slug color' } });

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const video = await Video.findOne({ slug: req.params.slug })
      .populate('category', 'name slug color icon')
      .populate('relatedVideos');

    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    await Video.findByIdAndUpdate(video._id, { $inc: { views: 1 } });

    let related = video.relatedVideos;
    if (!related?.length) {
      related = await Video.find({
        category: video.category._id,
        _id: { $ne: video._id },
      }).limit(8);
    }

    res.json({ success: true, data: { ...video.toObject(), relatedVideos: related } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/progress', protect, async (req, res) => {
  try {
    const { progress, duration, completed } = req.body;
    const history = await WatchHistory.findOneAndUpdate(
      { user: req.user._id, video: req.params.id },
      { progress, duration, completed, lastWatchedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
