import { Router } from 'express';
import User from '../models/User.js';
import WatchHistory from '../models/WatchHistory.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/profile', async (req, res) => {
  res.json({ success: true, data: req.user });
});

router.put('/profile', async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'avatar', 'preferences'];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken');

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/password', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [totalWatched, completed] = await Promise.all([
      WatchHistory.countDocuments({ user: req.user._id }),
      WatchHistory.countDocuments({ user: req.user._id, completed: true }),
    ]);
    res.json({ success: true, data: { totalWatched, completed } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
