import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { FaSpinner } from 'react-icons/fa';

const FinalPaymentButton = ({ orderId, email, amount, serviceName }) => {
  const [loading, setLoading] = useState(false);

  const handleFinalPayment = async () => {
    setLoading(true);
    try {
      console.log('Checking order status for final payment:', orderId);
      
      // Check order status first
      const statusRes = await axios.get(`/payments/status/${orderId}`);
      console.log('Order status:', statusRes.data);

      if (statusRes.data.paymentStatus !== 'initial_paid' || statusRes.data.status !== 'completed') {
        const message = statusRes.data.paymentStatus !== 'initial_paid'
          ? 'Initial payment must be completed first.'
          : 'Order must be completed by the tailor before making the final payment.';
        alert(message);
        setLoading(false);
        return;
      }
      
      // Proceed with final payment
      const res = await axios.post('/payments/final', {
        orderId
      });

      if (res.data?.url) {
        window.location.href = res.data.url; // Redirect to Stripe Checkout
      } else {
        console.error('Invalid response:', res.data);
        alert('No checkout URL received.');
      }
    } catch (err) {
      console.error('Final Payment Error:', err);
      console.error('Error details:', err.response?.data);
      alert(`Payment Error: ${err.response?.data?.message || 'Failed to initiate final payment'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFinalPayment}
      disabled={loading}
      className={`w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          Processing Final Payment...
        </>
      ) : (
        'Pay Remaining Amount'
      )}
    </button>
  );
};

export default FinalPaymentButton;
