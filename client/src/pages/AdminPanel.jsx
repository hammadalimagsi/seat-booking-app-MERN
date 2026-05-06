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
      <div className="admin-login">
        <div className="admin-card">
          <h1>Admin Access</h1>
          <p>Please enter the administrator password to proceed.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="admin-btn">Unlock Panel</button>
          </form>
          {message.text && (
            <div className={`admin-alert ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => setIsAuthorized(false)} className="logout-btn">Lock Panel</button>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Clear Reservations</h2>
          <p>Use this after the party is finished to reset all student seat bookings for the next event.</p>
          <button 
            onClick={handleReset} 
            className="admin-btn danger"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reset All Seats'}
          </button>
        </div>

        <div className="admin-card">
          <h2>Increase Capacity</h2>
          <p>Add more seats to the hall. This will add rows to both the left and right sides.</p>
          <div className="increase-controls">
            <input
              type="number"
              min="1"
              max="20"
              value={seatCount}
              onChange={(e) => setSeatCount(parseInt(e.target.value))}
            />
            <span>Seats per side</span>
          </div>
          <button 
            onClick={handleIncrease} 
            className="admin-btn primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Add ${seatCount * 2} Seats Total`}
          </button>
          <button 
            onClick={handleDecrease} 
            className="admin-btn secondary outline"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Processing...' : `Remove ${seatCount * 2} Seats Total`}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`admin-alert ${message.type} fixed`}>
          {message.text}
          <button onClick={() => setMessage({ text: '', type: '' })}>×</button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
