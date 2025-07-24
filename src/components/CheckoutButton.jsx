import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { FaSpinner } from 'react-icons/fa';

const CheckoutButton = ({ orderId, email, amount, serviceName }) => {
  const [loading, setLoading] = useState(false);
  const initialAmount = amount * 0.5; // Calculate 50% of the total amount
  
  // Format amount in LKR
  const formatLKR = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      console.log('Checking order status for orderId:', orderId);
      
      // Check order status first
      const statusRes = await axios.get(`/payments/status/${orderId}`);
      console.log('Order status:', statusRes.data);

      if (statusRes.data.paymentStatus !== 'pending') {
        const message = statusRes.data.paymentStatus === 'initial_paid'
          ? 'Initial payment has already been completed. Please wait for the tailor to complete your order.'
          : 'Order is not in the correct state for initial payment.';
        alert(message);
        setLoading(false);
        return;
      }
      
      // Proceed with payment
      const res = await axios.post('/payments/initial', {
        orderId
      });

      if (!res.data || !res.data.url) {
        throw new Error('Invalid response: No checkout URL received');
      }
      
      // Store the orderId in session storage before redirecting
      sessionStorage.setItem('pending_payment_order', orderId);
      
      // Redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Checkout Error:', err);
      const errorMessage = err.response?.data?.details || err.response?.data?.message || err.message || 'Failed to initiate payment';
      console.error('Error details:', { error: err, message: errorMessage });
      
      // Show a more user-friendly error message
      alert(`Unable to process payment: ${errorMessage}. Please try again or contact support if the problem persists.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full flex flex-col justify-center items-center bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 min-h-[90px] ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          Processing...
        </>
      ) : (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-100 mb-1">Service Total: {formatLKR(amount)}</div>
          <div className="text-2xl font-bold mb-1">
            initialAmount {formatLKR(initialAmount)}
          </div>
          <div className="text-sm font-medium text-yellow-200">
            50% initialAmount
            
          </div>
        </div>
      )}
    </button>
  );
};

export default CheckoutButton;
