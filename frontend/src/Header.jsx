import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const navClass = (path) =>
    location.pathname === path
      ? 'text-white font-semibold underline'
      : 'text-white hover:underline';

  return (
    <header className="bg-blue-600 text-white py-2 shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Air Quality Monitor</h1>
        <nav className="space-x-6 text-base">
          <Link to="/" className={navClass('/')}>Home</Link>
          <Link to="/history" className={navClass('/history')}>History</Link>
        </nav>
      </div>
    </header>

  );
}

export default Header;

