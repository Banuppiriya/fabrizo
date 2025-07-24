import React, { useEffect, useState, Suspense } from 'react';
// import Measurements from './Measurements';

// const toNumericMeasurements = (measurements) =>
//   Object.fromEntries(
//     Object.entries(measurements).map(([key, value]) => [key, Number(value) || 0])
//   );
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance'; 
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const OrderPage = () => {
  // All useState declarations at the top
  // Measurements removed
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Measurements logic removed

  const navigate = useNavigate();

  // Get user role from token
  let userRole = null;
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch (e) {
      userRole = null;
    }
  }

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(Array.isArray(data.services) ? data.services : []);
      } catch (err) {
        setError('Failed to load services.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, []);

  useEffect(() => {
    const foundService = services.find((s) => s._id === selectedServiceId);
    setService(foundService || null);
  }, [selectedServiceId, services]);


  // Measurements save handler removed

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedServiceId || !customerName || !customerEmail || !customerPhone || quantity <= 0) {
      setSubmitSuccess(false);
      toast.error('Please fill all required fields.');
      return;
    }


    // Measurements requirement removed

    const totalPrice = service?.price ? service.price * quantity : 0;

    if (!totalPrice || isNaN(totalPrice)) {
      setSubmitSuccess(false);
      toast.error('Invalid total price. Please choose a valid service.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitSuccess(null);

    try {
      const response = await api.post('/orders', {
        service: service._id,
        quantity,
        specialInstructions,
        customerName,
        customerEmail,
        customerPhone,
        totalAmount: totalPrice, // Add the total amount
      });
      const order = response.data;
      setSubmitSuccess(true);
      window.dispatchEvent(new Event('orderPlaced'));
      toast.success('Order placed successfully! Redirecting to payment...');
      setTimeout(() => {
        navigate('/checkout', { state: { order } });
      }, 1500);
    } catch (err) {
      console.error("Error response from server:", err.response?.data);
      setSubmitSuccess(false);
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-[#1C1F43]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Loading services...</p>
      </div>
    );
  }

  if (userRole !== 'customer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#1C1F43]">
        <XCircle className="mb-4 text-red-500" size={48} />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-lg">Only customers can place orders.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="bg-gray-200 min-h-screen py-10 px-4 md:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
          <h1 className="text-3xl font-bold text-[#1C1F43] text-center">Place Your Order</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-[#1C1F43]">Select Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">-- Choose a service --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title} - LKR {s.price?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            {service && (
              <div className="border rounded-md p-4 bg-gray-50">
                <p className="text-gray-700 mb-2">{service.description}</p>
                <p className="font-semibold text-[#B26942]">
                  Price: LKR {service.price?.toLocaleString()}
                </p>
              </div>
            )}
            {/* Measurement section removed */}
            {/* ...existing order form fields... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-[#1C1F43]">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-[#1C1F43]">Special Instructions</label>
                <textarea
                  rows="3"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Chest: 38, prefer cotton fabric"
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-[#1C1F43]">Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-[#1C1F43]">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-[#1C1F43]">Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1C1F43] text-[#F2E1C1] py-3 font-bold rounded hover:bg-[#2B2F5A] flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
