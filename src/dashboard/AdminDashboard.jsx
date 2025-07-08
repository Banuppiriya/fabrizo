// src/dashboard/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/axiosInstance';
import { CheckCircle, XCircle, User, Tally4, Hourglass, CheckSquare } from 'lucide-react'; // Icons for status and actions

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // To track loading state for specific actions (e.g., assigning a tailor)

  // Function to fetch all necessary data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, tailorsRes] = await Promise.all([
        api.get('/order'),
        api.get('/tailor'), // Assuming an endpoint to get tailors
      ]);
      setOrders(ordersRes.data);
      setTailors(tailorsRes.data);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency on fetchData to ensure it runs when needed

  const handleAssignTailor = async (orderId, tailorId) => {
    setActionLoading(orderId); // Set loading for this specific order action
    setError(''); // Clear previous errors
    try {
      // It's more RESTful to use PUT/PATCH for updates on an existing resource.
      // Assuming your backend handles PUT /order/:orderId with { tailor: tailorId }
      const { data } = await api.put(`/order/${orderId}`, { tailor: tailorId });
      
      setOrders(prevOrders =>
        prevOrders.map(o => (o._id === orderId ? data.order : o))
      );
      // Optional: Add a success alert
      // alert('Tailor assigned successfully!');
    } catch (err) {
      console.error('Error assigning tailor:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to assign tailor.');
      // Revert the UI if assignment fails (optional, depending on desired UX)
      fetchData(); 
    } finally {
      setActionLoading(null); // Clear loading state
    }
  };

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    setActionLoading(orderId + '-status'); // Unique loading key for status change
    setError('');
    try {
      // Assuming your backend handles PUT /order/:orderId with { status: newStatus }
      const { data } = await api.put(`/order/${orderId}`, { status: newStatus });
      setOrders(prevOrders =>
        prevOrders.map(o => (o._id === orderId ? data.order : o))
      );
      // alert(`Order ${orderId} status changed to ${newStatus}!`);
    } catch (err) {
      console.error('Error changing order status:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to update order status.');
      fetchData(); 
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-[#F2E1C1] min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-[#1C1F43]">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F2E1C1] py-12 min-h-screen font-['Montserrat']">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold font-['Playfair_Display'] text-[#1C1F43] mb-8 border-b pb-4">
          Admin Dashboard
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-4 rounded-md mb-6 text-sm border border-red-200 flex items-center shadow-sm">
            <XCircle size={20} className="mr-2" /> {error}
          </p>
        )}

        <div className="bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-2xl font-bold font-['Playfair_Display'] text-[#1C1F43] mb-6">All Orders</h3>
          
          {orders.length === 0 ? (
            <div className="text-center text-lg text-[#3B3F4C] py-10">
              No orders found at the moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#1C1F43]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                      Assigned Tailor
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-[#F2E1C1] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700 flex items-center">
                         <User size={16} className="mr-1 text-gray-500" />
                        {order.customer?.username ?? 'N/A'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {order.service?.title ?? 'N/A'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {order.tailor?.username ?? 'Unassigned'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex flex-col items-center space-y-2">
                          {/* Tailor assignment dropdown */}
                          <div className="relative w-full max-w-[180px]"> {/* Added a max-width to control dropdown size */}
                            <select
                              onChange={(e) => handleAssignTailor(order._id, e.target.value)}
                              disabled={!!order.tailor || actionLoading === order._id}
                              className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#B26942] focus:border-[#B26942] sm:text-sm rounded-md shadow-sm ${
                                !!order.tailor ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                              }`}
                              defaultValue={order.tailor?._id || ""} // Pre-select assigned tailor
                            >
                              <option value="" disabled={!!order.tailor}>
                                {actionLoading === order._id ? 'Assigning...' : (order.tailor ? order.tailor.username : 'Assign Tailor')}
                              </option>
                              {tailors.map(tailor => (
                                <option key={tailor._id} value={tailor._id}>
                                  {tailor.username}
                                </option>
                              ))}
                            </select>
                            {actionLoading === order._id && (
                               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                 <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1116 0A8 8 0 004 12z"></path>
                                 </svg>
                               </div>
                             )}
                          </div>
                          
                          {/* Order Status Update Buttons */}
                          <div className="flex justify-center space-x-2 w-full max-w-[180px]"> {/* Align buttons */}
                            {order.status === 'Pending' && (
                              <button
                                onClick={() => handleChangeOrderStatus(order._id, 'Assigned')}
                                disabled={actionLoading === order._id + '-status'}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                title="Mark as Assigned"
                              >
                                {actionLoading === order._id + '-status' ? <Hourglass size={14} className="animate-spin" /> : <Tally4 size={14} />}
                                <span className="ml-1">Assign</span>
                              </button>
                            )}
                            {(order.status === 'Assigned' || order.status === 'Pending') && (
                              <button
                                onClick={() => handleChangeOrderStatus(order._id, 'In Progress')}
                                disabled={actionLoading === order._id + '-status'}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                title="Mark as In Progress"
                              >
                                {actionLoading === order._id + '-status' ? <Hourglass size={14} className="animate-spin" /> : <Hourglass size={14} />}
                                <span className="ml-1">In Progress</span>
                              </button>
                            )}
                            {order.status !== 'Completed' && order.status !== 'Cancelled' && ( // Allow completion from any non-final status
                              <button
                                onClick={() => handleChangeOrderStatus(order._id, 'Completed')}
                                disabled={actionLoading === order._id + '-status'}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                title="Mark as Completed"
                              >
                                {actionLoading === order._id + '-status' ? <Hourglass size={14} className="animate-spin" /> : <CheckSquare size={14} />}
                                <span className="ml-1">Complete</span>
                              </button>
                            )}
                            {order.status !== 'Cancelled' && (
                               <button
                                 onClick={() => handleChangeOrderStatus(order._id, 'Cancelled')}
                                 disabled={actionLoading === order._id + '-status'}
                                 className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                 title="Cancel Order"
                               >
                                 {actionLoading === order._id + '-status' ? <Hourglass size={14} className="animate-spin" /> : <XCircle size={14} />}
                                 <span className="ml-1">Cancel</span>
                               </button>
                             )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;