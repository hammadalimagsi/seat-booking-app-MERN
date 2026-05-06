const Seat = require('../models/Seat');

const seedSeats = async () => {
  try {
    const count = await Seat.countDocuments();
    if (count > 0) {
      console.log('Seats already seeded.');
      return;
    }

    const seats = [];

    // Teacher seats (top of table, pre-reserved)
    seats.push({
      seatNumber: 1,
      seatLabel: 'T1',
      seatType: 'teacher',
      position: 'top',
      row: 0,
      isBooked: true,
      bookedByName: 'Reserved for Teacher'
    });
    seats.push({
      seatNumber: 2,
      seatLabel: 'T2',
      seatType: 'teacher',
      position: 'top',
      row: 0,
      isBooked: true,
      bookedByName: 'Reserved for Teacher'
    });

    // Left side student seats (19 seats)
    for (let i = 0; i < 19; i++) {
      seats.push({
        seatNumber: i + 3,
        seatLabel: `L${i + 1}`,
        seatType: 'student',
        position: 'left',
        row: i
      });
    }

    // Right side student seats (19 seats)
    for (let i = 0; i < 19; i++) {
      seats.push({
        seatNumber: i + 22,
        seatLabel: `R${i + 1}`,
        seatType: 'student',
        position: 'right',
        row: i
      });
    }

    await Seat.insertMany(seats);
    console.log('✅ 40 seats seeded successfully!');
  } catch (error) {
    console.error('Error seeding seats:', error.message);
  }
};

module.exports = seedSeats;
