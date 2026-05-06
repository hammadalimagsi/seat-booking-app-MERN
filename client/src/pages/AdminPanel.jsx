import React, { useState } from 'react';
import { api } from '../utils/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [seatCount, setSeatCount] = useState(5);

  const ADMIN_PASSWORD = 'Admin@Abdul-Rasheed123';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      setMessage({ text: 'Access granted.', type: 'success' });
    } else {
      setMessage({ text: 'Incorrect password.', type: 'error' });
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to clear ALL reservations? This cannot be undone.')) return;
    
    setLoading(true);
    try {
      const response = await api.adminReset(password);
      setMessage({ text: response.message, type: 'success' });
    } catch (error) {
      setMessage({ 
        text: error.message || 'Error resetting reservations.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    setLoading(true);
    try {
      const response = await api.adminIncrease(password, seatCount);
      setMessage({ text: response.message, type: 'success' });
    } catch (error) {
      setMessage({ 
        text: error.message || 'Error adding seats.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async () => {
    if (!window.confirm(`Are you sure you want to remove ${seatCount * 2} seats? This will also cancel any bookings for those seats.`)) return;
    
    setLoading(true);
    try {
      const response = await api.adminDecrease(password, seatCount);
      setMessage({ text: response.message, type: 'success' });
    } catch (error) {
      setMessage({ 
        text: error.message || 'Error removing seats.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center p-4 bg-primary text-white">
        <div className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl">
          <h1 className="text-2xl font-black mb-2 tracking-tight text-center">Admin Access</h1>
          <p className="text-slate-400 text-sm mb-8 text-center">Please enter the administrator password to proceed.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              className="w-full px-5 py-4 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-accent to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-accent/20 transition-all active:scale-[0.98]">
              Unlock Panel
            </button>
          </form>
          {message.text && (
            <div className={`mt-6 p-4 rounded-xl text-center text-sm font-semibold ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-12 bg-primary">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Management Console</p>
          </div>
          <button 
            onClick={() => setIsAuthorized(false)} 
            className="px-6 py-3 bg-slate-800/50 hover:bg-rose-500/10 hover:text-rose-500 text-slate-300 border border-white/5 rounded-xl text-sm font-black transition-all text-center sm:text-left"
          >
            Lock Panel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-slate-900/40 border border-white/5 rounded-3xl flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center text-2xl mb-6">🧹</div>
            <h2 className="text-xl font-bold text-white mb-2">Clear Reservations</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Reset all student seat bookings for the next event. This action is permanent.</p>
            <button 
              onClick={handleReset} 
              className="mt-auto w-full py-4 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 rounded-xl font-bold transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Reset All Seats'}
            </button>
          </div>

          <div className="p-8 bg-slate-900/40 border border-white/5 rounded-3xl flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-6">➕</div>
            <h2 className="text-xl font-bold text-white mb-2">Capacity Control</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">Dynamically adjust the hall layout by adding or removing rows of seats.</p>
            
            <div className="flex items-center gap-4 mb-8 bg-white/5 p-2 rounded-xl border border-white/5">
              <input
                type="number"
                min="1"
                max="20"
                className="w-16 bg-slate-800 border-none rounded-lg text-center font-bold text-accent py-2 focus:ring-0"
                value={seatCount}
                onChange={(e) => setSeatCount(parseInt(e.target.value))}
              />
              <span className="text-xs uppercase font-black text-slate-500 tracking-widest px-2">Seats Per Side</span>
            </div>
            
            <div className="w-full space-y-3">
              <button 
                onClick={handleIncrease} 
                className="w-full py-4 bg-accent/20 hover:bg-accent text-accent hover:text-white border border-accent/30 rounded-xl font-bold transition-all disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Add ${seatCount * 2} Seats`}
              </button>
              <button 
                onClick={handleDecrease} 
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl font-medium transition-all disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Remove ${seatCount * 2} Seats`}
              </button>
            </div>
          </div>
        </div>

        {message.text && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-5 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-5 duration-300">
            <p className={`text-sm font-bold ${message.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>{message.text}</p>
            <button onClick={() => setMessage({ text: '', type: '' })} className="text-slate-500 hover:text-white text-xl">×</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
