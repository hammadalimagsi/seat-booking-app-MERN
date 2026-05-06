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
    hoverStyles = '';
  } else if (isOwn) {
    bgColor = 'bg-amber-500/20';
    borderColor = 'border-amber-500';
    textColor = 'text-amber-400';
    statusText = 'Mine';
    hoverStyles = 'hover:scale-[1.05]';
  } else if (isBooked) {
    bgColor = 'bg-slate-900/60';
    borderColor = 'border-white/5';
    textColor = 'text-slate-600';
    statusText = seat.bookedByName ? seat.bookedByName.split(' ')[0] : 'Taken';
    hoverStyles = 'cursor-not-allowed opacity-60';
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
        w-[70px] xs:w-[85px] sm:w-[100px] md:w-[110px] 
        h-[40px] xs:h-[44px] sm:h-[46px] 
        border-[1.5px] rounded-lg transition-all duration-300
        ${bgColor} ${borderColor} ${textColor} ${hoverStyles}
      `}
      onClick={() => onSelect(seat)}
      disabled={isTeacher || (isBooked && !isOwn)}
      title={`${seat.seatLabel}: ${statusText}`}
    >
      <span className="text-[10px] sm:text-xs font-bold leading-tight">{seat.seatLabel}</span>
      <span className="text-[8px] sm:text-[10px] font-medium opacity-80 truncate max-w-full px-1">{statusText}</span>
      
      {isOwn && (
        <div className="absolute inset-[-2px] border border-amber-500/50 rounded-lg animate-pulse pointer-events-none"></div>
      )}
    </button>
  );
};

export default Seat;
