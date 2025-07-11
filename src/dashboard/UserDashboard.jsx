import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, orderRes, tailorRes] = await Promise.all([
          api.get('/user/'),
          api.get('/user/'),
          api.get('/user/tailor'),
        ]);
        setProfile(profileRes.data);
        setOrders(orderRes.data);
        setTailors(tailorRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h2>

      {/* Profile */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Profile Info</h3>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
        <p><strong>Bio:</strong> {profile.bio || 'N/A'}</p>
      </div>

      {/* Order History */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">My Orders</h3>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">Service</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border">{order._id}</td>
                  <td className="py-2 px-4 border">{order.service?.title || 'N/A'}</td>
                  <td className="py-2 px-4 border">₹{order.service?.price || '0'}</td>
                  <td className="py-2 px-4 border capitalize">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tailor List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Available Tailors</h3>
        {tailors.length === 0 ? (
          <p>No tailors available.</p>
        ) : (
          <ul className="list-disc pl-5">
            {tailors.map((tailor) => (
              <li key={tailor._id}>
                <span className="font-medium">{tailor.username}</span> - {tailor.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
