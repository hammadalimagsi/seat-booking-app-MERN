import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hall from './pages/Hall';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-accent/10 border-t-accent rounded-full animate-spin mb-6"></div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Initializing Secure Environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary font-sans text-slate-200 selection:bg-accent/30 selection:text-white">
      <Navbar />
      <main className="animate-in fade-in duration-1000">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/hall" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/hall" replace /> : <Register />}
          />
          <Route
            path="/hall"
            element={
              <ProtectedRoute>
                <Hall />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
