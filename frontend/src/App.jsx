import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SensorData from './SensorData';
import LedStates from './LedStates';
import Thresholds from './Thresholds';
import ActuatorStates from './ActuatorStates';
import ThresholdEditor from './ThresholdEditor';
import ActuatorControl from './ActuatorControl';





function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center gap-6 p-6 overflow-y-auto">
        <SensorData />
        <LedStates />
        <Thresholds />
        <ActuatorStates />
        <ThresholdEditor />
        <ActuatorControl />

      </main>
      <Footer />
    </div>
  );
}

export default App;
