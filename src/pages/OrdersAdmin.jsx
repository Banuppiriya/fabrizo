import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);

  const load = () => adminApi.getOrders().then(setOrders).catch(console.error);
  useEffect(load, []);

  const assign = async (orderId, tailorId) => {
    await adminApi.assignTailor(orderId, tailorId);
    load();
  };

  const requestPayment = async (orderId) => {
    await adminApi.sendPaymentRequest(orderId);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th>Order ID</th><th>Customer</th><th>Service</th><th>Tailor</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id} className="border-b">
              <td>{o._id}</td>
              <td>{o.customer.username}</td>
              <td>{o.service.title} (${o.service.price})</td>
              <td>{o.tailor ? o.tailor.username : '—'}</td>
              <td>{o.status}</td>
              <td className="space-x-2">
                {!o.tailor && <button onClick={() => assign(o._id, prompt('Tailor ID?'))}>Assign Tailor</button>}
                {!o.paymentRequestSent && <button onClick={() => requestPayment(o._id)}>Send Payment</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersAdmin;
