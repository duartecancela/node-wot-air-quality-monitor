import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SensorData from './SensorData';
import LedStates from './LedStates';
import Thresholds from './Thresholds';
import ActuatorStates from './ActuatorStates';
import ThresholdEditor from './ThresholdEditor';
import ActuatorControl from './ActuatorControl';
import HistoryPage from './HistoryPage';
import { Routes, Route } from 'react-router-dom';




function HomePage() {
  return (
    <main className="flex-grow flex flex-col items-center gap-6 p-6 overflow-y-auto">
      <SensorData />
      <LedStates />
      <Thresholds />
      <ThresholdEditor />
      <ActuatorStates />
      <ActuatorControl />
    </main>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
