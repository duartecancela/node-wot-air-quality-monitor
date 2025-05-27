import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SensorData from './SensorData';
import LedStates from './LedStates';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center gap-6 p-6 overflow-y-auto">
        <SensorData />
        <LedStates />
      </main>
      <Footer />
    </div>
  );
}

export default App;
