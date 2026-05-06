import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-[100] bg-primary/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🍽️</span>
          <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent hidden sm:inline">DineReserve</span>
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          {user ? (
            <>
              <Link to="/hall" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium p-2">
                <span>🪑</span>
                <span className="hidden xs:inline">Hall</span>
              </Link>
              <div className="flex items-center gap-2 bg-slate-800/50 border border-white/5 rounded-full py-1 px-3">
                <div className="w-7 h-7 bg-gradient-to-tr from-accent to-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-300 hidden md:inline max-w-[100px] truncate">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all transition-colors whitespace-nowrap">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 transition-colors">Login</Link>
              <Link to="/register" className="bg-gradient-to-tr from-accent to-purple-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
