import { Router } from 'express';
import Playlist from '../models/Playlist.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id })
      .populate('videos', 'title slug thumbnail duration')
      .sort('-updatedAt');
    res.json({ success: true, data: playlists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const playlist = await Playlist.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: playlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    ).populate('videos', 'title slug thumbnail duration');
    if (!playlist) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: playlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Playlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/videos', async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $addToSet: { videos: req.body.videoId } },
      { new: true }
    ).populate('videos', 'title slug thumbnail duration');
    res.json({ success: true, data: playlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id/videos/:videoId', async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $pull: { videos: req.params.videoId } },
      { new: true }
    ).populate('videos', 'title slug thumbnail duration');
    res.json({ success: true, data: playlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
