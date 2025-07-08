import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../theme'; // Corrected: Removed curly braces for default import

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Set a timer to navigate to the login page after a short delay
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1500); // 1.5 second delay for a smoother user experience

    // Clean up the timer if the component unmounts before the delay finishes
    return () => clearTimeout(timer);
  }, [navigate]); // Dependency array: useEffect runs only when 'navigate' changes (which it won't)

  return (
    <div
      style={{ backgroundColor: theme.colors.background }}
      className="min-h-screen flex items-center justify-center font-['Montserrat']" // Added font family
    >
      <div className="text-center p-6 bg-white rounded-lg shadow-xl">
        <Spinner />
        <h2
          style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
          className="text-2xl font-semibold mt-6" // Increased margin-top
        >
          Logging you out...
        </h2>
        <p style={{ color: theme.colors.textSecondary }} className="text-sm mt-3">
          Please wait while we securely sign you out.
        </p>
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div
      style={{
        borderColor: theme.colors.primary, // Primary color for the spinner border
        borderTopColor: 'transparent',    // Top part transparent for animation
      }}
      className="w-16 h-16 border-4 rounded-full animate-spin" // Larger spinner (w-16 h-16) and thicker border (border-4)
    ></div>
  </div>
);

export default Logout;