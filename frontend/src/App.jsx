import React from 'react';
import Header from './Header';
import Footer from './Footer';

function App() {
  return (
    <div>
      <Header />
      <main style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Hello World from React + Vite!</h1>
      </main>
      <div className="bg-blue-100 p-6 text-center">
      <h1 className="text-3xl font-bold text-blue-800">Tailwind is working!</h1>
    </div>
      <Footer />
    </div>
  );
}

export default App;