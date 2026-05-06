const Seat = ({ seat, isOwn, onSelect, isSelected }) => {
  const isTeacher = seat.seatType === 'teacher';
  const isBooked = seat.isBooked;

  let statusClass = 'seat-available';
  let statusText = 'Available';

  if (isTeacher) {
    statusClass = 'seat-teacher';
    statusText = 'Reserved';
  } else if (isOwn) {
    statusClass = 'seat-own';
    statusText = 'You';
  } else if (isBooked) {
    statusClass = 'seat-booked';
    // Show first name if available, otherwise 'Occupied'
    const name = seat.bookedByName ? seat.bookedByName.split(' ')[0] : 'Occupied';
    statusText = name;
  } else if (isSelected) {
    statusClass = 'seat-selected';
    statusText = 'Selected';
  }

  const canClick = !isTeacher && !isBooked && !isOwn;

  return (
    <button
      className={`seat ${statusClass} ${seat.position} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(seat)}
      disabled={isTeacher}
      title={statusText}
    >
      <div className="seat-inner">
        <span className="seat-label">{seat.seatLabel}</span>
        <span className="seat-status">{statusText}</span>
      </div>
      
      {isOwn && <div className="seat-glow"></div>}
    </button>
  );
};

export default Seat;
