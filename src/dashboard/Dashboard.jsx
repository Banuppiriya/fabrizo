import React from 'react';
import theme from '/src/theme.js';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import TailorDashboard from './TailorDashboard';
import CustomerDashboard from './UserDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        navigate('/admin');
      case 'tailor':
        navigate('/tailor');
      default:
        navigate('/');
    }
  };

  return (
    <div style={{ backgroundColor: theme.colors.background }} className="min-h-screen">
      <header style={{ backgroundColor: theme.colors.white, borderBottom: `1px solid ${theme.colors.border}` }} className="p-4 flex justify-between items-center">
        <h1 style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }} className="text-2xl font-bold">
          Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUser style={{ color: theme.colors.textSecondary }} />
            <span style={{ color: theme.colors.text }}>{user.username}</span>
          </div>
          <button onClick={handleLogout} style={{ color: theme.colors.error }} className="flex items-center space-x-1 hover:underline">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>
      <main className="p-6">
        {renderDashboardContent()}
      </main>
    </div>
  );
};

export default Dashboard;
