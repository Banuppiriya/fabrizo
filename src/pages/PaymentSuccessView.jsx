import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../utils/axiosInstance';
import { toast } from 'react-toastify';

function PaymentSuccessView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    if (!sessionId) {
      toast.error('Invalid payment session');
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        setIsVerifying(true);
        setError(null);
        const pendingOrderId = sessionStorage.getItem('pending_payment_order');
        
        const response = await api.post('/payments/verify', { 
          sessionId,
          orderId: pendingOrderId
        });
        
        setOrderDetails(response.data);
        toast.success('Payment verified successfully!');
        sessionStorage.removeItem('pending_payment_order');
        
        setTimeout(() => {
          navigate(`/orders/${response.data.orderId}`);
        }, 3000);
      } catch (error) {
        console.error('Payment verification failed:', error);
        setError(error.response?.data?.message || 'Failed to verify payment');
        toast.error('Failed to verify payment. Please contact support.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className="text-lg font-medium text-gray-600">Verifying your payment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="text-red-500">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="mt-4 text-lg font-medium">Payment Verification Failed</h2>
              <p className="mt-2">{error}</p>
              <button onClick={() => navigate('/orders')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Go to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600">Thank you for your payment. Your order has been confirmed.</p>
            {orderDetails && (
              <div className="w-full text-left bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Order Details:</h3>
                <p className="text-gray-600">Order ID: {orderDetails.orderId}</p>
                <p className="text-gray-600">Amount Paid: LKR {orderDetails.amount}</p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              You will be redirected to your order details in a moment...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessView;
