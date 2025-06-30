// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Optional: Show a brief delay or toast message here
    // Redirect to login
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Logging you out...</h2>
        <p className="text-gray-600 text-sm">Please wait while we redirect you to login.</p>
      </div>
    </div>
  );
};

export default Logout;
