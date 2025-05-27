import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SensorData from './SensorData';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <SensorData />
      </main>
      <Footer />
    </div>
  );
}

export default App;
