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
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-accent/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Synchronizing Hall Layout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pb-20 pt-10">
      <SeatMap seats={seats} onUpdate={fetchSeats} />
    </div>
  );
};

export default Hall;
