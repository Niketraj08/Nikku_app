import { Router } from 'express';
import WatchLater from '../models/WatchLater.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await WatchLater.find({ user: req.user._id })
      .populate({ path: 'video', populate: { path: 'category', select: 'name slug color' } })
      .sort('-createdAt');
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await WatchLater.findOneAndUpdate(
      { user: req.user._id, video: req.body.videoId },
      {},
      { upsert: true, new: true }
    ).populate('video', 'title slug thumbnail duration');
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:videoId', async (req, res) => {
  try {
    await WatchLater.findOneAndDelete({ user: req.user._id, video: req.params.videoId });
    res.json({ success: true, message: 'Removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
