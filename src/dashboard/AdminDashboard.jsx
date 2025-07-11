import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';

// Placeholder components
const ServicesPage = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Services</h2>
    <p>Service management UI coming soon...</p>
  </div>
);

const UsersPage = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Users</h2>
    <p>User management UI coming soon...</p>
  </div>
);

const TailorsPage = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Tailors</h2>
    <p>Tailor management UI coming soon...</p>
  </div>
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePage, setActivePage] = useState('orders');

  useEffect(() => {
    if (activePage === 'orders') {
      const fetchOrders = async () => {
        try {
          const res = await api.get('/orders');
          setOrders(res.data);
          setError('');
        } catch (err) {
          console.error('Failed to fetch orders:', err.response?.data || err.message);
          setError('Failed to fetch orders.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [activePage]);

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}`, { status: newStatus });
      console.log('Order status updated:', res.data);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Error changing order status:', err.response?.data || err.message);
      alert('Failed to update order status.');
    }
  };

  const handleLogout = () => {
    // Clear tokens or session here
    alert('Logged out!');
    window.location.href = '/login'; // Redirect to login
  };

  const renderContent = () => {
    if (activePage === 'orders') {
      if (loading) return <p className="text-center">Loading orders...</p>;
      if (error) return <p className="text-red-500 text-center">{error}</p>;

      return (
        <div>
          <h1 className="text-2xl font-bold mb-4">Orders</h1>
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Tailor</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">{order.customer?.username || 'N/A'}</td>
                  <td className="p-3">{order.tailor?.username || 'Not assigned'}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleChangeOrderStatus(order._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (activePage === 'services') return <ServicesPage />;
    else if (activePage === 'users') return <UsersPage />;
    else if (activePage === 'tailors') return <TailorsPage />;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="flex flex-col flex-grow">
          {['orders', 'services', 'users', 'tailors'].map((page) => (
            <button
              key={page}
              onClick={() => {
                setActivePage(page);
                if (page === 'orders') setLoading(true);
              }}
              className={`p-4 text-left capitalize hover:bg-gray-700 ${
                activePage === page ? 'bg-gray-700' : ''
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow border-b">
          <div
            className="text-lg font-semibold cursor-pointer hover:text-blue-600"
            onClick={() => {
              setActivePage('orders');
              setLoading(true);
            }}
          >
            Home
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-grow p-6 bg-gray-50 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
