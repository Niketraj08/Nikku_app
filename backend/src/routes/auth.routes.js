import { Router } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../utils/helpers.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

const router = Router();

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const sendAuthResponse = async (res, user, statusCode = 200) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  setTokenCookies(res, accessToken, refreshToken);

  res.status(statusCode).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        bio: user.bio,
        preferences: user.preferences,
      },
      accessToken,
      refreshToken,
    },
  });
};

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const user = await User.create({ name, email, password, verificationToken });

      await sendAuthResponse(res, user, 201);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }).select('+password +refreshToken');
      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      await sendAuthResponse(res, user);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.post('/refresh', async (req, res) => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    await sendAuthResponse(res, user);
  } catch {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

router.post('/logout', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
});

router.get('/me', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

router.post('/forgot-password', [body('email').isEmail()], validate, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ success: true, message: 'If email exists, reset link sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    res.json({
      success: true,
      message: 'If email exists, reset link sent',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post(
  '/reset-password',
  [body('token').notEmpty(), body('password').isLength({ min: 6 })],
  validate,
  async (req, res) => {
    try {
      const hashed = crypto.createHash('sha256').update(req.body.token).digest('hex');
      const user = await User.findOne({
        resetPasswordToken: hashed,
        resetPasswordExpires: { $gt: Date.now() },
      }).select('+password');

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.post('/verify-email', protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isVerified: true, verificationToken: undefined });
  res.json({ success: true, message: 'Email verified' });
});

export default router;
