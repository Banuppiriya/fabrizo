import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const AdminPayments = ({ payments = [], loading = false, error = null }) => {
  const { state } = useLocation();
  const selectedPaymentId = state?.selectedPaymentId;

  useEffect(() => {
    if (selectedPaymentId) {
      const element = document.getElementById(`payment-${selectedPaymentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('bg-gray-50');
        setTimeout(() => element.classList.remove('bg-gray-100'), 2000);
      }
    }
  }, [selectedPaymentId, payments]);

  if (loading) return <div className="text-center py-8 text-lg font-semibold text-gray-600 dark:text-gray-300">Loading payments...</div>;
  if (error) return <div className="text-center py-8 text-red-600 dark:text-red-400 font-medium">
    Error loading payments: {typeof error === 'string' ? error : JSON.stringify(error)}
  </div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Customer Payments</h2>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">No payments found.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Currency</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Paid At (Date)</th>
                <th className="px-4 py-2 border">Paid At (Time)</th>
                <th className="px-4 py-2 border">Order Details</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => {
                const paidDate = payment.paidAt ? new Date(payment.paidAt) : null;
                return (
                  <tr 
                    key={payment._id} 
                    id={`payment-${payment._id}`}
                    className={`border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300
                      ${selectedPaymentId === payment._id ? 'bg-indigo-50' : ''}`}
                  >
                    <td className="px-4 py-2 border whitespace-nowrap">{payment.user?.name || 'N/A'}</td>
                    <td className="px-4 py-2 border whitespace-nowrap">{payment.user?.username || 'N/A'}</td>
                    <td className="px-4 py-2 border">{payment.user?.email || payment.customerEmail || payment.order?.customerEmail || 'N/A'}</td>
                    <td className="px-4 py-2 border">{payment.customerPhone || payment.order?.customerPhone || 'N/A'}</td>
                    <td className="px-4 py-2 border">{payment.order?._id || 'N/A'}</td>
                    <td className="px-4 py-2 border">{payment.amount}</td>
                    <td className="px-4 py-2 border">{payment.currency?.toUpperCase() || 'N/A'}</td>
                    <td className="px-4 py-2 border">{payment.status || 'N/A'}</td>
                    <td className="px-4 py-2 border">{paidDate ? paidDate.toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-2 border">{paidDate ? paidDate.toLocaleTimeString() : 'N/A'}</td>
                    <td className="px-4 py-2 border">
                      {payment.order ? (
                        <>
                          <div>Service: {payment.order.service?.name || payment.order.service || 'N/A'}</div>
                          <div>Qty: {payment.order.quantity || 'N/A'}</div>
                          <div>Status: {payment.order.status || 'N/A'}</div>
                        </>
                      ) : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
