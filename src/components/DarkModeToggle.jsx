import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  // 1. Initialize state from localStorage, or default to false
  const [darkMode, setDarkMode] = useState(() => {
    // Check if window is defined (for SSR compatibility, though not strictly needed for a client-side component)
    if (typeof window !== 'undefined') {
      // localStorage returns string "true" or "false", or null if not set
      // Convert to boolean. If null/undefined, it defaults to false (light mode)
      return localStorage.getItem('darkMode') === 'true';
    }
    return false; // Default for server-side rendering
  });

  // 2. Effect to apply/remove 'dark' class and update localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark'); // Adds 'dark' class to <html>
    } else {
      document.documentElement.classList.remove('dark'); // Removes 'dark' class from <html>
    }
    // Store the current dark mode preference
    localStorage.setItem('darkMode', darkMode.toString()); // Ensure it's stored as "true" or "false" string
  }, [darkMode]); // Re-run effect whenever darkMode state changes

  // 3. Toggle function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode); // Correctly toggles the state
  };

  // 4. Render button
  return (
    <button
      onClick={toggleDarkMode}
      // Apply Tailwind CSS classes for styling
      className="ml-4 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 transition duration-300 ease-in-out" // Changed bg-gray-800 to 700 for better contrast, added transition
      aria-label="Toggle Dark Mode"
    >
      {/* Button text changes based on current mode */}
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;