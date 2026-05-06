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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-content">
            <span className="visual-emoji">🍽️</span>
            <h1>Welcome Back</h1>
            <p>Login to manage your dining seat reservation</p>
            <div className="visual-features">
              <div className="feature">✓ One-click booking</div>
              <div className="feature">✓ Real-time availability</div>
              <div className="feature">✓ Instant confirmation</div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to continue</p>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
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
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner"></span> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="form-footer">
              Don't have an account?{' '}
              <Link to="/register">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
