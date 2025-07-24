
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showSuccess, showError } from '../utils/toast';
import api from '../utils/axiosInstance';

const SIDEBAR_LINKS = [
  { key: 'orders', label: 'Assigned Orders' },
  { key: 'services', label: 'Assigned Services' },
  { key: 'profile', label: 'Profile' },
  { key: 'contact', label: 'Contact Admin' },
];

const TailorDashboard = () => {
  // Sidebar navigation
  const [activeSection, setActiveSection] = useState('orders');

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactErrorMsg, setContactErrorMsg] = useState('');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // Assigned services state
  const [assignedServices, setAssignedServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState('');

  // Profile state (simplified)
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Status options
  const statusOptions = ['pending', 'accepted', 'processing', 'completed', 'cancelled'];

  // Fetch orders
  useEffect(() => {
    if (activeSection !== 'orders') return;
    setLoading(true);
    const fetchAllOrders = async () => {
      try {
        // Try to fetch all orders without pagination
        const { data } = await api.get('/tailor/me/orders');
        let ordersArr = [];
        if (Array.isArray(data)) {
          ordersArr = data;
        } else if (Array.isArray(data.orders)) {
          ordersArr = data.orders;
        } else {
          ordersArr = [];
        }
        setOrders(ordersArr);
        setTotalItems(ordersArr.length);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your assigned orders. Please try again.');
        setOrders([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, [activeSection]);

  // Fetch assigned services
  useEffect(() => {
    if (activeSection !== 'services') return;
    setServicesLoading(true);
    const fetchAllServices = async () => {
      try {
        const { data } = await api.get('/tailor/me/services');
        let servicesArr = [];
        if (Array.isArray(data)) {
          servicesArr = data;
        } else if (Array.isArray(data.services)) {
          servicesArr = data.services;
        } else {
          servicesArr = [];
        }
        setAssignedServices(servicesArr);
        setServicesError('');
      } catch (err) {
        setServicesError(err.response?.data?.message || 'Could not load assigned services.');
        setAssignedServices([]);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchAllServices();
  }, [activeSection]);

  // Fetch profile
  useEffect(() => {
    if (activeSection !== 'profile') return;
    setProfileLoading(true);
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/tailor/me');
        setProfile(data.user || data);
        setProfileError('');
      } catch (err) {
        setProfileError(err.response?.data?.message || 'Could not load profile.');
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [activeSection]);

  // Contact form handlers
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactSuccess('');
    setContactErrorMsg('');
    try {
      await api.post('/contact', contactForm);
      setContactSuccess('Message sent successfully!');
      showSuccess('Message sent successfully!');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message.';
      setContactErrorMsg(msg);
      showError(msg);
    } finally {
      setContactSubmitting(false);
    }
  };

  // Order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await api.patch(`/tailor/me/orders/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
      setError('');
      showSuccess(`Order status updated to ${newStatus}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update order status.';
      setError(msg);
      showError(msg);
    }
  };

  // Loading and error states
  if (loading && activeSection === 'orders') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-800 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading assigned orders...
        </div>
      </div>
    );
  }
  if (error && activeSection === 'orders') {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 py-10">
        <div className="text-center text-red-700 text-lg p-6 bg-white rounded-lg shadow-md border border-red-300">
          <p className="font-bold mb-2">Error!</p>
          <p>{error}</p>
          <details className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded">
            <summary>Show raw error (for debugging)</summary>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </details>
          </div>
      </div>
    );
  }

  // Main dashboard layout
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col py-8 px-4">
        <h2 className="text-2xl font-extrabold text-[#B26942] mb-8 text-center font-['Playfair_Display']">Tailor Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {SIDEBAR_LINKS.map(link => (
            <button
              key={link.key}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${activeSection === link.key ? 'bg-[#B26942] text-white shadow' : 'bg-gray-100 text-[#B26942] hover:bg-[#B26942]/10'}`}
              onClick={() => setActiveSection(link.key)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

        {/* Orders Section */}
        {activeSection === 'orders' && (
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Orders</h3>
            <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Status</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500 text-lg font-medium">
                          <p className="mb-2">No assigned orders found.</p>
                          <p className="text-sm">You'll see new orders here once they are assigned to you.</p>
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                          <td className="py-3 px-4 whitespace-nowrap text-sm font-mono text-gray-700">{order._id?.slice(-8).toUpperCase() || 'N/A'}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                            <div>
                              <div><strong>Name:</strong> {order.customer?.username || order.customerName || 'N/A'}</div>
                              <div><strong>Email:</strong> {order.customer?.email || order.customerEmail || 'N/A'}</div>
                              <div><strong>Phone:</strong> {order.customerPhone || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{order.service?.title || 'N/A'}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'accepted' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex flex-col gap-2">
                              {order.status === 'accepted' && (
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors duration-150" onClick={() => handleStatusChange(order._id, 'processing')}>Pick Up Order</button>
                              )}
                              {order.status === 'processing' && (
                                <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors duration-150" onClick={() => handleStatusChange(order._id, 'completed')}>Finish Order</button>
                              )}
                              <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="block w-full pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none leading-tight" style={{ backgroundImage: `url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'none\'%3e%3cpath d=\'M7 7l3-3 3 3m0 6l-3 3-3-3\' stroke=\'%239CA3AF\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3e%3c/svg%3e')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25rem' }}>
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}</option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              {/* Pagination removed: always show all orders assigned to tailor */}
            </div>
          </section>
        )}

        {/* Assigned Services Section */}
        {activeSection === 'services' && (
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Services</h3>
            <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200">
              {servicesLoading ? (
                <div className="text-center py-8 text-gray-500">Loading services...</div>
              ) : servicesError ? (
                <div className="text-center py-8 text-red-500">{servicesError}</div>
              ) : assignedServices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No assigned services found.</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {assignedServices.map((service) => (
                    <li key={service._id || service.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <span className="font-semibold text-[#B26942] text-lg">{service.title}</span>
                        <span className="ml-2 text-gray-700">{service.description}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{service.price ? `LKR ${service.price}` : ''}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h3>
            <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200">
              {profileLoading ? (
                <div className="text-center py-8 text-gray-500">Loading profile...</div>
              ) : profileError ? (
                <div className="text-center py-8 text-red-500">{profileError}</div>
              ) : !profile ? (
                <div className="text-center py-8 text-gray-500">Profile not found.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div><span className="font-semibold text-[#B26942]">Name:</span> {profile.username || profile.name}</div>
                  <div><span className="font-semibold text-[#B26942]">Email:</span> {profile.email}</div>
                  <div><span className="font-semibold text-[#B26942]">Phone:</span> {profile.phone || 'N/A'}</div>
                  <div><span className="font-semibold text-[#B26942]">Role:</span> {profile.role}</div>
                  {/* Add more profile fields as needed */}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact Admin Section */}
        {activeSection === 'contact' && (
          <section>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Admin</h3>
            <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200 max-w-xl">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" name="name" value={contactForm.name} onChange={handleContactChange} required className="w-full px-3 py-2 border rounded-md focus:ring-[#B26942] focus:border-[#B26942]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={contactForm.email} onChange={handleContactChange} required className="w-full px-3 py-2 border rounded-md focus:ring-[#B26942] focus:border-[#B26942]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" name="phone" value={contactForm.phone} onChange={handleContactChange} required className="w-full px-3 py-2 border rounded-md focus:ring-[#B26942] focus:border-[#B26942]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea name="message" value={contactForm.message} onChange={handleContactChange} required rows={3} className="w-full px-3 py-2 border rounded-md focus:ring-[#B26942] focus:border-[#B26942]" />
                </div>
                <button type="submit" disabled={contactSubmitting} className="w-full py-2 px-4 bg-[#B26942] text-white rounded-md font-semibold hover:bg-[#a05a36] transition-colors">
                  {contactSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {contactSuccess && <div className="text-green-600 text-sm mt-2 text-center">{contactSuccess}</div>}
                {contactErrorMsg && <div className="text-red-600 text-sm mt-2 text-center">{contactErrorMsg}</div>}
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TailorDashboard;