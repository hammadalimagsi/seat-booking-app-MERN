import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFingerprint } from '../utils/fingerprint';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    studentId: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [securityScan, setSecurityScan] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [clientIp, setClientIp] = useState('Detecting...');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch IP just to show the user they are being watched
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setClientIp(data.ip))
      .catch(() => setClientIp('192.168.1.1 (Internal)'));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // --- SECURITY THEATER COMMENCE ---
    setSecurityScan(true);
    setLoading(true);
    
    const messages = [
      "Gathering hardware UUID...",
      "Mapping network topology...",
      "Cross-referencing Student Database...",
      "Finalizing biometric handshake..."
    ];

    for (let i = 0; i < messages.length; i++) {
      setScanMessage(messages[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    // --- SECURITY THEATER END ---

    try {
      const fingerprint = await getFingerprint();
      await register({
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId,
        password: formData.password,
        fingerprint
      });
      navigate('/hall');
    } catch (err) {
      setError(err.message);
      setSecurityScan(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 selection:bg-accent/40 pt-20">
      <div className="w-full max-w-5xl bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Left Side: Visual */}
        <div className="flex-1 bg-gradient-to-br from-purple-900 via-primary to-slate-900 p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <span className="text-5xl mb-6 block">🪑</span>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Join DineReserve</h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">Create your official student account to access the real-time dining hall reservation system.</p>
            
            <div className="space-y-4">
              {[
                { icon: '🔒', text: 'One account per student' },
                { icon: '🪑', text: 'One seat per student' },
                { icon: '⚡', text: 'Instant seat booking' }
              ].map(feature => (
                <div key={feature.text} className="flex items-center gap-3 text-slate-300 font-medium bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-md">
                  <span className="text-purple-400">{feature.icon}</span>
                  {feature.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-10 md:p-12 lg:p-16 bg-slate-900 flex flex-col justify-center">
          {securityScan ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-2 border-transparent border-b-purple-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🛡️</div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Identity Verification</h3>
              <p className="text-accent font-bold animate-pulse text-sm uppercase tracking-widest">{scanMessage}</p>
              
              <div className="mt-10 bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-xs text-slate-400 w-full max-w-sm">
                <div className="flex justify-between mb-2">
                  <span>Source Network:</span>
                  <span className="text-emerald-400 font-bold">{clientIp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hardware Key:</span>
                  <span className="text-emerald-400 font-bold opacity-60 uppercase">{Math.random().toString(36).substring(7)}</span>
                </div>
              </div>
            </div>
          ) : (
            <form className="max-w-md mx-auto w-full" onSubmit={handleSubmit}>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black tracking-[0.15em] uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Live Security Active
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-white">Create Account</h2>
                <p className="text-slate-500 font-medium">Use your official student credentials</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                  <span>❌</span> {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 font-medium">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1" htmlFor="name">Full Name</label>
                    <input id="name" type="text" name="name" className="w-full px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5 font-medium">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1" htmlFor="studentId">Student ID</label>
                    <input id="studentId" type="text" name="studentId" className="w-full px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-bold uppercase" placeholder="CS-24-001" value={formData.studentId} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-1.5 font-medium">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1" htmlFor="reg-email">Email Address</label>
                  <input id="reg-email" type="email" name="email" className="w-full px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="you@university.edu" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-medium">
                  <div className="space-y-1.5 font-medium">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1" htmlFor="reg-password">Password</label>
                    <input id="reg-password" type="password" name="password" className="w-full px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength={6} />
                  </div>
                  <div className="space-y-1.5 font-medium">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1" htmlFor="confirmPassword">Confirm</label>
                    <input id="confirmPassword" type="password" name="confirmPassword" className="w-full px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                  <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-accent focus:ring-accent" required />
                  <label htmlFor="terms" className="text-[10px] text-slate-400 leading-normal select-none">
                    I certify this is my only account. Multiple accounts result in permanent ban.
                  </label>
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-accent to-purple-600 text-white rounded-xl font-bold shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authenticating...
                    </>
                  ) : (
                    'Secure Registration'
                  )}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-slate-500 font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-accent font-bold hover:underline">Sign in</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
