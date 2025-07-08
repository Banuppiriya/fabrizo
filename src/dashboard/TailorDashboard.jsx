import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';

const TailorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusOptions = ['inProgress', 'completed', 'delivered'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/tailor'); // ✅ Correct endpoint
        setOrders(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch assigned orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  /**
   * Handles status change for an order.
   * @param {string} orderId - ID of the order.
   * @param {string} status - New status value.
   */
  const handleStatusChange = async (orderId, status) => {
    try {
      // Fix endpoint URL by removing space
      const { data } = await api.patch(`/tailor/${orderId}`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading assigned orders...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Tailor Dashboard</h2>
      <div className="bg-white shadow-md rounded-lg p-8">
        <h3 className="text-2xl font-semibold mb-4">My Assigned Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Customer</th>
                <th className="py-2 px-4 border-b">Service</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b">{order._id}</td>
                  <td className="py-2 px-4 border-b">{order.customer?.username || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{order.service?.title || 'N/A'}</td>
                  <td className="py-2 px-4 border-b capitalize">{order.status}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="rounded-md border-gray-300"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No assigned orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TailorDashboard;
