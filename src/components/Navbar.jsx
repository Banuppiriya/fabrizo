import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active section based on current path
  const [section, setSection] = useState('home');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationBadgeCount = 3; // example count

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Update active section when route changes
    const path = location.pathname.replace('/', '');
    setSection(path || 'home');
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showSection = (name) => {
    setSection(name);
    setMobileMenuOpen(false);
    setNotifOpen(false);
    setUserMenuOpen(false);

    // Navigate to the corresponding route
    navigate(name === 'home' ? '/' : `/${name}`);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <i className="fas fa-cut text-2xl text-indigo-600 mr-3"></i>
            <img
              src="/src/assets/logo.gif"
              alt="Fabrizo Logo"
              className="h-25 w-25 rounded-full mr-2"
            />
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-8">
            {['home', 'services', 'customizer', 'orders'].map((item) => (
              <button
                key={item}
                onClick={() => showSection(item)}
                className={`nav-link text-gray-700 hover:text-indigo-600 transition-colors ${
                  section === item ? 'font-semibold text-indigo-600' : ''
                }`}
              >
                {item.charAt(0).toUpperCase() +
                  item
                    .slice(1)
                    .replace(/customizer/, 'Design Customizer')
                    .replace(/orders/, 'Track Orders')}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Login button - Desktop */}
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition hidden md:inline-block"
            >
              Login
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                aria-label="Notifications"
              >
                <i className="fas fa-bell text-xl"></i>
                {notificationBadgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationBadgeCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 notification">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <NotificationItem
                      icon="check"
                      iconBg="bg-green-100"
                      iconColor="text-green-600"
                      title="Order #12345 Completed"
                      message="Your custom suit is ready for delivery"
                      time="2 minutes ago"
                    />
                    <NotificationItem
                      icon="cut"
                      iconBg="bg-blue-100"
                      iconColor="text-blue-600"
                      title="Tailor Assigned"
                      message="Master John has been assigned to your order"
                      time="1 hour ago"
                    />
                    <NotificationItem
                      icon="credit-card"
                      iconBg="bg-yellow-100"
                      iconColor="text-yellow-600"
                      title="Payment Confirmed"
                      message="$599 payment processed successfully"
                      time="3 hours ago"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
                aria-label="User menu"
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm font-medium">John Doe</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <UserMenuItem label="Profile" onClick={() => showSection('profile')} />
                  <UserMenuItem label=" Measurement" onClick={() => showSection('measurement')} />
                  <UserMenuItem label="My Orders" onClick={() => showSection('orders')} />
                  <div className="border-t border-gray-100"></div>
                  <UserMenuItem label="Admin Panel" onClick={() => showSection('admin')} />
                  <UserMenuItem label="Tailor Dashboard" onClick={() => showSection('tailor')} />
                  <div className="border-t border-gray-100"></div>
                  <UserMenuItem label="Settings" onClick={() => showSection('settings')} />
                  <div className="border-t border-gray-100"></div>  
                  <UserMenuItem label="Logout" onClick={()=> showSection('Logout')} />
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-[#e6d4a6]" 
              aria-label="Open mobile menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {['home', 'services', 'customizer', 'orders'].map((item) => (
              <button
                key={item}
                onClick={() => showSection(item)}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
              >
                {item.charAt(0).toUpperCase() +
                  item
                    .slice(1)
                    .replace(/customizer/, 'Design Customizer')
                    .replace(/orders/, 'Track Orders')}
              </button>
            ))}

            {/* Login button - Mobile */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="block w-full text-left px-3 py-2 text-white bg-indigo-600 rounded mt-2"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const NotificationItem = ({ icon, iconBg, iconColor, title, message, time }) => (
  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
    <div className="flex items-start space-x-3">
      <div className={`${iconBg} rounded-full p-2`}>
        <i className={`fas fa-${icon} ${iconColor}`}></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{message}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  </div>
);

const UserMenuItem = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
    type="button"
  >
    {label}
  </button>
);

export default Navbar;
