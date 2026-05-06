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
    textColor = 'text-slate-200';
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
        w-[110px] xs:w-[130px] sm:w-[160px] md:w-[180px] 
        h-[52px] xs:h-[56px] sm:h-[62px] 
        border-[1.5px] rounded-lg transition-all duration-300
        ${bgColor} ${borderColor} ${textColor} ${hoverStyles}
      `}
      onClick={() => onSelect(seat)}
      title={`${seat.seatLabel}: ${statusText}`}
    >
      <span className="text-[11px] sm:text-sm font-bold leading-tight mb-0.5">{seat.seatLabel}</span>
      <span className="text-[9px] sm:text-[11px] font-medium opacity-90 break-all line-clamp-2 px-2 text-center leading-tight">
        {statusText}
      </span>
      
      {/* More Info Hint */}
      {(isBooked || isTeacher) && (
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-white/20 rounded-full p-0.5 shadow-lg z-10">
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
