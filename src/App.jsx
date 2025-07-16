import BlogPreview from './components/BlogPreview.jsx';
import BlogAdmin from './pages/BlogAdmin.jsx';
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


import PaymentSuccess from './pages/PaymentSuccess.jsx';
import BlogArticle from './pages/BlogArticle.jsx';
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
  const [authState, setAuthState] = useState(() => {
    // On initial load, try to rehydrate from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const decodedToken = JSON.parse(user); // user info is stringified
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          return {
            isAuthenticated: true,
            isAdmin: decodedToken.role === 'admin',
            isTailor: decodedToken.role === 'tailor',
            role: decodedToken.role,
            user: decodedToken,
          };
        }
      } catch (e) {
        // fallback to unauthenticated
      }
    }
    return {
      isAuthenticated: false,
      isAdmin: false,
      isTailor: false,
      role: null,
      user: null,
    };
  });

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = await decodeToken(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            // Save user info in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(decodedToken));
            setAuthState({
              isAuthenticated: true,
              isAdmin: decodedToken.role === 'admin',
              isTailor: decodedToken.role === 'tailor',
              role: decodedToken.role,
              user: decodedToken,
            });
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setAuthState({
              isAuthenticated: false,
              isAdmin: false,
              isTailor: false,
              role: null,
              user: null,
            });
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isTailor: false,
            role: null,
            user: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isTailor: false,
          role: null,
          user: null,
        });
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* Blog admin, preview, and dynamic route */}
          <Route path="/admin/blog" element={<BlogAdmin />} />
          <Route path="/blog" element={<BlogPreview />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />

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
