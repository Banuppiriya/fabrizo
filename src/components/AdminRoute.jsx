// ✅ AdminRoute.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AdminRoute = ({ isAuthenticated, isAdmin }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute; // ✅ Default export
