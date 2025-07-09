import React from 'react';
import { Navigate } from 'react-router-dom';

// Component to protect routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
