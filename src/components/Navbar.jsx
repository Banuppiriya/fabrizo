import React, { useState, useEffect } from 'react';
import ProfileModal from './ProfileModal';
import NavbarProfileContent from './NavbarProfileContent';
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
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Restore navLinks and authenticated/unauthenticated links
  const navLinks = [
    { to: '/', text: 'Home', icon: <Home size={18} /> },
    { to: '/services', text: 'Services', icon: <Info size={18} /> },
    // Only show Contact link if not tailor
    ...(userRole !== 'tailor' ? [{ to: '/contact', text: 'Contact', icon: <Mail size={18} /> }] : []),
  ];

  const authenticatedLinks = [
    { to: '/user', text: 'Orders', icon: <ShoppingCart size={18} /> },
    userRole === 'admin' && { to: '/admin', text: 'Admin', icon: <LockOpen size={18} /> },
    userRole === 'tailor' && { to: '/tailor', text: 'Dashboard', icon: <LockOpen size={18} /> },
  ].filter(Boolean);

  const unauthenticatedLinks = [
    { to: '/login', text: 'Login', icon: <LogIn size={18} /> },
    { to: '/register', text: 'Register', icon: <UserPlus size={18} /> },
  ];

  // Only show Login button if not authenticated
  const loginButton = { to: '/login', text: 'Login', icon: <LogIn size={18} /> };

  useEffect(() => {
    const updateProfilePicture = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          setProfilePicture(userObj.profilePicture || null);
        } catch {}
      } else {
        setProfilePicture(null);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
          setUserRole(decodedToken.role);
          updateProfilePicture();
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserRole(null);
          setProfilePicture(null);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        setProfilePicture(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setProfilePicture(null);
    }

    // Listen for profilePictureUpdated event and force re-render
    const rerender = () => {
      updateProfilePicture();
      setProfilePicture(prev => prev); // Force state update
    };
    window.addEventListener('profilePictureUpdated', rerender);
    return () => {
      window.removeEventListener('profilePictureUpdated', rerender);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login'); // Always redirect to login page after logout
  };

  // Removed custom handlers for services/contact; use Link routing instead

  // Sidebar links removed; only popup modal for profile actions


  // Callback to update profile picture from modal
  const handleProfilePictureUpdate = (newUrl) => {
    setProfilePicture(newUrl);
    // Also update localStorage user object for consistency
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.profilePicture = newUrl;
        localStorage.setItem('user', JSON.stringify(userObj));
      } catch {}
    }
  };

  return (
    <nav className="bg-gray-600 p-4 text-[#F2E1C1] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-semibold text-[#F2E1C1] transition-colors group-hover:text-white">Fabrizo</span>
        </Link>
        {/* Only show logout for admin */}
        <ul className="hidden md:flex items-center space-x-6">
          {userRole === 'admin' ? (
            <li>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-200 bg-gray-800 px-4 py-2 rounded-md font-semibold">
                <LogIn className="rotate-180" size={18} />
                <span>Logout</span>
              </button>
            </li>
          ) : (
            <>
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-200 px-4 py-2 rounded-md font-semibold group">
                    {link.icon}
                    <span className="transition-colors group-hover:text-yellow-400">{link.text}</span>
                  </Link>
                </li>
              ))}
              {/* Show Login button only if not authenticated */}
              {!isAuthenticated && (
                <li>
                  <Link to={loginButton.to} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-200 px-4 py-2 rounded-md font-semibold group">
                    {loginButton.icon}
                    <span className="transition-colors group-hover:text-yellow-400">{loginButton.text}</span>
                  </Link>
                </li>
              )}
              {isAuthenticated && authenticatedLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-200 px-4 py-2 rounded-md font-semibold group">
                    {link.icon}
                    <span className="transition-colors group-hover:text-yellow-400">{link.text}</span>
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <>
                  <li>
                    <button onClick={handleLogout} className="flex items-center space-x-1 text-[#F2E1C1] hover:text-gray-200 bg-gray-800 px-4 py-2 rounded-md font-semibold group">
                      <LogIn className="rotate-180" size={18} />
                      <span className="transition-colors group-hover:text-yellow-400">Logout</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setProfileModalOpen(true)}
                      className="h-8 w-8 rounded-full border-2 border-[#F2E1C1] flex items-center justify-center overflow-hidden bg-[#F2E1C1] text-[#1C1F43] font-bold shadow"
                      title="View Profile"
                    >
                      {profilePicture ? (
                        <img
                          src={profilePicture.startsWith('blob:')
                            ? profilePicture
                            : profilePicture.startsWith('http')
                              ? profilePicture
                              : `http://localhost:5000${profilePicture}`}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User size={22} />
                      )}
                    </button>
                  </li>
                </>
              )}
              <li><DarkModeToggle /></li>
            </>
          )}
        </ul>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          {userRole === 'admin' && (
                <button onClick={handleLogout} className="ml-4 text-[#F2E1C1] hover:text-gray-200 flex items-center group">
              <LogIn className="rotate-180" size={24} />
              <span className="ml-2 transition-colors group-hover:text-yellow-400">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-gray-200 rounded-md">
          <ul className="flex flex-col space-y-4 p-4">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 p-2 text-[#F2E1C1] hover:text-gray-200 hover:bg-gray-200 rounded group"
                >
                  {link.icon}
                  <span className="transition-colors group-hover:text-yellow-400">{link.text}</span>
                </Link>
              </li>
            ))}
            {isAuthenticated && authenticatedLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => setIsOpen(false)} className="flex items-center space-x-2 p-2 text-[#F2E1C1] hover:text-gray-200 hover:bg-gray-200 rounded group">
                  {link.icon}
                  <span className="transition-colors group-hover:text-yellow-400">{link.text}</span>
                </Link>
              </li>
            ))}
            {!isAuthenticated && unauthenticatedLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => setIsOpen(false)} className="flex items-center space-x-2 p-2 text-[#F2E1C1] hover:text-gray-200 hover:bg-gray-200 rounded group">
                  {link.icon}
                  <span className="transition-colors group-hover:text-yellow-400">{link.text}</span>
                </Link>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center space-x-2 p-2 text-[#F2E1C1] hover:text-gray-200 hover:bg-gray-200 rounded group">
                  <LogIn className="rotate-180" size={18} />
                  <span className="transition-colors group-hover:text-yellow-400">Logout</span>
                </button>
              </li>
            )}
            {/* Profile avatar button for modal (mobile) */}
            {isAuthenticated && (
              <li>
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-gray-200 text-[#1C1F43] font-bold shadow flex items-center justify-center mt-2 overflow-hidden"
                  title="View Profile"
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture.startsWith('http') ? profilePicture : `http://localhost:5000${profilePicture}`}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User size={22} />
                  )}
                </button>
              </li>
            )}
            <li><DarkModeToggle /></li>
          </ul>
        </div>
      )}
      {/* ProfileModal integration */}
      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)}>
        <NavbarProfileContent onProfilePictureUpdate={handleProfilePictureUpdate} />
      </ProfileModal>
    </nav>
  );
};
    
    export default Navbar;
