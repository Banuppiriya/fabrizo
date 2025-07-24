import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { decodeToken } from './utils/authService.js';

// Admin Components
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const AdminServices = React.lazy(() => import('./components/admin/AdminServices'));
const AdminOrders = React.lazy(() => import('./components/admin/AdminOrders'));
import BlogPreview from './components/BlogPreview.jsx';
import BlogAdmin from './pages/BlogAdmin.jsx';
import PaymentsAdmin from './pages/PaymentsAdmin.jsx';
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
import About from './components/About.jsx';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PaymentSuccess from './pages/PaymentSuccessView.jsx';
import BlogArticle from './pages/BlogArticle.jsx';
import TailorDashboard from './dashboard/TailorDashboard.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import Settings from './dashboard/Settings';
import UserDashboard from './dashboard/UserDashboard.jsx';
import RoleRedirector from './components/RoleRedirector'; // path depends on your project structure


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


const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin User Management Component
const AdminUsers = React.lazy(() => import('./components/admin/UsersList'));

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isTailor: false,
    role: null,
    user: null,
  });

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = decodeToken(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken && decodedToken.exp > currentTime) {
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
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <RoleRedirector authState={authState} />
        <Layout>
          <ScrollToSection />
          <Suspense fallback={<div>Loading...</div>}>
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
              <Route path="/about" element={<About />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="blog" element={<BlogAdmin />} />
                <Route path="payments" element={<PaymentsAdmin />} />
              </Route>

              {/* Blog preview and dynamic route */}
              <Route path="/blog" element={<BlogPreview />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />

              {/* Order Details */}
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/services/OrderDetails/:orderId" element={<OrderDetails />} />

              {/* Admin Routes */}
              <Route element={<AdminRoute isAuthenticated={authState.isAuthenticated} isAdmin={authState.isAdmin} />}>
                <Route 
                  path="/admin" 
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <AdminLayout />
                    </Suspense>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route 
                    path="dashboard" 
                    element={
                      <Suspense fallback={<div>Loading dashboard...</div>}>
                        <AdminDashboard />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="services" 
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <AdminServices />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="orders" 
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <AdminOrders />
                      </Suspense>
                    } 
                  />
                  <Route path="blog" element={<BlogAdmin />} />
                  <Route path="payments" element={<PaymentsAdmin />} />
                </Route>
              </Route>
              <Route element={<AdminRoute isAuthenticated={authState.isAuthenticated} isAdmin={authState.isAdmin} />}>
                <Route 
                  path="/admin" 
                  element={
                    <Suspense fallback={<div>Loading Admin Dashboard...</div>}>
                      <AdminDashboard />
                    </Suspense>
                  } 
                />
                <Route path="/admin/payments" element={<PaymentsAdmin />} />
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
          </Suspense>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
