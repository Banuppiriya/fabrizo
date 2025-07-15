import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import loginImage from '../assets/login.jpg';
import { Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const { data } = await api.post('auth/login', payload);

      if (!data.token || typeof data.token !== 'string') {
        setError("Invalid token received from server.");
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      const decodedToken = decodeToken(data.token);

      if (!decodedToken) {
        setError("Login failed: Invalid or expired token received.");
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }

      const userData = {
        username: decodedToken.username || 'User',
        role: decodedToken.role || 'user',
        email: decodedToken.email || formData.email,
        id: decodedToken.id || decodedToken.sub || '',
      };

      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User data stored:', userData);

      // Role-based redirect (use backend's redirectTo if present, else fallback)
      if (data.redirectTo) {
        navigate(data.redirectTo);
      } else {
        switch (userData.role.toLowerCase()) {
          case 'tailor':
            toast.success('Login successful!');
            navigate('/tailor');
            break;
          case 'admin':
            toast.success('Login successful!');
            navigate('/admin');
            break;
          default:
            toast.success('Login successful!');
            navigate('/home');
            break;
        }
      }
    } catch (err) {
      console.error('Login error details:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'Login failed. Please check your email and password.');
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
