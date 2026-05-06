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
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading DineReserve...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
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
