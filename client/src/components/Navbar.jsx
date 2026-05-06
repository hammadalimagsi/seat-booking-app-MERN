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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-text">DineReserve</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/hall" className="nav-link">
                <span className="nav-icon">🪑</span>
                Hall View
              </Link>
              <div className="nav-user">
                <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
