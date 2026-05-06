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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual register-visual">
          <div className="visual-content">
            <span className="visual-emoji">🪑</span>
            <h1>Join DineReserve</h1>
            <p>Create your account to reserve your dining seat</p>
            <div className="visual-features">
              <div className="feature">🔒 One account per student</div>
              <div className="feature">🪑 One seat per student</div>
              <div className="feature">⚡ Instant seat booking</div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          {securityScan ? (
            <div className="security-scan-overlay">
              <div className="scan-content">
                <div className="scan-radar">
                  <div className="radar-circle"></div>
                  <div className="radar-sweep"></div>
                </div>
                <h3>Identity Verification in Progress</h3>
                <p className="scan-msg">{scanMessage}</p>
                <div className="scan-data">
                  <code>IP: {clientIp}</code>
                  <code>FP: {Math.random().toString(36).substring(7).toUpperCase()}</code>
                </div>
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="security-badge">
                <span className="pulse-dot"></span>
                LIVE SECURITY MONITORING ACTIVE
              </div>
              
              <div className="form-header">
                <h2>Create Account</h2>
                <p>Register with your official student credentials</p>
              </div>

              {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentId">Student ID / Roll Number</label>
              <input
                id="studentId"
                type="text"
                name="studentId"
                placeholder="e.g. CS-2024-001"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="form-agreement">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I certify that this is my ONLY account. I understand that creating multiple accounts 
                will result in a permanent ban and disciplinary action.
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner"></span> Authenticating...</>
              ) : (
                'Secure Registration'
              )}
            </button>

            <div className="ip-display">
              Registered from: <strong>{clientIp}</strong>
            </div>

            <p className="form-footer">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
