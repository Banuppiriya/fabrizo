// src/pages/Order.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await api.get('/order');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSendPaymentRequest = async (orderId) => {
    try {
      await api.post(`/order/${orderId}/send-payment-request`);
      alert('Payment request sent!');
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Error sending payment request.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/order/${orderId}/admin-status`, { status: newStatus });
      alert('Status updated!');
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-auto rounded shadow-sm border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Order ID</th>
                <th className="p-3 text-left text-sm font-semibold">Customer</th>
                <th className="p-3 text-left text-sm font-semibold">Tailor</th>
                <th className="p-3 text-left text-sm font-semibold">Service</th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">Payment</th>
                <th className="p-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm">{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-3 text-sm">{order.customer?.username}</td>
                  <td className="p-3 text-sm">{order.tailor?.username || '—'}</td>
                  <td className="p-3 text-sm">{order.service?.title} (${order.service?.price})</td>
                  <td className="p-3 text-sm capitalize">{order.status}</td>
                  <td className="p-3 text-sm capitalize">{order.paymentStatus}</td>
                  <td className="p-3 text-sm space-x-2">
                    {!order.paymentRequestSent && (
                      <button
                        onClick={() => handleSendPaymentRequest(order._id)}
                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Request Payment
                      </button>
                    )}
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="inProgress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Order;
