import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFingerprint } from '../utils/fingerprint';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fingerprint = await getFingerprint();
      await login({ ...formData, fingerprint });
      navigate('/hall');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 selection:bg-accent/40 pt-20">
      <div className="w-full max-w-5xl bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Left Side: Visual */}
        <div className="flex-1 bg-gradient-to-br from-indigo-900 via-primary to-slate-900 p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <span className="text-5xl mb-6 block">🍽️</span>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">Login to manage your premium dining seat reservation and view the real-time hall map.</p>
            
            <div className="space-y-4">
              {['One-click booking', 'Real-time availability', 'Instant confirmation'].map(feature => (
                <div key={feature} className="flex items-center gap-3 text-slate-300 font-medium bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-md">
                  <span className="text-emerald-500">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-10 md:p-16 bg-slate-900 flex flex-col justify-center">
          <form className="max-w-md mx-auto w-full" onSubmit={handleSubmit}>
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-white mb-2">Sign In</h2>
              <p className="text-slate-500 font-medium">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                <span>❌</span> {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-1" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full px-5 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                  placeholder="you@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 px-1" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="w-full px-5 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="w-full py-5 bg-gradient-to-r from-accent to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3 mt-10 disabled:opacity-50" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <p className="mt-10 text-center text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent font-bold hover:underline">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
