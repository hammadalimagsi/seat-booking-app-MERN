const express = require('express');
const Seat = require('../models/Seat');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/seats - Get all seats (public)
router.get('/', async (req, res) => {
  try {
    const seats = await Seat.find().sort({ seatNumber: 1 });
    res.json({ seats });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/seats/book/:seatId - Book a seat (auth required)
router.post('/book/:seatId', auth, async (req, res) => {
  try {
    const { seatId } = req.params;
    const userId = req.user._id;

    // Check if user already has a booked seat
    const user = await User.findById(userId);
    if (user.bookedSeat) {
      return res.status(400).json({
        message: 'You already have a seat booked. Cancel your current booking first.'
      });
    }

    // Find the seat
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found.' });
    }

    // Check if it's a teacher seat
    if (seat.seatType === 'teacher') {
      return res.status(400).json({ message: 'Teacher seats are reserved and cannot be booked.' });
    }

    // Check if seat is already booked
    if (seat.isBooked) {
      return res.status(400).json({ message: 'This seat is already booked by someone else.' });
    }

    // Book the seat
    seat.isBooked = true;
    seat.bookedBy = userId;
    seat.bookedByName = user.name;
    seat.bookedAt = new Date();
    await seat.save();

    // Update user's booked seat without triggering full validation
    await User.findByIdAndUpdate(userId, { bookedSeat: seat._id });

    res.json({
      message: `Seat ${seat.seatLabel} booked successfully!`,
      seat
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/seats/cancel - Cancel booking (auth required)
router.post('/cancel', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user.bookedSeat) {
      return res.status(400).json({ message: "You don't have any seat booked." });
    }

    // Find and unbook the seat
    const seat = await Seat.findById(user.bookedSeat);
    if (seat) {
      seat.isBooked = false;
      seat.bookedBy = null;
      seat.bookedByName = null;
      seat.bookedAt = null;
      await seat.save();
    }

    // Update user without triggering full validation
    await User.findByIdAndUpdate(userId, { bookedSeat: null });

    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
