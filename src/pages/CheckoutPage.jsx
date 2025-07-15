import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutButton from '../components/CheckoutButton';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 font-bold">No order details found. Please place an order first.</p>
        <button onClick={() => navigate('/order')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go to Order Page</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E1C1]">
      <h2 className="text-2xl font-bold mb-6 text-[#1C1F43]">Complete Your Payment</h2>
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <p className="mb-2 font-semibold">Order ID: <span className="font-mono">{order._id}</span></p>
        <p className="mb-2">Service: <span className="font-semibold">{order.service?.title}</span></p>
        <p className="mb-2">Amount: <span className="font-semibold">{order.totalPrice}</span></p>
        <p className="mb-6">Email: <span className="font-mono">{order.customerEmail}</span></p>
        <CheckoutButton 
          orderId={order._id}
          email={order.customerEmail}
          amount={order.totalPrice}
          serviceName={order.service?.title}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
