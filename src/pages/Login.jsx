import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/axiosInstance';
import loginImage from '../assets/logiin.jpg';
import { Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Helper function to decode and validate token
const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      console.warn("Token expired");
      return null;
    }
    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  // Helper function to determine redirect path
  const getRedirectPath = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return '/admin/dashboard';
      case 'tailor':
        return '/tailor/dashboard';
      case 'customer':
        return '/services';
      default:
        return '/services';
    }
  };

  // Clear form data when component unmounts
  React.useEffect(() => {
    return () => {
      setFormData({ email: '', password: '' });
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate input
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      if (!email || !password) {
        setError('Please provide both email and password');
        setLoading(false);
        return;
      }

      // Only clear auth-related items
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      const { data } = response;
      
      if (!data?.token || !data?.user) {
        throw new Error('Invalid response from server');
      }

      // Try to login using the auth context
      const success = await login({
        token: data.token,
        user: {
          ...data.user,
          lastLogin: new Date().toISOString()
        }
      });

      if (!success) {
        throw new Error('Failed to initialize session');
      }

      // Show success message
      toast.success('Login successful!');

      // Handle redirect based on role
      const redirectPath = getRedirectPath(data.user.role);
      navigate(redirectPath, { replace: true });

      // Use replace instead of push to prevent back button issues
      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error('Login error:', err);
      
      let errorMsg = 'Login failed. Please try again later.';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMsg = err.response.data?.message || 'Please check your input and try again.';
        } else if (err.response.status === 500) {
          errorMsg = 'Server error. Please try again later.';
        } else {
          errorMsg = err.response.data?.message || 'Invalid credentials. Please try again.';
        }
        setFormData(prev => ({ ...prev, password: '' }));
      } else if (err.request) {
        errorMsg = 'Unable to reach the server. Please check your internet connection.';
      }

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-['Montserrat']"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <div className="bg-white bg-opacity-95 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-sm border border-gray-200">
        <h2 className="text-4xl font-bold mb-6 text-center text-[#1C1F43] font-['Playfair_Display']">
          Welcome Back
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center border border-red-300 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#3B3F4C] text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
            />
          </div>
          <div>
            <label className="block text-[#3B3F4C] text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-[#1C1F43] py-3 px-8 font-bold text-[#F2E1C1] shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl text-lg w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-3 text-[#F2E1C1]" />
                Logging in...
              </>
            ) : (
              <>
                <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#1C1F43] via-[#3B3F4C] to-[#1C1F43] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <span className="relative">Login</span>
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/forgot-password" className="font-bold text-[#B26942] hover:underline">
              Forgot Password?
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#B26942] hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
