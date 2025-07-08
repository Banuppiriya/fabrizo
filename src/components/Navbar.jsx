// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Home, LogIn, UserPlus, User, LockOpen, Menu, X, ShoppingCart, Info, Mail } from 'lucide-react';
import logo from '../assets/logo.gif';
import DarkModeToggle from './DarkModeToggle'; // Assuming this component exists and handles dark mode

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
        userRole = decodedToken.role;
      }
    } catch (error) {
      console.error('Invalid token:', error);
      // Optionally clear token if invalid to prevent persistent issues
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#services'); // Navigate to home and then scroll
    } else {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false); // Close mobile menu after click
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#contact'); // Navigate to home and then scroll
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false); // Close mobile menu after click
  };

  // Define navigation links for all users
  const navLinks = [
    { to: '/', text: 'Home', icon: <Home size={18} /> },
    // Removed direct contact link here, as it's handled by handleContactClick to scroll
  ];

  // Define links visible only when authenticated, filtered by role
  const authenticatedLinks = [
    { to: '/profile', text: 'Profile', icon: <User size={18} /> },
    { to: '/orders', text: 'Orders', icon: <ShoppingCart size={18} /> },
    userRole === 'admin' && { to: '/admin', text: 'Admin', icon: <LockOpen size={18} /> },
    userRole === 'tailor' && { to: '/tailor', text: 'Dashboard', icon: <LockOpen size={18} /> },
  ].filter(Boolean); // .filter(Boolean) removes any false/null values from the array

  // Define links visible only when unauthenticated
  const unauthenticatedLinks = [
    { to: '/login', text: 'Login', icon: <LogIn size={18} /> },
    { to: '/register', text: 'Register', icon: <UserPlus size={18} /> },
  ];

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg sticky top-0 z-50"> {/* Changed bg-gray-300 to bg-gray-800 for better contrast against white text */}
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-semibold text-white">Fabrizo</span> {/* Ensured text-white for logo name */}
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <li key={link.to}>
              {/* Using Link for internal routes */}
              <Link
                to={link.to}
                onClick={link.onClick ? link.onClick : () => setIsOpen(false)}
                className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors"
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            </li>
          ))}
          {/* Services link - scrolls to section */}
          <li>
            <a href="/#services" onClick={handleServicesClick} className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors cursor-pointer">
              <Info size={18} />
              <span>Services</span>
            </a>
          </li>
          {/* Contact link - scrolls to section */}
          <li>
            <a href="/#contact" onClick={handleContactClick} className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors cursor-pointer">
              <Mail size={18} />
              <span>Contact</span>
            </a>
          </li>
          
          {isAuthenticated ? (
            <>
              {authenticatedLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors">
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors">
                  <LogIn className="rotate-180" size={18} /> {/* Rotated for logout icon */}
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            unauthenticatedLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors">
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              </li>
            ))
          )}
          <li>
             {/* DarkModeToggle should ideally handle its own styling based on the global theme context */}
            <DarkModeToggle /> 
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <DarkModeToggle /> {/* Place DarkModeToggle near mobile menu button for small screens */}
          <button onClick={() => setIsOpen(!isOpen)} className="ml-4 text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-gray-700 rounded-md"> {/* Slightly darker background for mobile menu */}
          <ul className="flex flex-col space-y-4 p-4"> {/* Added padding to mobile menu list */}
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={link.onClick ? link.onClick : () => setIsOpen(false)}
                  className="flex items-center space-x-2 p-2 text-white hover:bg-gray-600 rounded"
                >
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              </li>
            ))}
            <li>
              <a href="/#services" onClick={handleServicesClick} className="flex items-center space-x-2 p-2 text-white hover:bg-gray-600 rounded">
                <Info size={18} />
                <span>Services</span>
              </a>
            </li>
            <li>
              <a href="/#contact" onClick={handleContactClick} className="flex items-center space-x-2 p-2 text-white hover:bg-gray-600 rounded">
                <Mail size={18} />
                <span>Contact</span>
              </a>
            </li>
            {isAuthenticated ? (
              <>
                {authenticatedLinks.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} onClick={() => setIsOpen(false)} className="flex items-center space-x-2 p-2 text-white hover:bg-gray-600 rounded">
                      {link.icon}
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center space-x-2 p-2 text-white hover:bg-gray-600 rounded">
                    <LogIn className="rotate-180" size={18} />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              unauthenticatedLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} onClick={() => setIsOpen(false)} className="flex items-center space-x-2 p-2 text-white hover:bg-gray-600 rounded">
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;