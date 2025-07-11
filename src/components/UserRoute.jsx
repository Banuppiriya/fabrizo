import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const CustomerRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated, allow access to nested routes
  return <Outlet />;
};

export default CustomerRoute;
