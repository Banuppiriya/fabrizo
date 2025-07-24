// src/pages/RegisterPage.jsx
import React, { useState } from 'react'; // Removed useEffect as Google Sign-In is removed
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import registerImage from '../assets/logiin.jpg'; // Assuming you have a registration image

// No need for jwt-decode here as it was primarily for Google login token decoding,
// and traditional registration doesn't immediately log in or decode a token.

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear form data when component unmounts
  React.useEffect(() => {
    return () => {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    };
  }, []);

  // Removed useEffect hook that initialized Google Sign-In

  // Removed handleGoogleResponse function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Clear form data from browser's autocomplete storage
    e.target.reset();
    
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(data.message || 'Registration successful! Redirecting to login...');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      // Automatically navigate to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-['Montserrat']"
      style={{ backgroundImage: `url(${registerImage})` }}
    >
      <div className="bg-white bg-opacity-95 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-4xl font-bold mb-6 text-center text-[#1C1F43] font-['Playfair_Display']">Create Account</h2>
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center border border-red-300 font-medium">
            {error}
          </p>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 text-center border border-green-200 font-medium">
            <p>{success}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
            placeholder="Username"
            required
            autoComplete="new-username"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
            placeholder="Email Address"
            required
            autoComplete="new-email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
            placeholder="Password"
            required
            autoComplete="new-password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
            placeholder="Confirm Password"
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-[#1C1F43] py-3 px-8 font-bold text-[#F2E1C1] shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl text-lg w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#F2E1C1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Create Account'
            )}
            <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#1C1F43] via-[#3B3F4C] to-[#1C1F43] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          </button>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#B26942] hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;