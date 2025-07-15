import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance'; // Ensure this path is correct

const TailorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Define status options with more user-friendly labels if needed,
  // but keeping them as is to match backend if 'inProgress' etc. are exact
  const statusOptions = ['pending', 'inProgress', 'completed', 'delivered', 'cancelled']; // Added 'pending' and 'cancelled' for completeness

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/tailor/me/orders'); // Tailor's assigned orders
        setOrders(data);
        setError('');
      } catch (err) {
        // More specific error message for network/API issues
        setError(err.response?.data?.message || 'Could not load your assigned orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // Empty dependency array means this runs once on component mount

  /**
   * Handles status change for an order.
   * Updates the order status on the backend and refreshes local state.
   * @param {string} orderId - ID of the order to update.
   * @param {string} newStatus - The new status value (e.g., 'inProgress', 'completed').
   */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Corrected endpoint: Patching a specific order by ID
      const { data } = await api.patch(`/tailor/orders/${orderId}`, { status: newStatus });

      // Update the local state with the updated order from the response
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? data.order : order // Assuming API returns the updated order as data.order
        )
      );
      setError(''); // Clear any previous errors on successful update
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (err) {
      // Provide user-friendly feedback on failure
      setError(err.response?.data?.message || 'Failed to update order status. Please check your connection.');
      console.error(`Error updating order ${orderId}:`, err);
    }
  };

  // --- Loading, Error, and Empty States with better UI ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading assigned orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 py-10">
        <div className="text-center text-red-700 text-lg p-6 bg-white rounded-lg shadow-md border border-red-300">
          <p className="font-bold mb-2">Error!</p>
          <p>{error}</p>
          <button
            onClick={() => { /* Consider adding a retry mechanism or navigation */ window.location.reload(); }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen"> {/* Responsive padding and background */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center leading-tight">
        Your Tailor Dashboard
      </h2>

      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 border border-gray-200"> {/* Enhanced card styling */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          My Assigned Orders
        </h3>

        {/* Table Container for Responsiveness */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Current Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Update Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500 text-lg font-medium">
                    <p className="mb-2">No assigned orders found.</p>
                    <p className="text-sm">You'll see new orders here once they are assigned to you.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-mono text-gray-700">
                      {order._id.slice(-8).toUpperCase()} {/* Display last 8 chars for brevity */}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                      {order.customer?.username || 'N/A'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                      {order.service?.title || 'N/A'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800' // Default/cancelled
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="block w-full pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none leading-tight"
                        // Added custom arrow for select
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25rem' }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TailorDashboard;