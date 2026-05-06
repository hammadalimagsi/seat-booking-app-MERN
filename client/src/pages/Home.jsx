import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-primary text-white overflow-hidden selection:bg-accent/40">
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 py-20 lg:py-0 gap-12 max-w-7xl mx-auto overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent rounded-full blur-[100px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-purple-600 rounded-full blur-[100px] opacity-10 animate-bounce [animation-duration:8s]"></div>
        </div>

        <div className="relative z-10 flex-1 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-accent text-xs font-bold uppercase tracking-widest">
            <span>🍽️</span> Dining Hall Booking System
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Reserve Your
            <span className="block bg-gradient-to-r from-accent via-purple-400 to-indigo-400 bg-clip-text text-transparent">Dining Seat</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-medium">
            Experience effortless dining with Pakistan's most advanced seat booking system. 
            Real-time maps, instant confirmation, and elite security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {user ? (
              <Link to="/hall" className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-accent to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                <span className="text-xl">🪑</span> View Hall & Book
              </Link>
            ) : (
              <>
                <Link to="/register" className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-accent to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all text-center">
                  Get Started
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold transition-all text-center">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 flex-1 hidden lg:flex justify-center items-center">
          <div className="p-10 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl scale-110">
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">T</div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">T</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-3">
                {[1,2,3,4,5].map(i => (
                  <div key={`l${i}`} className={`w-10 h-10 rounded-lg ${i <= 2 ? 'bg-rose-500/30 border border-rose-500/50' : 'bg-emerald-500/30 border border-emerald-500/50 border-dashed'}`}></div>
                ))}
              </div>
              <div className="w-10 h-[240px] bg-gradient-to-b from-accent/20 to-transparent border border-white/5 rounded-full"></div>
              <div className="flex flex-col gap-3">
                {[1,2,3,4,5].map(i => (
                  <div key={`r${i}`} className={`w-10 h-10 rounded-lg ${i === 1 ? 'bg-rose-500/30 border border-rose-500/50' : 'bg-emerald-500/30 border border-emerald-500/50 border-dashed'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-24 bg-slate-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-accent/40 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">🔐</div>
            <h3 className="text-xl font-bold mb-3">Anti-Fraud Security</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">One account per student, one seat per booking. Locked by advanced device fingerprint verification.</p>
          </div>
          <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-accent/40 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">⚡</div>
            <h3 className="text-xl font-bold mb-3">Zero Latency</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Real-time availability updates powered by blazing fast responses. Instant seat confirmation.</p>
          </div>
          <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-accent/40 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">🏛️</div>
            <h3 className="text-xl font-bold mb-3">Interactive Hall</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">A stunning visual map of the entire dining hall layout. Tap any available seat to claim it instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
