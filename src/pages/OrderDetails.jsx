import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/axiosInstance';
import OrderPayment from '../components/OrderPayment';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Loading order...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-red-600">{error} (ID: {orderId})</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Order not found</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold">{order._id}</span>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold">{order.service?.name || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold ${
                order.status === 'completed' ? 'text-green-600' :
                order.status === 'processing' ? 'text-blue-600' :
                'text-yellow-600'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-gray-600">Created:</span>
              <span className="font-semibold">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <OrderPayment 
          order={order} 
          onPaymentComplete={() => {
            // Refresh order details after payment
            api.get(`/orders/${orderId}`)
              .then(res => setOrder(res.data))
              .catch(err => toast.error('Failed to refresh order details'));
          }} 
        />
      </div>
    </div>
  );
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