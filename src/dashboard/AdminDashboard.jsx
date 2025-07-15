import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../utils/axiosInstance';
import ServiceManager from '../pages/Services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [ordersTotalItems, setOrdersTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePage, setActivePage] = useState('orders');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      switch (activePage) {
        case 'orders':
          res = await api.get('/orders', {
            params: { page: ordersCurrentPage, limit: ITEMS_PER_PAGE },
          });
          setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
          setOrdersTotalItems(res.data.total || 0);
          break;
        case 'users':
          res = await api.get('/user/all');
          setUsers(Array.isArray(res.data) ? res.data : []);
          break;
        case 'tailors':
          res = await api.get('/tailor');
          setTailors(Array.isArray(res.data) ? res.data : []);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(`Failed to fetch ${activePage}.`);
      toast.error(`Failed to fetch ${activePage}.`); // Add toast for API errors
    } finally {
      setLoading(false);
    }
  }, [activePage, ordersCurrentPage]);

  useEffect(() => {
    if (activePage !== 'services') fetchData();
  }, [activePage, fetchData]);

  useEffect(() => {
    const fetchTailorsForAssignment = async () => {
      // Fetch tailors only if we're on the orders tab and tailors data isn't loaded
      if (activePage === 'orders' && (!Array.isArray(tailors) || tailors.length === 0)) {
        try {
          const res = await api.get('/tailor');
          setTailors(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error('Tailor fetch failed:', err);
          toast.error('Failed to load tailors for assignment.');
        }
      }
    };
    fetchTailorsForAssignment();
  }, [activePage, tailors]); // Dependency on 'tailors' to re-fetch if empty

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...data } : o)));
      toast.success('Order status updated successfully!');
    } catch (err) {
      toast.error('Failed to update order status.');
      console.error('Order status update failed:', err);
    }
  };

  const handleAssignTailor = async (order, tailorId) => {
    try {
      // Ensure you're using 'api' instance consistent with your other calls
      await api.put(`/orders/${order._id}/assign-tailor`, {
        tailorId,
        quantity: order.quantity || 1, // Include quantity if your API expects it
      });
      toast.success('Tailor assigned successfully!');
      fetchData(); // Re-fetch data to reflect the change
    } catch (err) {
      toast.error('Failed to assign tailor.');
      console.error('Tailor assignment failed:', err);
    }
  };

  const handleLogout = () => {
    toast.info('Logging out...');
    // Implement actual logout logic here, e.g., clearing tokens
    window.location.href = '/login'; // Redirect to login page
  };

  // Helper function for status badges
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'orders':
        return (
          <>
            <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
              <h3 className="text-3xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
                All Orders
              </h3>
              {loading ? (
                <div className="text-center py-10 text-gray-600">Loading orders...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-600">{error}</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-lg font-medium">No orders found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-md">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Order ID</th>
                        <th className="py-3 px-6 text-left">Customer</th>
                        <th className="py-3 px-6 text-left">Service</th>
                        <th className="py-3 px-6 text-left">Payment Status</th> {/* New Column */}
                        <th className="py-3 px-6 text-left">Order Status</th>
                        <th className="py-3 px-6 text-left">Assigned Tailor</th>
                        <th className="py-3 px-6 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                          <td className="py-3 px-6 whitespace-nowrap">{order._id.substring(0, 8)}...</td> {/* Shorten ID */}
                          <td className="py-3 px-6">{order.user?.username || 'N/A'}</td>
                          <td className="py-3 px-6">{order.service?.name || 'N/A'}</td>
                          <td className="py-3 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.paymentStatus)}`}>
                              {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-6">
                            <select
                              value={order.status}
                              onChange={(e) => handleChangeOrderStatus(order._id, e.target.value)}
                              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                              <option value="pending">Pending</option>
                              <option value="in progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option> {/* Added cancelled status */}
                            </select>
                          </td>
                          <td className="py-3 px-6">
                            <select
                              value={order.tailor?._id || ''}
                              onChange={(e) => handleAssignTailor(order, e.target.value)}
                              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                              <option value="">Unassigned</option>
                              {tailors.map((tailor) => (
                                <option key={tailor._id} value={tailor._id}>
                                  {tailor.username}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-6">
                            {/* You can add more actions here, e.g., View Details button */}
                            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {ordersTotalItems > ITEMS_PER_PAGE && (
              <PaginationControls
                currentPage={ordersCurrentPage}
                totalItems={ordersTotalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setOrdersCurrentPage}
              />
            )}
          </>
        );
      case 'users':
        return (
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100 min-h-[400px] flex flex-col">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
              All Platform Users
            </h3>
            {loading ? (
              <div className="text-center py-10 text-gray-600">Loading users...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-600">{error}</div>
            ) : users.length === 0 ? (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-center py-8 text-gray-500 text-xl font-medium">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user) => (
                    <li key={user._id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out p-5 flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-inner">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-grow">
                        <p className="text-xl font-semibold text-gray-900 truncate">
                          {user.username || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user.email || 'No email provided'}
                        </p>
                        <p className="text-sm font-medium text-purple-700 mt-1 capitalize">
                          Role: {user.role || 'N/A'}
                        </p>
                        {user.orders && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Orders: {user.orders.length > 0 ? user.orders.length : '0'}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 'tailors':
        return (
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100 min-h-[400px] flex flex-col">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
              All Tailors
            </h3>
            {loading ? (
              <div className="text-center py-10 text-gray-600">Loading tailors...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-600">{error}</div>
            ) : tailors.length === 0 ? (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-center py-8 text-gray-500 text-xl font-medium">No tailors found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tailors.map((tailor) => (
                    <li key={tailor._id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out p-5 flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-inner">
                        {tailor.username?.charAt(0).toUpperCase() || 'T'}
                      </div>
                      <div className="flex-grow">
                        <p className="text-xl font-semibold text-gray-900 truncate">
                          {tailor.username || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {tailor.email || 'No email provided'}
                        </p>
                        <p className="text-sm font-medium text-teal-700 mt-1 italic">
                          Specialization: {tailor.specialization || 'N/A'}
                        </p>
                        {/* Assuming tailors also have an 'orders' array */}
                        {tailor.orders && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Assigned Orders: {tailor.orders.length > 0 ? tailor.orders.length : '0'}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 'services':
        return <ServiceManager />;
      default:
        return null;
    }
  };

  const buttonClass = (active) =>
    `block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ease-in-out ${
      active
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between border-r border-gray-200">
        <div>
          <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 tracking-tight">Admin Dashboard</h2>
          <nav className="space-y-3">
            <button onClick={() => setActivePage('orders')} className={buttonClass(activePage === 'orders')}>
              Orders
            </button>
            <button onClick={() => setActivePage('users')} className={buttonClass(activePage === 'users')}>
              Users
            </button>
            <button onClick={() => setActivePage('tailors')} className={buttonClass(activePage === 'tailors')}>
              Tailors
            </button>
            <button onClick={() => setActivePage('services')} className={buttonClass(activePage === 'services')}>
              Services
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 ease-in-out font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {loading && activePage !== 'services' ? ( // Only show loading for data-fetching pages
          <div className="text-center py-20 text-lg font-semibold text-gray-600">Loading data...</div>
        ) : error && activePage !== 'services' ? ( // Only show error for data-fetching pages
          <div className="text-center py-20 text-red-600 font-medium">{error}</div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

const PaginationControls = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null; // Don't show pagination if only one page

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition ${
            currentPage === page
              ? 'bg-indigo-600 text-white shadow-indigo-300/50'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
};

export default AdminDashboard;