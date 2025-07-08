import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/order').then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>All Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <Link to={`/orders/${order._id}`}>
              {order.customerName} - {order.product} ({order.status})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
