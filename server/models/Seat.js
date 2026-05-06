const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true
  },
  seatLabel: {
    type: String,
    required: true
  },
  seatType: {
    type: String,
    enum: ['teacher', 'student'],
    required: true
  },
  position: {
    type: String,
    enum: ['left', 'right', 'top'],
    required: true
  },
  row: {
    type: Number,
    default: 0
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookedByName: {
    type: String,
    default: null
  },
  bookedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Seat', seatSchema);
