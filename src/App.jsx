import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminPanel from './dashboard/Adminpanel';
import TailorDashboard from './dashboard/TailorDashboard';
import Measurement from './pages/Measurement';
import Customizer from './pages/customizer';
import Order from './pages/Order';
import Profile from './pages/Profile';
import Settings from './dashboard/Settings';
import Logout from './pages/Logout';
import Services from './pages/Services';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/tailor/*" element={<TailorDashboard />} />
          <Route path="/measurement" element={<Measurement />} />
          <Route path="/customizer" element={<Customizer />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings"element={<Settings/>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/services" element={<Services />} />
          {/* Add more routes as needed */}
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
