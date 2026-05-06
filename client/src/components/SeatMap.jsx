import { useState } from 'react';
import Seat from './Seat';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SeatMap = ({ seats, onUpdate }) => {
  const { user, refreshUser } = useAuth();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const teacherSeats = seats.filter(s => s.seatType === 'teacher');
  const leftSeats = seats.filter(s => s.position === 'left').sort((a, b) => a.row - b.row);
  const rightSeats = seats.filter(s => s.position === 'right').sort((a, b) => a.row - b.row);

  const userSeatId = user?.bookedSeat?._id || user?.bookedSeat;
  const hasBooking = !!userSeatId;

  const handleSelect = (seat) => {
    // If it's the same seat, deselect it
    if (selectedSeat?._id === seat._id) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat);
    }
    setMessage({ text: '', type: '' });
  };

  const handleBook = async () => {
    if (!selectedSeat) return;
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const data = await api.bookSeat(selectedSeat._id);
      setMessage({ text: data.message, type: 'success' });
      setSelectedSeat(null);
      await refreshUser();
      onUpdate();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const data = await api.cancelBooking();
      setMessage({ text: data.message, type: 'success' });
      await refreshUser();
      onUpdate();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const bookedCount = seats.filter(s => s.isBooked && s.seatType === 'student').length;
  const availableCount = 38 - bookedCount;

  return (
    <div className="seatmap-wrapper">
      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-dot available"></div>
          <span>Available: {availableCount}</span>
        </div>
        <div className="stat">
          <div className="stat-dot booked"></div>
          <span>Occupied: {bookedCount}</span>
        </div>
        <div className="stat">
          <div className="stat-dot teacher"></div>
          <span>Reserved: 2</span>
        </div>
        {hasBooking && (
          <div className="stat">
            <div className="stat-dot own"></div>
            <span>Your Seat</span>
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.type === 'success' && '✅ '}
          {message.type === 'error' && '❌ '}
          {message.type === 'warning' && '⚠️ '}
          {message.text}
        </div>
      )}

      {/* Hall Layout */}
      <div className="hall">
        <div className="hall-header">
          <h2 className="hall-title">🏛️ Dining Hall</h2>
          <p className="hall-subtitle">Main Hall — 40 Seats</p>
        </div>

        {/* Teacher Seats at the head */}
        <div className="teacher-section">
          <div className="teacher-label">Head of Table</div>
          <div className="teacher-seats">
            {teacherSeats.map(seat => (
              <Seat
                key={seat._id}
                seat={seat}
                isOwn={false}
                onSelect={() => {}}
                isSelected={false}
              />
            ))}
          </div>
          <div className="table-head"></div>
        </div>

        {/* Main table with student seats on both sides */}
        <div className="dining-area">
          <div className="seats-column left-column">
            {leftSeats.map(seat => (
              <Seat
                key={seat._id}
                seat={seat}
                isOwn={seat._id === userSeatId}
                onSelect={handleSelect}
                isSelected={selectedSeat?._id === seat._id}
              />
            ))}
          </div>

          <div className="table-center">
            <div className="table-surface">
              <div className="table-line"></div>
              {Array.from({ length: 19 }, (_, i) => (
                <div key={i} className="table-segment">
                  <div className="table-prop">🍽️</div>
                  <div className="table-divider"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="seats-column right-column">
            {rightSeats.map(seat => (
              <Seat
                key={seat._id}
                seat={seat}
                isOwn={seat._id === userSeatId}
                onSelect={handleSelect}
                isSelected={selectedSeat?._id === seat._id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Details Side Panel / Drawer */}
      <div className={`details-drawer ${selectedSeat ? 'open' : ''}`}>
        <button className="close-drawer" onClick={() => setSelectedSeat(null)}>✕</button>
        
        {selectedSeat && (
          <div className="drawer-content">
            <div className="drawer-header">
              <div className={`drawer-avatar ${selectedSeat.seatType}`}>
                {selectedSeat.isBooked ? selectedSeat.bookedByName?.charAt(0).toUpperCase() : selectedSeat.seatLabel}
              </div>
              <h2>Seat {selectedSeat.seatLabel}</h2>
              <span className={`badge badge-${selectedSeat.isBooked ? 'booked' : 'available'}`}>
                {selectedSeat.seatType === 'teacher' ? 'Faculty Reserved' : selectedSeat.isBooked ? 'Occupied' : 'Available'}
              </span>
            </div>

            <div className="drawer-body">
              {selectedSeat.isBooked ? (
                <div className="occupant-info">
                  <p className="label">Occupied By</p>
                  <p className="value">{selectedSeat.bookedByName}</p>
                  <p className="label">Booking Time</p>
                  <p className="value">{new Date(selectedSeat.bookedAt || Date.now()).toLocaleString()}</p>
                  
                  {selectedSeat._id === userSeatId ? (
                    <div className="own-actions">
                      <p className="own-msg">This is your reserved seat.</p>
                      <button className="btn-cancel-booking" onClick={handleCancel} disabled={loading}>
                        {loading ? 'Cancelling...' : 'Cancel My Booking'}
                      </button>
                    </div>
                  ) : (
                    <p className="buddy-msg">Say hi to your dining buddy! 👋</p>
                  )}
                </div>
              ) : selectedSeat.seatType === 'teacher' ? (
                <p className="teacher-note">This seat is strictly reserved for faculty members.</p>
              ) : (
                <div className="booking-actions">
                  {hasBooking ? (
                    <p className="warning-msg">You already have a seat booked ({seats.find(s => s._id === userSeatId)?.seatLabel}). Cancel it to book this one.</p>
                  ) : (
                    <>
                      <p className="ready-msg">Ready to reserve this spot?</p>
                      <button className="btn-book" onClick={handleBook} disabled={loading}>
                        {loading ? 'Booking...' : 'Confirm Reservation'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for Mobile */}
      {selectedSeat && <div className="drawer-backdrop" onClick={() => setSelectedSeat(null)}></div>}
    </div>
  );
};

export default SeatMap;
