const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, studentId, password, fingerprint } = req.body;

    if (!name || !email || !studentId || !password || !fingerprint) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check if email or student ID already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const existingId = await User.findOne({ studentId: studentId.toUpperCase() });
    if (existingId) {
      return res.status(400).json({ message: 'An account with this Student ID already exists.' });
    }

    // Check if fingerprint already exists (anti-fraud)
    const existingFingerprint = await User.findOne({ fingerprint });
    if (existingFingerprint) {
      const maskedEmail = existingFingerprint.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      return res.status(400).json({
        message: `An account already exists from this device (${maskedEmail}). Each student can only have one account.`
      });
    }

    // Create user
    const user = await User.create({ name, email, studentId: studentId.toUpperCase(), password, fingerprint });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        bookedSeat: user.bookedSeat
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: `Server error debugging: ${error.message}` });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, fingerprint } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Update fingerprint on login
    if (fingerprint && fingerprint !== user.fingerprint) {
      user.fingerprint = fingerprint;
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        bookedSeat: user.bookedSeat
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -fingerprint')
      .populate('bookedSeat');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
