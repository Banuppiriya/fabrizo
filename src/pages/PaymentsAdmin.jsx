import React from 'react';
import AdminPayments from '../components/AdminPayments';

const PaymentsAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600 dark:text-blue-300">Admin Payments</h1>
      <AdminPayments />
    </div>
  );
};

export default PaymentsAdmin;
