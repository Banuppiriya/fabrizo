import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderHistoryTable from '../components/OrderHistoryTable'; // or wherever it's saved


// ... (OrderProgress, OrderPickupInfo, OrderCard, OrderHistoryTable remain unchanged)

// Main Page Component
const Order = () => {
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/orders');
      const allOrders = res.data;

      // Split in-progress and completed for display
      const activeOrders = allOrders.filter((o) => o.status !== 'delivered');
      const historyOrders = allOrders
        .filter((o) => o.status === 'delivered')
        .map((o) => ({
          id: o._id,
          item: o.service.title,
          date: new Date(o.createdAt).toLocaleDateString(),
          status: 'Delivered',
          total: `$${o.service.price}`
        }));

      const formattedOrders = activeOrders.map((o) => ({
        id: o._id,
        item: o.service.title,
        status: o.status === 'completed' ? 'Completed' : 'In Progress',
        progress: o.status === 'completed' ? 100 : 50, // Customize based on backend logic
        details: [
          { step: 'Order Placed', date: new Date(o.createdAt).toLocaleString(), completed: true },
          { step: 'Payment Confirmed', date: null, completed: !!o.paymentRequestSent },
          { step: 'Tailor Assigned', date: null, completed: !!o.tailor, info: o.tailor?.username },
          { step: 'Construction', completed: o.status === 'inProgress' || o.status === 'completed', info: 'In progress' },
          { step: 'Quality Check', completed: o.status === 'completed' },
          { step: 'Delivery', completed: o.status === 'completed' }
        ],
        type: o.status === 'completed' ? 'completed' : 'inProgress',
        pickupInfo: o.status === 'completed' ? {
          location: 'Fabrizo Downtown Store',
          address: '123 Fashion St, NYC',
          hours: '9 AM - 8 PM',
          code: `#FAB-${o._id}`
        } : null
      }));

      setOrders(formattedOrders);
      setOrderHistory(historyOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTrackOrder = () => {
    if (!orderId.trim()) return alert('Please enter an order number');
    const found = orders.find((o) => o.id.includes(orderId.trim()));
    alert(found ? `Order ${orderId} found.` : `Order ${orderId} not found.`);
  };

  const filteredOrders = orderId
    ? orders.filter((order) => order.id.includes(orderId.trim()))
    : orders;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">
      {/* Header */}
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-indigo-600 mr-8">Fabrizo</span>
          <div className="hidden md:flex space-x-6 text-gray-700">
            <a href="#" className="hover:text-indigo-600">Home</a>
            <a href="#" className="hover:text-indigo-600">Design Customizer</a>
            <a href="#" className="font-semibold text-indigo-600">Track Orders</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700 font-medium">John Doe</span>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-grow p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
          <p className="text-gray-600 mb-8">Monitor your orders in real-time from design to delivery.</p>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter order number..."
              className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition flex items-center"
              onClick={handleTrackOrder}
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Track Order
            </button>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <p className="text-center text-gray-500">Loading orders...</p>
          ) : (
            <>
              {/* Orders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
              </div>

              {/* History */}
              <OrderHistoryTable history={orderHistory} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Order;
