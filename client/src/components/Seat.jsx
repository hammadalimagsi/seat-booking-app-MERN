const Seat = ({ seat, isOwn, onSelect, isSelected }) => {
  const isTeacher = seat.seatType === 'teacher';
  const isBooked = seat.isBooked;

  let bgColor = 'bg-slate-900/40';
  let borderColor = 'border-white/5';
  let textColor = 'text-slate-500';
  let statusText = 'Available';
  let hoverStyles = 'hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:scale-[1.03]';

  if (isTeacher) {
    bgColor = 'bg-purple-900/20';
    borderColor = 'border-purple-500/40';
    textColor = 'text-purple-400';
    statusText = 'Faculty';
    hoverStyles = 'hover:border-purple-500/50 hover:bg-purple-500/5 hover:scale-[1.03]';
  } else if (isOwn) {
    bgColor = 'bg-amber-500/20';
    borderColor = 'border-amber-500';
    textColor = 'text-amber-400';
    statusText = 'Mine';
    hoverStyles = 'hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]';
  } else if (isBooked) {
    // HIGHLIGHTED BOOKED SEAT
    bgColor = 'bg-indigo-600/20';
    borderColor = 'border-indigo-400/40';
    textColor = 'text-indigo-50';
    statusText = seat.bookedByName || 'Taken';
    hoverStyles = 'hover:border-indigo-400 hover:bg-indigo-600/30 hover:scale-[1.03]';
  } else if (isSelected) {
    bgColor = 'bg-accent/20';
    borderColor = 'border-accent';
    textColor = 'text-accent';
    statusText = 'Select';
    hoverStyles = 'scale-[1.05] shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)]';
  }

  return (
    <button
      className={`
        relative group flex flex-col items-center justify-center
        w-[110px] xs:w-[130px] sm:w-[160px] md:w-[180px] 
        h-[52px] xs:h-[56px] sm:h-[62px] 
        border-[1.5px] rounded-lg transition-all duration-300
        ${bgColor} ${borderColor} ${textColor} ${hoverStyles}
        ${isBooked ? 'shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' : ''}
      `}
      onClick={() => onSelect(seat)}
      title={`${seat.seatLabel}: ${statusText}`}
    >
      <span className={`text-[11px] sm:text-sm font-bold leading-tight mb-0.5 ${isBooked ? 'text-indigo-300/90' : ''}`}>
        {seat.seatLabel}
      </span>
      <span className={`
        text-[9px] sm:text-[11px] font-medium break-all line-clamp-2 px-2 text-center leading-tight
        ${isBooked ? 'opacity-100 font-semibold' : 'opacity-80'}
      `}>
        {statusText}
      </span>
      
      {/* More Info Hint */}
      {(isBooked || isTeacher) && (
        <div className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 bg-slate-800 border border-white/20 rounded-full p-1 shadow-xl z-20">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}

      {isOwn && (
        <div className="absolute inset-[-2px] border-2 border-amber-500 rounded-lg animate-pulse pointer-events-none z-10 shadow-[0_0_15px_rgba(245,158,11,0.4)]"></div>
      )}
    </button>
  );
};

export default Seat;
