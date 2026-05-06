import { useState, useEffect } from 'react';
import SeatMap from '../components/SeatMap';
import { api } from '../utils/api';

const Hall = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSeats = async () => {
    try {
      const data = await api.getSeats();
      setSeats(data.seats);
    } catch (error) {
      console.error('Failed to fetch seats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dining hall...</p>
      </div>
    );
  }

  return (
    <div className="hall-page">
      <SeatMap seats={seats} onUpdate={fetchSeats} />
    </div>
  );
};

export default Hall;
