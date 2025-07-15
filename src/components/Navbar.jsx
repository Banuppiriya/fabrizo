import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct import
import {
  Home, LogIn, UserPlus, User, LockOpen,
  Menu, X, ShoppingCart, Info, Mail
} from 'lucide-react';
import logo from '../assets/logo.gif';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token'); // ✅ This was missing
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // ✅ Correct function call
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
          setUserRole(decodedToken.role);
          console.log("Decoded token:", decodedToken);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#services');
    } else {
      const section = document.getElementById('services');
      section?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#contact');
    } else {
      const section = document.getElementById('contact');
      section?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', text: 'Home', icon: <Home size={18} /> },
  ];

  const authenticatedLinks = [
    { to: '/profile', text: 'Profile', icon: <User size={18} /> },
    { to: '/user', text: 'Orders', icon: <ShoppingCart size={18} /> },
    userRole === 'admin' && { to: '/admin', text: 'Admin', icon: <LockOpen size={18} /> },
    userRole === 'tailor' && { to: '/tailor', text: 'Dashboard', icon: <LockOpen size={18} /> },
  ].filter(Boolean);

  const unauthenticatedLinks = [
    { to: '/login', text: 'Login', icon: <LogIn size={18} /> },
    { to: '/register', text: 'Register', icon: <UserPlus size={18} /> },
  ];


  return (
    <nav className="bg-gray-400 p-4 text-[#F2E1C1] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-semibold text-[#F2E1C1]">Fabrizo</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6">
          {userRole === 'admin' ? (
            <li>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-300">
                <LogIn className="rotate-180" size={18} />
                <span>Logout</span>
              </button>
            </li>
          ) : (
            <>
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-300"
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}

              <li>
                <a href="/#services" onClick={handleServicesClick} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-300 cursor-pointer">
                  <Info size={18} />
                  <span>Services</span>
                </a>
              </li>

              <li>
                <a href="/#contact" onClick={handleContactClick} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-300 cursor-pointer">
                  <Mail size={18} />
                  <span>Contact</span>
                </a>
              </li>

              {isAuthenticated ? (
                <>
                  {authenticatedLinks.map(link => (
                    <li key={link.to}>
                      <Link to={link.to} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-300">
                        {link.icon}
                        <span>{link.text}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button onClick={handleLogout} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-300">
                      <LogIn className="rotate-180" size={18} />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                unauthenticatedLinks.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-300">
                      {link.icon}
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))
              )}
              <li><DarkModeToggle /></li>
            </>
          )}
        </ul>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <DarkModeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="ml-4 text-[#F2E1C1]">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-[#3B3F4C] rounded-md">
          <ul className="flex flex-col space-y-4 p-4">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 p-2 text-[#F2E1C1] hover:bg-[#1C1F43] rounded"
                >
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              </li>
            ))}
            <li>
              <a href="/#services" onClick={handleServicesClick} className="flex items-center space-x-2 p-2 text-[#F2E1C1] hover:bg-[#1C1F43] rounded">
                <Info size={18} />
                <span>Services</span>
              </a>
            </li>
            <li>
              <a href="/#contact" onClick={handleContactClick} className="flex items-center space-x-2 p-2 text-[#F2E1C1] hover:bg-[#1C1F43] rounded">
                <Mail size={18} />
                <span>Contact</span>
              </a>
            </li>

            {isAuthenticated ? (
              <>
                {authenticatedLinks.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} onClick={() => setIsOpen(false)} className="flex items-center space-x-2 p-2 text-[#F2E1C1] hover:bg-[#1C1F43] rounded">
                      {link.icon}
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center space-x-2 p-2 text-[#F2E1C1] hover:bg-[#1C1F43] rounded">
                    <LogIn className="rotate-180" size={18} />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              unauthenticatedLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} onClick={() => setIsOpen(false)} className="flex items-center space-x-2 p-2 text-[#F2E1C1] hover:bg-[#1C1F43] rounded">
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
