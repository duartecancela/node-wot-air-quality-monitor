import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Define dynamic class for active link
  const navClass = (path) =>
    location.pathname === path
      ? 'text-white font-semibold underline'
      : 'text-white hover:underline';

  // Handle logout click
  const handleLogout = () => {
    localStorage.removeItem('authenticated'); // Clear session
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="bg-blue-600 text-white py-2 shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Air Quality Monitor</h1>
        <div className="flex items-center gap-6">
          <nav className="space-x-6 text-base">
            <Link to="/" className={navClass('/')}>Home</Link>
            <Link to="/history" className={navClass('/history')}>History</Link>
          </nav>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

