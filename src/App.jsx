import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { decodeToken } from './utils/authService.js';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/RegisterPage';
import AdminDashboard from './dashboard/AdminDashboard';
import TailorDashboard from './dashboard/TailorDashboard';
import Profile from './pages/Profile';
import Settings from './dashboard/Settings';
import Logout from './pages/Logout';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminRoute from './components/AdminRoute';
import TailorRoute from './components/TailorRoute'; // ✅ Default import
import ColorPalette from './components/ColorPalette';
import CheckoutButton from './components/CheckoutButton.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import Order from './pages/Order.jsx';

// Separate component to scroll to hash targets
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
  const [authState, setAuthState] = React.useState({
    isAuthenticated: false,
    isAdmin: false,
    isTailor: false,
  });

  React.useEffect(() => {
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
            });
          } else {
            // Token expired – remove it
            localStorage.removeItem('token');
            setAuthState({
              isAuthenticated: false,
              isAdmin: false,
              isTailor: false,
            });
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token'); // Clean up invalid token
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isTailor: false,
          });
        }
      }
    };
    checkToken();
  }, []);


  return (
    <Router>
      <Layout>
        <ScrollToSection />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
           <Route path="/services/Order/:id" element={<OrderDetails />} caseSensitive={false} />
          <Route path="/contact" element={<Contact />} />
        

          {/* Private Routes */}
          {/* <Route element={<PrivateRoute isAuthenticated={authState.isAuthenticated} />}> */}

            <Route path="/Order" element={<Order />} />
            <Route path="/order-details" element={<OrderDetails />} />
            <Route path="/order-details/:id" element={<OrderDetails />} />
            <Route path="/order-details/:id/:section" element={<OrderDetails />} />
            <Route path="/order-details/:id/:section/:subSection" element={<OrderDetails />} />      
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/checkout" element={<CheckoutButton />} />

          {/* </Route> */}

          {/* Admin Routes */}
          <Route element={<AdminRoute isAuthenticated={authState.isAuthenticated} isAdmin={authState.isAdmin} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Tailor Routes */}
          <Route element={<TailorRoute isAuthenticated={authState.isAuthenticated} isTailor={authState.isTailor} />}>
            <Route path="/tailor" element={<TailorDashboard />} />
          </Route>

         
          {/* Color Palette Route */}
          <Route path="/color-palette" element={<ColorPalette />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
