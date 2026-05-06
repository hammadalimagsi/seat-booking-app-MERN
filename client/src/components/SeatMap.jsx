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
  const studentSeatsCount = seats.filter(s => s.seatType === 'student').length;
  const availableCount = studentSeatsCount - bookedCount;

  const maxRow = seats.length > 0 ? Math.max(...seats.map(s => s.row)) : 18;
  const rowCount = maxRow + 1;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
          <span>Available: {availableCount}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></div>
          <span>Occupied: {bookedCount}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
          <span>Faculty: {teacherSeats.length}</span>
        </div>
        {hasBooking && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
            <span>Your Seat</span>
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-xl text-center text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 
          message.type === 'error' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 
          'bg-amber-500/10 border border-amber-500/30 text-amber-400'
        }`}>
          {message.type === 'success' && '✅ '}
          {message.type === 'error' && '❌ '}
          {message.type === 'warning' && '⚠️ '}
          {message.text}
        </div>
      )}

      {/* Hall Layout Container */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 sm:p-10 overflow-x-auto scrollbar-hide">
        <div className="min-w-[550px] flex flex-col items-center">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">🏛️ Dining Hall</h2>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Main Hall — {seats.length} Total Seats</p>
          </div>

          {/* Teacher Section */}
          <div className="mb-10 w-full flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">Head of Table</div>
            <div className="flex justify-center gap-4 sm:gap-6 mb-4">
              {teacherSeats.map(seat => (
                <Seat key={seat._id} seat={seat} isOwn={false} onSelect={() => {}} isSelected={false} />
              ))}
            </div>
            <div className="w-[60%] h-1.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent rounded-full"></div>
          </div>

          {/* Dining Area */}
          <div className="flex justify-center items-start w-full">
            <div className="flex flex-col gap-2">
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

            <div className="relative flex flex-col w-12 sm:w-16 mx-1 sm:mx-2 bg-gradient-to-b from-white/5 to-white/[0.02] border-x border-white/5">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/20 via-purple-500/20 to-accent/20"></div>
              {Array.from({ length: rowCount }, (_, i) => (
                <div key={i} className="h-[52px] xs:h-[56px] sm:h-[62px] mt-[6.5px] mb-[1.5px] first:mt-0 flex items-center justify-between px-1 z-10">
                  <div className="text-[10px] opacity-40 grayscale hover:grayscale-0 transition-all">🍽️</div>
                  <div className="text-[10px] opacity-40 grayscale hover:grayscale-0 transition-all">🍽️</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
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
      </div>

      {/* Details Side Panel / Mobile Bottom Sheet */}
      <div className={`fixed inset-0 z-[1000] pointer-events-none ${selectedSeat ? 'pointer-events-auto' : ''}`}>
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${selectedSeat ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSelectedSeat(null)}
        ></div>
        
        <div className={`
          absolute bg-slate-900 border-white/10 shadow-2xl transition-all duration-500 ease-out
          bottom-0 left-0 right-0 rounded-t-[2.5rem] p-8 md:p-10
          md:top-20 md:right-0 md:left-auto md:w-[400px] md:h-[calc(100vh-100px)] md:rounded-l-[2.5rem] md:rounded-tr-none
          ${selectedSeat ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}
        `}>
          <button className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors" onClick={() => setSelectedSeat(null)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          {selectedSeat && (
            <div className="flex flex-col h-full">
              <div className="text-center mb-8">
                <div className={`
                  w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg
                  ${selectedSeat.isBooked ? 'bg-gradient-to-tr from-rose-500 to-orange-500' : 'bg-gradient-to-tr from-emerald-500 to-teal-500'}
                  ${selectedSeat.seatType === 'teacher' ? 'from-purple-500 to-indigo-500' : ''}
                `}>
                  {selectedSeat.isBooked ? selectedSeat.bookedByName?.charAt(0).toUpperCase() : selectedSeat.seatLabel}
                </div>
                <h2 className="text-2xl font-bold text-white">Seat {selectedSeat.seatLabel}</h2>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  selectedSeat.isBooked ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {selectedSeat.seatType === 'teacher' ? 'Faculty Reserved' : selectedSeat.isBooked ? 'Occupied' : 'All yours for the taking'}
                </span>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto">
                {selectedSeat.isBooked ? (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Occupant</p>
                        <p className="text-lg font-semibold text-white">{selectedSeat.bookedByName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Booking Time</p>
                        <p className="text-white/80">{new Date(selectedSeat.bookedAt || Date.now()).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {selectedSeat._id === userSeatId ? (
                      <div className="mt-8">
                        <p className="text-amber-400 text-sm mb-4 font-medium flex items-center gap-2">
                          <span>✨</span> This is your reserved spot.
                        </p>
                        <button className="w-full py-4 bg-rose-500/10 border border-rose-500/50 text-rose-500 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50" onClick={handleCancel} disabled={loading}>
                          {loading ? 'Processing...' : 'Cancel My Booking'}
                        </button>
                      </div>
                    ) : (
                      <p className="mt-6 text-slate-500 text-sm italic">You can't book this seat. It's already taken! 👋</p>
                    )}
                  </div>
                ) : selectedSeat.seatType === 'teacher' ? (
                  <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl">
                    <p className="text-purple-400 text-sm leading-relaxed font-medium">This throne is strictly reserved for faculty members. Real students eat on the sidelines! 🎓</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {hasBooking ? (
                      <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                        <p className="text-amber-500 text-sm leading-relaxed">
                          Oops! You already have a seat booked. You'll need to cancel your current one before grabbing this spot.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-slate-400 mb-6">Excellent choice! Ready to claim this territory for your lunch?</p>
                        <button className="w-full py-5 bg-gradient-to-r from-accent to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50" onClick={handleBook} disabled={loading}>
                          {loading ? 'Working on it...' : 'Confirm My Reservation'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
