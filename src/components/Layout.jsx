import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#F2E1C1] dark:bg-gray-900 transition-colors duration-300">
      {!hideNavbarFooter && <Navbar />}
      <main>
        {/* Main content will go here. Dark mode is active globally. */}
        {children}
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default Layout;