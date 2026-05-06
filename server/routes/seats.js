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

// ADMIN ROUTES (Protected by static password)
const ADMIN_PASSWORD = 'Admin@Abdul-Rasheed123';

const checkAdmin = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Admin Password' });
  }
  next();
};

// POST /api/seats/admin/reset - Reset all reservations
router.post('/admin/reset', checkAdmin, async (req, res) => {
  try {
    // 1. Reset all seats (except teacher seats which are pre-reserved)
    // Actually, even teacher seats should be "booked" by the teacher, 
    // but the request said "clear all reservations once the party is finished".
    // I'll unbook all student seats and keep teacher seats as they were (Reserved for Teacher).
    
    await Seat.updateMany(
      { seatType: 'student' },
      { 
        isBooked: false, 
        bookedBy: null, 
        bookedByName: null, 
        bookedAt: null 
      }
    );

    // 2. Clear bookedSeat field for all users
    await User.updateMany({}, { bookedSeat: null });

    res.json({ message: 'All reservations have been cleared successfully.' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ message: 'Server error while resetting reservations.' });
  }
});

// POST /api/seats/admin/increase - Increase number of seats
router.post('/admin/increase', checkAdmin, async (req, res) => {
  try {
    const { count = 5 } = req.body; // Default add 5 seats per side
    
    // Find highest seat number
    const lastSeat = await Seat.findOne().sort({ seatNumber: -1 });
    let nextSeatNum = lastSeat ? lastSeat.seatNumber + 1 : 1;

    // Find current max rows for left and right
    const leftSeats = await Seat.find({ position: 'left' }).sort({ row: -1 }).limit(1);
    const rightSeats = await Seat.find({ position: 'right' }).sort({ row: -1 }).limit(1);
    
    let nextLeftRow = leftSeats.length > 0 ? leftSeats[0].row + 1 : 0;
    let nextRightRow = rightSeats.length > 0 ? rightSeats[0].row + 1 : 0;

    const newSeats = [];

    // Add seats to left side
    for (let i = 0; i < count; i++) {
      newSeats.push({
        seatNumber: nextSeatNum++,
        seatLabel: `L${await Seat.countDocuments({ position: 'left' }) + i + 1}`,
        seatType: 'student',
        position: 'left',
        row: nextLeftRow++
      });
    }

    // Add seats to right side
    for (let i = 0; i < count; i++) {
      newSeats.push({
        seatNumber: nextSeatNum++,
        seatLabel: `R${await Seat.countDocuments({ position: 'right' }) + i + 1}`,
        seatType: 'student',
        position: 'right',
        row: nextRightRow++
      });
    }

    await Seat.insertMany(newSeats);

    res.json({ 
      message: `Successfully added ${count * 2} new seats (${count} per side).`,
      newSeats 
    });
  } catch (error) {
    console.error('Increase error:', error);
    res.status(500).json({ message: 'Server error while adding seats.' });
  }
});

// POST /api/seats/admin/decrease - Decrease number of seats
router.post('/admin/decrease', checkAdmin, async (req, res) => {
  try {
    const { count = 5 } = req.body; // Default remove 5 seats per side
    
    // Find seats to remove (highest row/seatNumber for left and right)
    const leftSeatsToDelete = await Seat.find({ position: 'left' })
      .sort({ seatNumber: -1 })
      .limit(count);
    
    const rightSeatsToDelete = await Seat.find({ position: 'right' })
      .sort({ seatNumber: -1 })
      .limit(count);

    const seatsToDelete = [...leftSeatsToDelete, ...rightSeatsToDelete];
    const seatIds = seatsToDelete.map(s => s._id);

    if (seatsToDelete.length === 0) {
      return res.status(400).json({ message: 'No student seats found to remove.' });
    }

    // Clear bookedSeat for any users who booked these seats
    await User.updateMany(
      { bookedSeat: { $in: seatIds } },
      { bookedSeat: null }
    );

    // Delete the seats
    await Seat.deleteMany({ _id: { $in: seatIds } });

    res.json({ 
      message: `Successfully removed ${seatsToDelete.length} seats (${leftSeatsToDelete.length} left, ${rightSeatsToDelete.length} right).` 
    });
  } catch (error) {
    console.error('Decrease error:', error);
    res.status(500).json({ message: 'Server error while removing seats.' });
  }
});

module.exports = router;
