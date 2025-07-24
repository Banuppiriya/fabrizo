import React from 'react';
import { toast } from 'react-toastify';
import api from '../utils/axiosInstance';

const OrderPayment = ({ order }) => {
  const handleInitialPayment = async () => {
    try {
      const response = await api.post('/payment/initial', {
        orderId: order._id
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Failed to initiate payment. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const handleFinalPayment = async () => {
    try {
      const response = await api.post('/payment/final', {
        orderId: order._id
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Failed to initiate final payment. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const renderPaymentStatus = () => {
    const totalAmount = order.totalAmount;
    const initialAmount = totalAmount * 0.5;
    const remainingAmount = order.remainingAmount;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold">${totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Initial Payment (50%):</span>
            <span className="font-semibold">${initialAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Remaining Amount:</span>
            <span className="font-semibold">${remainingAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className={`font-semibold ${
              order.paymentStatus === 'completed' 
                ? 'text-green-600' 
                : order.paymentStatus === 'initial_paid' 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
            }`}>
              {order.paymentStatus === 'completed' 
                ? 'Fully Paid' 
                : order.paymentStatus === 'initial_paid' 
                  ? 'Initial Payment Made' 
                  : 'Payment Pending'}
            </span>
          </div>
        </div>

        <div className="mt-6">
          {order.paymentStatus === 'pending' && (
            <button
              onClick={handleInitialPayment}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Make Initial Payment
            </button>
          )}

          {order.paymentStatus === 'initial_paid' && order.status === 'completed' && (
            <button
              onClick={handleFinalPayment}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Make Final Payment
            </button>
          )}

          {order.paymentStatus === 'completed' && (
            <div className="text-center text-green-600 font-semibold">
              Order fully paid ✓
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderPaymentStatus();
};

export default OrderPayment;
