import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E1C1] text-[#1C1F43]">
      <CheckCircle className="mb-4 text-green-500" size={64} />
      <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-lg mb-4">Thank you for your order. You will be redirected to the homepage shortly.</p>
    </div>
  );
};

export default PaymentSuccess;
