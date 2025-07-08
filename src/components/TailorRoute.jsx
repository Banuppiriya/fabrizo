import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const TailorRoute = ({ isAuthenticated, isTailor }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return isTailor ? <Outlet /> : <Navigate to="/" replace />;
};

export default TailorRoute; // ✅ Add this line
