import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/axiosInstance';
import AdminPayments from '../components/AdminPayments.jsx';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('orders');
  const [payments, setPayments] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch orders
        const ordersResponse = await api.get('/orders');
        const ordersData = ordersResponse.data;
        
        if (ordersData && Array.isArray(ordersData.orders)) {
          setOrders(ordersData.orders);
          setTotalOrders(ordersData.total || ordersData.orders.length);
        } else {
          console.error('Invalid orders data structure:', ordersData);
          setOrders([]);
          setTotalOrders(0);
        }

        // Fetch payments if needed
        if (activePage === 'payments') {
          const paymentsResponse = await api.get('/admin/payments');
          const paymentsData = paymentsResponse.data;
          
          if (Array.isArray(paymentsData)) {
            setPayments(paymentsData);
          } else if (Array.isArray(paymentsData.payments)) {
            setPayments(paymentsData.payments);
          } else {
            console.error('Invalid payments data structure:', paymentsData);
            setPayments([]);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
        setOrders([]);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activePage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
          
          {/* Stats Section */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-lg font-bold text-gray-900">{totalOrders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActivePage('orders')}
                className={`px-4 py-2 rounded-md ${
                  activePage === 'orders'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActivePage('payments')}
                className={`px-4 py-2 rounded-md ${
                  activePage === 'payments'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Payments
              </button>
            </nav>
            
            <div className="mt-6">
              {activePage === 'orders' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.customer?.name || order.customerName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                                {order.status || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              LKR {order.totalAmount?.toLocaleString() || '0'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activePage === 'payments' && <AdminPayments />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
