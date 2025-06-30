// components/OrderHistoryTable.jsx
import React from 'react';

const OrderHistoryTable = ({ orders = [] }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm border border-gray-200 bg-white">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3 border">Order ID</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border">{order.id}</td>
              <td className="p-2 border">{order.date}</td>
              <td className="p-2 border">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistoryTable;
