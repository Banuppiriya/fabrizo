import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        setError('Order not found or error loading order.');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center">Loading order...</p>;
  if (error) return <p className="text-red-500 text-center">{error} (ID: {orderId})</p>;
  if (!order) return <p className="text-center">No order data available.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Order ID: {order._id}</h1>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Service:</strong> {order.service?.title || 'Custom Order'}</p>
      <p><strong>Price:</strong> ${order.service?.price?.toFixed(2)}</p>
      <p><strong>Customer:</strong> {order.customer?.username || 'N/A'}</p>
      <p><strong>Tailor:</strong> {order.tailor?.username || 'Not assigned'}</p>
      <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default OrderDetails;