import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance'; // Assuming this is configured correctly

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Promise.allSettled to allow independent fetching and still show some data
        // even if one API call fails. For a dashboard, this might be preferable
        // over Promise.all which fails fast.
        const [profileRes, orderRes, tailorRes] = await Promise.allSettled([
          api.get('/user/profile'),
          api.get('/user/orders'),
          api.get('/user/tailors'),
        ]);

        // Process results from Promise.allSettled
        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data);
        } else {
          console.error("Failed to load profile:", profileRes.reason);
          // Optionally set a specific error for profile or a generic one
        }

        if (orderRes.status === 'fulfilled') {
          setOrders(orderRes.value.data);
        } else {
          console.error("Failed to load orders:", orderRes.reason);
        }

        if (tailorRes.status === 'fulfilled') {
          setTailors(tailorRes.value.data);
        } else {
          console.error("Failed to load tailors:", tailorRes.reason);
        }

        // If all fail, or if a critical part fails, set a general error
        if (profileRes.status === 'rejected' && orderRes.status === 'rejected' && tailorRes.status === 'rejected') {
          setError('Failed to load dashboard data. Please try again later.');
        } else if (profileRes.status === 'rejected') {
          setError('Failed to load profile data.');
        }

      } catch (err) {
        // This catch block might not be hit if using Promise.allSettled,
        // but kept for robustness or if Promise.all is preferred.
        setError(err.response?.data?.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get user role from profile (already fetched)
  const userRole = profile?.role;

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

  // Ensure profile exists before rendering profile-dependent components
  if (!profile && !error) { // If loading is false but profile is null (e.g., failed to fetch only profile)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Profile data not available.</div>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8"> {/* Added responsive padding */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center leading-tight">
        Your Personal Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"> {/* Enhanced responsive grid */}

        {/* Profile Card */}
        <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center justify-center min-h-[320px] border border-gray-200">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-5xl font-bold text-indigo-700 mb-5 shadow-inner">
            {profile.username?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{profile.username}</h3>
          <div className="text-gray-700 w-full text-center space-y-2">
            <p className="flex items-center justify-center text-lg">
              <i className="fas fa-envelope mr-2 text-indigo-500"></i> {/* Example icon */}
              <span className="font-medium">Email:</span> {profile.email}
            </p>
            {/* If your backend does not provide a phone field, this will always show N/A. Add phone to user model if needed. */}
            <p className="flex items-center justify-center text-lg">
              <i className="fas fa-phone mr-2 text-indigo-500"></i>
              <span className="font-medium">Phone:</span> {profile.phone || 'N/A'}
            </p>
            <p className="text-md text-gray-600 italic mt-3">"{profile.bio || 'No bio provided yet.'}"</p>
          </div>
        </div>

        {/* Order History Card */}
        <div className="bg-white shadow-xl rounded-lg p-6 min-h-[320px] flex flex-col border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Orders</h3>
          {orders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <p className="text-lg font-medium mb-2">No orders placed yet!</p>
              <p className="text-sm">Start by exploring services from our tailors.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:-mx-4 lg:-mx-6"> {/* Adjusted for horizontal scroll with padding */}
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Service</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tailor</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="py-3 px-4 text-sm font-mono text-gray-700">{typeof order._id === 'string' ? order._id.slice(-6).toUpperCase() : ''}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{order.service?.title || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">₹{order.service?.price || '0'}</td>
                      <td className="py-3 px-4 text-sm text-blue-700 font-medium">{order.tailor?.username || 'Not assigned'}</td>
                      <td className="py-3 px-4 text-sm capitalize">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tailor List Card */}
        {userRole === 'customer' && (
          <div className="bg-white shadow-xl rounded-lg p-6 min-h-[320px] flex flex-col border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Tailors</h3>
            {tailors.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-3v8l2-2h-4L9 7V5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m4-11V3a1 1 0 00-1-1H9a1 1 0 00-1 1v2m4 0h4"></path></svg>
                <p className="text-lg font-medium mb-2">No tailors currently available.</p>
                <p className="text-sm">Check back later for new additions!</p>
              </div>
            ) : (
              <ul className="space-y-4"> {/* Increased spacing */}
                {tailors.map((tailor) => (
                  <li key={tailor._id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 shadow-sm hover:bg-gray-100 transition duration-150 ease-in-out">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 flex-shrink-0">
                      {tailor.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow">
                      <span className="font-semibold text-gray-800 text-lg block">{tailor.username}</span>
                      <span className="text-sm text-gray-600">{tailor.email || 'No email provided'}</span>
                    </div>
                    {/* Optionally add a link or button here, e.g., to view tailor's profile */}
                    {/* <button className="ml-auto text-indigo-600 hover:text-indigo-800 text-sm font-medium">View</button> */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;