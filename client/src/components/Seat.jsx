const Seat = ({ seat, isOwn, onSelect, isSelected }) => {
  const isTeacher = seat.seatType === 'teacher';
  const isBooked = seat.isBooked;

  let bgColor = 'bg-slate-800/40';
  let borderColor = 'border-white/10';
  let textColor = 'text-slate-400';
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
    hoverStyles = 'hover:scale-[1.05] hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]';
  } else if (isBooked) {
    bgColor = 'bg-slate-900/60';
    borderColor = 'border-white/10';
    textColor = 'text-slate-300';
    statusText = seat.bookedByName || 'Taken';
    hoverStyles = 'hover:border-rose-500/30 hover:bg-rose-500/5 hover:scale-[1.03]';
  } else if (isSelected) {
    bgColor = 'bg-accent/20';
    borderColor = 'border-accent';
    textColor = 'text-accent';
    statusText = 'Select';
    hoverStyles = 'scale-[1.05] shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]';
  }

  return (
    <button
      className={`
        relative group flex flex-col items-center justify-center
        w-[85px] xs:w-[100px] sm:w-[120px] md:w-[130px] 
        h-[44px] xs:h-[48px] sm:h-[52px] 
        border-[1.5px] rounded-lg transition-all duration-300
        ${bgColor} ${borderColor} ${textColor} ${hoverStyles}
      `}
      onClick={() => onSelect(seat)}
      title={`${seat.seatLabel}: ${statusText}`}
    >
      <span className="text-[10px] sm:text-xs font-bold leading-tight">{seat.seatLabel}</span>
      <span className="text-[8px] sm:text-[10px] font-medium opacity-80 truncate max-w-full px-1">{statusText}</span>
      
      {/* More Info Hint */}
      {(isBooked || isTeacher) && (
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-white/20 rounded-full p-0.5 shadow-lg">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}

      {isOwn && (
        <div className="absolute inset-[-2px] border border-amber-500/50 rounded-lg animate-pulse pointer-events-none"></div>
      )}
    </button>
  );
};

export default Seat;
