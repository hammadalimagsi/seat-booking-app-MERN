import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">🍽️ Dining Hall Booking System</div>
          <h1 className="hero-title">
            Reserve Your
            <span className="gradient-text"> Dining Seat</span>
          </h1>
          <p className="hero-description">
            Book your preferred seat at the dining hall with just a click. 
            Real-time availability, instant confirmation, one seat per student.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/hall" className="btn-hero">
                🪑 View Hall & Book
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-hero">
                  Get Started
                </Link>
                <Link to="/login" className="btn-hero-outline">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="mini-hall">
            <div className="mini-head">
              <div className="mini-seat teacher">T</div>
              <div className="mini-seat teacher">T</div>
            </div>
            <div className="mini-table-area">
              <div className="mini-col">
                {[1,2,3,4,5].map(i => (
                  <div key={`l${i}`} className={`mini-seat ${i <= 2 ? 'booked' : 'free'}`}></div>
                ))}
              </div>
              <div className="mini-table"></div>
              <div className="mini-col">
                {[1,2,3,4,5].map(i => (
                  <div key={`r${i}`} className={`mini-seat ${i === 1 ? 'booked' : 'free'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Booking</h3>
            <p>One account per student, one seat per booking. Anti-fraud device verification included.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Updates</h3>
            <p>See seat availability instantly. Book or cancel with a single click.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Visual Hall Map</h3>
            <p>Interactive dining hall layout showing all 40 seats with real-time status.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
