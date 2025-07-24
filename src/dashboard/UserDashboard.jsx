
import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';

const SIDEBAR_LINKS = [
  { key: 'profile', label: 'Profile' },
  { key: 'orders', label: 'Orders' },
  { key: 'tailors', label: 'Our Tailors' },
];

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tailors, setTailors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [editData, setEditData] = useState({ username: '', email: '', phone: '', address: '' });

  // Fetch dashboard data (profile, orders, tailors)
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get profile to determine role
      const profileRes = await api.get('/user/profile');
      if (profileRes && profileRes.data) {
        setProfile(profileRes.data);
        setIsAdmin(profileRes.data.role === 'admin');
      }
      let ordersUrl = '/user/orders';
      if (profileRes?.data?.role === 'admin , customer') {
        ordersUrl = '/orders'; // Admin endpoint to get all orders
      }
      const [orderRes, tailorRes] = await Promise.allSettled([
        api.get(ordersUrl),
        api.get('/user/tailors'),
      ]);
      if (orderRes.status === 'fulfilled') {
        // For admin, if response is { orders: [...] }, extract orders
        const data = orderRes.value.data;
        setOrders(Array.isArray(data) ? data : data.orders || []);
      }
      if (tailorRes.status === 'fulfilled') {
        // Support both array and object with tailors property
        const tData = tailorRes.value.data;
        setTailors(Array.isArray(tData) ? tData : tData.tailors || []);
      }
      if (!profileRes || orderRes.status === 'rejected' && tailorRes.status === 'rejected') {
        setError('Failed to load dashboard data. Please try again later.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  fetchDashboardData();

  // Listen for a custom event to refresh orders after placing an order
  const handleOrderPlaced = () => {
    fetchDashboardData();
  };
  window.addEventListener('orderPlaced', handleOrderPlaced);
  return () => {
    window.removeEventListener('orderPlaced', handleOrderPlaced);
  };
}, [activeSection]);

  useEffect(() => {
    if (profile && editProfile) {
      setEditData({
        username: profile.username || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile, editProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/user/profile', editData);
      setProfile(res.data);
      setEditProfile(false);
      // Immediately refresh dashboard data after profile update
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;
    try {
      await api.delete('/user/profile');
      setProfile(null);
      setEditProfile(false);
      setError('Profile deleted.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete profile.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading dashboard...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 py-10">
        <div className="text-center text-red-700 text-lg p-6 bg-white rounded-lg shadow-md">
          <p className="font-bold mb-2">Error!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  if (!profile && !error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Profile data not available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col py-8 px-4">
        <h2 className="text-2xl font-extrabold text-gray-700 mb-8 text-center font-['Playfair_Display']">User Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {SIDEBAR_LINKS.map(link => {
            let count = null;
            if (link.key === 'orders') count = Array.isArray(orders) ? orders.length : 0;
            if (link.key === 'tailors') count = Array.isArray(tailors) ? tailors.length : 0;
            return (
              <button
                key={link.key}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${activeSection === link.key ? 'bg-indigo-700 text-white shadow' : 'bg-gray-100 text-indigo-700 hover:bg-indigo-100'}`}
                onClick={() => setActiveSection(link.key)}
              >
                {link.label}
                {count !== null && (
                  <span className="ml-2 inline-block bg-indigo-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full align-middle">{count}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Customer Details</h3>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200 max-w-xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-indigo-700 mb-2 shadow-inner">
                  {profile.username?.charAt(0).toUpperCase()}
                </div>
                <div className="w-full text-gray-700 text-center space-y-1">
                  <p><span className="font-medium">Name:</span> {profile.username}</p>
                  <p><span className="font-medium">Email:</span> {profile.email}</p>
                  {/* <p><span className="font-medium">Phone:</span> {profile.phone || ''}</p>
                  <p><span className="font-medium">Address:</span> {profile.address || ''}</p> */}
                  <div className="flex justify-center gap-2 mt-4">
                    <button className="px-3 py-1 text-xs rounded font-medium text-white bg-blue-600 hover:bg-blue-700" onClick={() => setEditProfile(true)}>Edit</button>
                    <button className="px-3 py-1 text-xs rounded font-medium text-white bg-red-600 hover:bg-red-700" onClick={handleDeleteProfile}>Delete</button>
                  </div>
                </div>
                {editProfile && (
                  <form className="mt-4 w-full max-w-md mx-auto bg-gray-50 p-4 rounded shadow" onSubmit={handleUpdateProfile}>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" className="w-full border rounded px-2 py-1" value={editData.username} onChange={e => setEditData({ ...editData, username: e.target.value })} />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" className="w-full border rounded px-2 py-1" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input type="text" className="w-full border rounded px-2 py-1" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input type="text" className="w-full border rounded px-2 py-1" value={editData.address} onChange={e => setEditData({ ...editData, address: e.target.value })} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="px-3 py-1 text-xs rounded font-medium text-white bg-green-600 hover:bg-green-700">Update</button>
                      <button type="button" className="px-3 py-1 text-xs rounded font-medium text-gray-700 bg-gray-200 hover:bg-gray-300" onClick={() => setEditProfile(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Orders Section */}
        {activeSection === 'orders' && (
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Orders</h3>
            <button
              className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition"
              onClick={fetchDashboardData}
            >
              Refresh Orders
            </button>
            <div className="bg-white shadow-xl rounded-lg p-6 min-h-[320px] flex flex-col border border-gray-200 mb-8">
              {orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p className="text-lg font-medium mb-2">No orders placed yet!</p>
                  <p className="text-sm">Start by exploring services from our tailors.</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2 sm:-mx-4 lg:-mx-6">
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Service</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tailor</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order Date</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Address</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(Array.isArray(orders) && orders.length > 0) ? orders.map((order) => {
                        const statusMap = {
                          pending: { percent: 10, color: '#facc15', label: 'Pending' },
                          accepted: { percent: 30, color: '#a78bfa', label: 'Accepted' },
                          processing: { percent: 60, color: '#38bdf8', label: 'Processing' },
                          completed: { percent: 100, color: '#22c55e', label: 'Completed' },
                          cancelled: { percent: 100, color: '#ef4444', label: 'Cancelled' },
                        };
                        const status = order?.status?.toLowerCase() || 'pending';
                        const progress = statusMap[status] || statusMap['pending'];
                        const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                        return (
                          <tr key={order?._id || Math.random()} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                            <td className="py-3 px-4 text-sm font-mono text-gray-700">{typeof order?._id === 'string' ? order._id.slice(-6).toUpperCase() : ''}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{order?.service?.title || order?.serviceTitle || order?.serviceName || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm font-semibold text-green-600">₹{order?.service?.price || order?.price || '0'}</td>
                            <td className="py-3 px-4 text-sm text-blue-700 font-medium">{
                              order?.tailor?.username || order?.tailorName || order?.assignedTailor?.username || order?.assignedTailorName || 'Not assigned'
                            }</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{orderDate}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{
                              order?.address || order?.deliveryAddress || order?.customerAddress || 'N/A'
                            }</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{
                              order?.phone || order?.contactPhone || order?.customerPhone || 'N/A'
                            }</td>
                            <td className="py-3 px-4 text-sm capitalize">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                status === 'completed' ? 'bg-green-100 text-green-800' :
                                status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                status === 'accepted' ? 'bg-purple-100 text-purple-800' :
                                status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {progress.label}
                              </span>
                              <div className="w-full mt-2">
                                <div className="h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progress.percent}%`, backgroundColor: progress.color }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 ml-1">{progress.percent}%</span>
                              </div>
                              {status === 'accepted' && (
                                <div className="mt-2 text-xs text-indigo-700 bg-indigo-50 rounded px-2 py-1">
                                  Your order is ongoing and assigned to tailor <b>{order?.tailor?.username || order?.tailorName || 'Tailor'}</b>.
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-gray-500">No orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tailors Section */}
        {activeSection === 'tailors' && (
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Tailors</h3>
            <div className="bg-white shadow-xl rounded-lg p-6 min-h-[320px] flex flex-col border border-gray-200">
              {tailors.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-3v8l2-2h-4L9 7V5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m4-11V3a1 1 0 00-1-1H9a1 1 0 00-1 1v2m4 0h4"></path></svg>
                  <p className="text-lg font-medium mb-2">No tailors currently available.</p>
                  <p className="text-sm">Check back later for new additions!</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {tailors.map((tailor) => (
                    <li key={tailor._id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 shadow-sm hover:bg-gray-100 transition duration-150 ease-in-out">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 flex-shrink-0">
                        {tailor.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow">
                        <span className="font-semibold text-gray-800 text-lg block">{tailor.username}</span>
                        <span className="text-sm text-gray-600">{tailor.email || 'No email provided'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;