import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SensorData from './SensorData';
import LedStates from './LedStates';
import Thresholds from './Thresholds';
import ActuatorStates from './ActuatorStates';
import ThresholdEditor from './ThresholdEditor';
import ActuatorControl from './ActuatorControl';
import HistoryPage from './HistoryPage';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

function HomePage() {
  return (
    <main className="flex-grow p-6 overflow-y-auto flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        <div className="flex flex-col gap-6">
          <SensorData />
          <LedStates />
          <Thresholds />
        </div>
        <div className="flex flex-col gap-6">
          <ThresholdEditor />
          <ActuatorStates />
          <ActuatorControl />
        </div>
      </div>
    </main>
  );
}



function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('authenticated') === 'true';
    setIsAuthenticated(auth);
    if (!auth && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;
