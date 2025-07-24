import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('orderId');
  
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
        
        // Try to get orderId from URL params first, then fallback to session storage
        const paymentOrderId = orderId || sessionStorage.getItem('pending_payment_order');
        
        if (!paymentOrderId) {
          throw new Error('Order ID not found');
        }

        const response = await api.post('/payments/verify', { 
          sessionId,
          orderId: paymentOrderId
        });
        
        setOrderDetails(response.data);
        toast.success('Payment successful! Redirecting to orders...');
        
        // Clear any stored payment data
        sessionStorage.removeItem('pending_payment_order');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/orders');
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
  }, [sessionId, orderId, navigate]);

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
              <div className="mt-6 space-x-4">
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                  Go Home
                </button>
                <button onClick={() => navigate('/orders')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  View Orders
                </button>
              </div>
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
};

export default PaymentSuccess;

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [isVerifying, setIsVerifying] = useState(true);
//   const [error, setError] = useState(null);
//   const [orderDetails, setOrderDetails] = useState(null);
//   const sessionId = searchParams.get('session_id');
  
//   useEffect(() => {
//     if (!sessionId) {
//       toast.error('Invalid payment session');
//       navigate('/');
//       return;
//     }

//     const verifyPayment = async () => {
//       try {
//         setIsVerifying(true);
//         setError(null);
//         const pendingOrderId = sessionStorage.getItem('pending_payment_order');
        
//         const response = await api.post('/payments/verify', { 
//           sessionId,
//           orderId: pendingOrderId
//         });
        
//         setOrderDetails(response.data);
//         toast.success('Payment verified successfully!');
//         sessionStorage.removeItem('pending_payment_order');
        
//         setTimeout(() => {
//           navigate(`/orders/${response.data.orderId}`);
//         }, 3000);
//       } catch (error) {
//         console.error('Payment verification failed:', error);
//         setError(error.response?.data?.message || 'Failed to verify payment');
//         toast.error('Failed to verify payment. Please contact support.');
//       } finally {
//         setIsVerifying(false);
//       }
//     };

//     verifyPayment();
//   }, [sessionId, navigate]);

//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="p-6 text-center">
//           {isVerifying && (
//             <div className="flex flex-col items-center justify-center space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
//               <p className="text-lg font-medium text-gray-600">Verifying your payment...</p>
//             </div>
//           )}
          
//           {error && (
//             <div className="text-red-500">
//               <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h2 className="mt-4 text-lg font-medium">Payment Verification Failed</h2>
//               <p className="mt-2">{error}</p>
//               <button 
//                 onClick={() => navigate('/orders')}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Go to Orders
//               </button>
//             </div>
//           )}
          
//           {!isVerifying && !error && (
//             <div className="flex flex-col items-center space-y-4">
//               <CheckCircle className="h-12 w-12 text-green-500" />
//               <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
//               <p className="text-gray-600">Thank you for your payment. Your order has been confirmed.</p>
//               {orderDetails && (
//                 <div className="w-full text-left bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-medium text-gray-900">Order Details:</h3>
//                   <p className="text-gray-600">Order ID: {orderDetails.orderId}</p>
//                   <p className="text-gray-600">Amount Paid: LKR {orderDetails.amount}</p>
//                 </div>
//               )}
//               <p className="text-sm text-gray-500">
//                 You will be redirected to your order details in a moment...
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;
//   const [orderDetails, setOrderDetails] = useState(null);
//   const sessionId = searchParams.get('session_id');
  
//   // Redirect to home if no session ID
//   useEffect(() => {
//     if (!sessionId) {
//       toast.error('Invalid payment session');
//       navigate('/');
//     }
//   }, [sessionId, navigate]);

//   useEffect(() => {
//     const verifyPayment = async () => {
//       if (!sessionId) return;

//       try {
//         setIsVerifying(true);
//         setError(null);
        
//         // Get the orderId from session storage
//         const pendingOrderId = sessionStorage.getItem('pending_payment_order');
        
//         const response = await api.post('/payments/verify', { 
//           sessionId,
//           orderId: pendingOrderId
//         });
        
//         setOrderDetails(response.data);
//         toast.success('Payment verified successfully!');
        
//         // Clear the pending order from session storage
//         sessionStorage.removeItem('pending_payment_order');
        
//         // Redirect to order details after 3 seconds
//         setTimeout(() => {
//           navigate(`/orders/${response.data.orderId}`);
//         }, 3000);
//       } catch (error) {
//         console.error('Payment verification failed:', error);
//         setError(error.response?.data?.message || 'Failed to verify payment');
//         toast.error('Failed to verify payment. Please contact support.');
//       } finally {
//         setIsVerifying(false);
//       }
//     };

//     verifyPayment();
//   }, [sessionId, navigate]);

//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="p-6 text-center">
//           {isVerifying ? (
//             <div className="flex flex-col items-center justify-center space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
//               <p className="text-lg font-medium text-gray-600">Verifying your payment...</p>
//             </div>
//           ) : error ? (
//             <div className="text-red-500">
//               <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h2 className="mt-4 text-lg font-medium">Payment Verification Failed</h2>
//               <p className="mt-2">{error}</p>
//               <button 
//                 onClick={() => navigate('/orders')}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Go to Orders
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="flex flex-col items-center">
//                 <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
//                 <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
//                 <p className="text-gray-600 mt-2">
//                   Thank you for your payment. Your order has been confirmed.
//                 </p>
//               </div>
//               {orderDetails && (
//                 <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-medium text-gray-900">Order Details:</h3>
//                   <p className="text-gray-600">Order ID: {orderDetails.orderId}</p>
//                   <p className="text-gray-600">Amount Paid: LKR {orderDetails.amount}</p>
//                 </div>
//               )}
//               <p className="text-sm text-gray-500 mt-4">
//                 You will be redirected to your order details in a moment...
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
//           {isVerifying ? (
//             <div className="flex flex-col items-center justify-center space-y-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//               <p className="text-lg font-medium text-gray-600">Verifying your payment...</p>
//             </div>
//           ) : error ? (
//             <div className="text-red-500">
//               <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h2 className="mt-4 text-lg font-medium">Payment Verification Failed</h2>
//               <p className="mt-2">{error}</p>
//               <button 
//                 onClick={() => navigate('/orders')}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Go to Orders
//               </button>
//             </div>
//           ) : (
//                       {!isVerifying && !error && (
//             <div className="space-y-4">
//               <div className="text-center">
//                 <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                   Payment Successful!
//                 </h2>
//               </div>
//               <p className="text-gray-600">Your payment has been processed successfully.</p>
//               {orderDetails && (
//                 <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-medium text-gray-900">Order Details</h3>
//                   <p className="text-gray-600">Order ID: {orderDetails.orderId}</p>
//                   <p className="text-gray-600">Amount Paid: LKR {orderDetails.amount}</p>
//                 </div>
//               )}
//               <p className="text-sm text-gray-500 mt-4">
//                 Redirecting to your order details...
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;
