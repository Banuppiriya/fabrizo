import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/axiosInstance';
import ServiceManager from '../pages/Services';
import SidebarPaymentsWidget from '../components/SidebarPaymentsWidget';
import AdminPayments from '../components/AdminPayments.jsx';
import NewsletterSubscribers from '../components/NewsletterSubscribers';

const ITEMS_PER_PAGE = 10;

// Define the component
const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');
  const [users, setUsers] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePage, setActivePage] = useState('orders');

  // Your existing code here...

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-xl">
        <nav>
          <button onClick={() => setActivePage('orders')}>Orders</button>
          <button onClick={() => setActivePage('users')}>Users</button>
          <button onClick={() => setActivePage('tailors')}>Tailors</button>
          <button onClick={() => setActivePage('services')}>Services</button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h1>Admin Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            {/* Your existing render logic here */}
            <p>Content for: {activePage}</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Export the component
export default AdminDashboard;
