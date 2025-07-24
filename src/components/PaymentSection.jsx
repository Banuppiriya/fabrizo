import React from 'react';
import { toast } from 'react-toastify';
import api from '../utils/axiosInstance';

const PaymentSection = ({ order }) => {
  const handleInitialPayment = async () => {
    try {
      const response = await api.post('/payment/initial', {
        orderId: order._id
      });
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  const handleFinalPayment = async () => {
    try {
      const response = await api.post('/payment/final', {
        orderId: order._id
      });
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Failed to initiate final payment. Please try again.');
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'initial_paid':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  const calculateAmounts = () => {
    const total = order.totalAmount;
    const initial = total * 0.5;
    const remaining = total - (order.paidAmount || 0);
    return { total, initial, remaining };
  };

  const { total, initial, remaining } = calculateAmounts();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="text-gray-600">Initial Payment (50%):</span>
          <span className="font-semibold">${initial.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="text-gray-600">Remaining Amount:</span>
          <span className="font-semibold">${remaining.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="text-gray-600">Payment Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus === 'completed' 
              ? 'Fully Paid' 
              : order.paymentStatus === 'initial_paid' 
                ? 'Initial Payment Made' 
                : 'Payment Pending'}
          </span>
        </div>

        {/* Payment Actions */}
        <div className="mt-6 space-y-3">
          {order.paymentStatus === 'pending' && (
            <button
              onClick={handleInitialPayment}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 
                       transition-colors duration-200 flex justify-center items-center space-x-2"
            >
              <span>Make Initial Payment (50%)</span>
            </button>
          )}

          {order.paymentStatus === 'initial_paid' && order.status === 'completed' && (
            <button
              onClick={handleFinalPayment}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 
                       transition-colors duration-200 flex justify-center items-center space-x-2"
            >
              <span>Make Final Payment (50%)</span>
            </button>
          )}

          {order.paymentStatus === 'completed' && (
            <div className="text-center p-3 bg-green-50 text-green-600 rounded-md">
              ✓ Order fully paid
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
