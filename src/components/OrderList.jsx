// src/pages/OrderList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/axiosInstance'; // Assuming this is your configured Axios instance
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink } from 'lucide-react'; // For loading spinner and external link icon

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch orders from the backend
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // The backend `getOrders` populates customer, tailor, and service details.
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Conditional rendering for loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2E1C1] text-[#1C1F43]">
        <Loader2 className="animate-spin text-[#B26942] mb-4" size={48} />
        <p className="text-xl font-semibold">Loading orders...</p>
      </div>
    );
  }

  // Conditional rendering for error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border border-red-300">
          <p className="text-red-700 font-bold text-lg mb-4">Error!</p>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F2E1C1] py-12 min-h-screen font-['Montserrat']">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold font-['Playfair_Display'] text-[#1C1F43]">All Orders</h1>
          {/* You might add a "Create New Order" button here if this is an admin page */}
          {/* <Link to="/create-order" className="bg-[#1C1F43] hover:bg-[#3B3F4C] text-[#F2E1C1] font-semibold py-3 px-6 rounded-lg flex items-center transition-colors shadow-md">
            <PlusCircle className="mr-2" size={20} /> Create New Order
          </Link> */}
        </div>

        {orders.length === 0 ? (
          <div className="text-center text-xl text-[#3B3F4C] py-20 bg-white rounded-lg shadow-xl border border-gray-200">
            No orders found.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#1C1F43]">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                    Price (LKR)
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                    Tailor
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3B3F4C]">
                      {order.customer ? order.customer.username : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3B3F4C]">
                      {order.service ? order.service.title : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                      {order.service ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(order.service.price || 0) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3B3F4C]">
                      {order.tailor ? order.tailor.username : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-LK')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-[#B26942] hover:text-[#8C4F2C] transition-colors p-2 rounded-full hover:bg-gray-100 inline-flex items-center"
                        title="View Order Details"
                      >
                        View <ExternalLink size={16} className="ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
