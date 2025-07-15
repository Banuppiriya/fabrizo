import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { FaSpinner } from 'react-icons/fa';

const CheckoutButton = ({ orderId, email, amount, serviceName }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/payment/create-checkout-session', {
        email,
        amount,
        serviceName,
        orderId,
      });

      if (res.data?.url) {
        window.location.href = res.data.url; // Redirect to Stripe Checkout
      } else {
        alert('No checkout URL received.');
      }
    } catch (err) {
      console.error('Checkout Error:', err);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin mr-2" />
          Processing...
        </>
      ) : (
        'Pay Now'
      )}
    </button>
  );
};

export default CheckoutButton;
