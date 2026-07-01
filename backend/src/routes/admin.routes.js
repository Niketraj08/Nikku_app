import { Router } from 'express';
import Video from '../models/Video.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import WatchHistory from '../models/WatchHistory.js';
import Homepage from '../models/Homepage.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { slugify } from '../utils/helpers.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/analytics', async (_req, res) => {
  try {
    const [totalUsers, totalVideos, totalCategories, totalViews, recentUsers] = await Promise.all([
      User.countDocuments(),
      Video.countDocuments(),
      Category.countDocuments(),
      Video.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      User.find().sort('-createdAt').limit(5).select('name email createdAt'),
    ]);

    const topVideos = await Video.find().sort('-views').limit(5).select('title views slug');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVideos,
        totalCategories,
        totalViews: totalViews[0]?.total || 0,
        recentUsers,
        topVideos,
        revenue: { total: 0, monthly: 0, note: 'Free platform — no revenue tracking' },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -refreshToken')
      .sort('-createdAt')
      .limit(Number(req.query.limit) || 50);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password -refreshToken');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/videos', async (_req, res) => {
  try {
    const videos = await Video.find().populate('category', 'name').sort('-createdAt');
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/videos', async (req, res) => {
  try {
    const slug = slugify(req.body.title) + '-' + Date.now().toString(36);
    const video = await Video.create({ ...req.body, slug, createdBy: req.user._id });
    await Category.findByIdAndUpdate(video.category, { $inc: { videoCount: 1 } });
    res.status(201).json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (video) await Category.findByIdAndUpdate(video.category, { $inc: { videoCount: -1 } });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const categories = await Category.find().sort('order');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const slug = slugify(req.body.name);
    const category = await Category.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/homepage', async (_req, res) => {
  try {
    let homepage = await Homepage.findOne();
    if (!homepage) homepage = await Homepage.create({});
    res.json({ success: true, data: homepage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/homepage', async (req, res) => {
  try {
    const homepage = await Homepage.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json({ success: true, data: homepage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
