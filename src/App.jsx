import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { decodeToken } from './utils/authService.js';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/RegisterPage';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Services from './pages/Services';
import Contact from './pages/Contact';
import OrderPage from './pages/OrderPage';
import OrderDetails from './pages/OrderDetails.jsx';
import CheckoutButton from './components/CheckoutButton.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ColorPalette from './components/ColorPalette';

import AdminDashboard from './dashboard/AdminDashboard.jsx';
import TailorDashboard from './dashboard/TailorDashboard.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import Settings from './dashboard/Settings';
import UserDashboard from './dashboard/UserDashboard.jsx';

import AdminRoute from './components/AdminRoute.jsx';
import TailorRoute from './components/TailorRoute.jsx';
import CustomerRoute from './components/UserRoute.jsx';  // <-- imported as CustomerRoute

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ScrollToSection = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);
  return null;
};

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isTailor: false,
    role: null,
  });

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = await decodeToken(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setAuthState({
              isAuthenticated: true,
              isAdmin: decodedToken.role === 'admin',
              isTailor: decodedToken.role === 'tailor',
              role: decodedToken.role,
            });
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkToken();
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Layout>
        <ScrollToSection />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/color-palette" element={<ColorPalette />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Order Details */}
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/services/OrderDetails/:orderId" element={<OrderDetails />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute isAuthenticated={authState.isAuthenticated} isAdmin={authState.isAdmin} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Tailor Routes */}
          <Route element={<TailorRoute isAuthenticated={authState.isAuthenticated} isTailor={authState.isTailor} />}>
            <Route path="/tailor" element={<TailorDashboard />} />
          </Route>

          {/* Customer Routes */}
          <Route element={<CustomerRoute isAuthenticated={authState.isAuthenticated} />}>
            <Route path="/user" element={<UserDashboard />} />
          </Route>
        </Routes>

      </Layout>
    </Router>
  );
};

export default App;
