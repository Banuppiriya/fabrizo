import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';

const SidebarPaymentsWidget = ({ onViewAllClick }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      // Verify we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        navigate('/login');
        return;
      }

      const res = await api.get('/admin/payments');
      
      // Filter payments based on date
      const now = new Date();
      const filteredPayments = res.data.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        switch (dateFilter) {
          case 'today':
            return paymentDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return paymentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      });

      setPayments(filteredPayments.slice(0, 3)); // Show only latest 3 payments
      setError(null);
    } catch (err) {
      console.error('Payment fetch error:', err);
      if (err.response?.status === 401) {
        setError('Please login again to view payments');
        navigate('/login');
      } else {
        setError('Failed to fetch payments: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [dateFilter]);

  if (loading) return <div className="text-xs text-gray-400">Loading payments...</div>;
  if (error) return <div className="text-xs text-red-400">{error}</div>;
  if (payments.length === 0) return <div className="text-xs text-gray-400">No payments yet.</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Recent Payments</h3>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="text-xs border rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      <ul className="space-y-2 mb-3">
        {payments.map((p) => (
          <li 
            key={p._id} 
            onClick={() => {
              onViewAllClick?.(); // Call the prop function if provided
              navigate('/admin?tab=payments', { state: { selectedPaymentId: p._id } });
            }}
            className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded p-2 text-xs border border-gray-200 cursor-pointer group relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <div><span className="font-bold">{p.user?.username || 'N/A'}</span></div>
                <div className="text-emerald-600 font-bold">{p.amount} {p.currency?.toUpperCase()}</div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                p.status === 'successful' ? 'bg-green-100 text-green-800' :
                p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {p.status}
              </div>
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {new Date(p.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="absolute inset-0 bg-indigo-500 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 rounded flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-indigo-700 font-medium transition-opacity duration-200">
                View Details →
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarPaymentsWidget;
