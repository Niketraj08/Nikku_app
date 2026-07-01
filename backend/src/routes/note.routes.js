import { Router } from 'express';
import Note from '../models/Note.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.videoId) filter.video = req.query.videoId;
    const notes = await Note.find({ user: req.user._id, ...filter })
      .populate('video', 'title slug thumbnail')
      .sort('-createdAt');
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user._id });
    await note.populate('video', 'title slug thumbnail');
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    ).populate('video', 'title slug thumbnail');
    if (!note) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
