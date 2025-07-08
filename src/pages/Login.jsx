import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import loginImage from '../assets/login.jpg';

// ✅ Correct named import
import { jwtDecode } from 'jwt-decode';

// ✅ Debug logs for development (optional)
console.log("DEBUG: jwtDecode after named import:", jwtDecode);
console.log("DEBUG: Type of jwtDecode:", typeof jwtDecode);

/**
 * Helper to decode JWT and validate
 */
const decodeToken = (token) => {
  try {
    if (typeof jwtDecode !== 'function') {
      console.error("jwtDecode is not a function");
      return null;
    }
    const decoded = jwtDecode(token);

    // ✅ Optional: Expiry check
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

    if (typeof jwtDecode !== 'function') {
      setError("Internal error: JWT decoder not available");
      console.error("Login halted: jwtDecode is not a function.");
      setLoading(false);
      return;
    }

    try {
      console.log('Logging in with:', formData.email);
      const { data } = await api.post('auth/login', formData);
      console.log('Login response:', data);

      if (!data.token || typeof data.token !== 'string') {
        setError("Invalid token received");
        return;
      }

      localStorage.setItem('token', data.token);
      const decodedToken = decodeToken(data.token);

      if (!decodedToken) {
        setError("Token could not be decoded or is expired");
        localStorage.removeItem('token');
        return;
      }

      const userData = {
        username: decodedToken.username || '',
        role: decodedToken.role || 'user',
        email: decodedToken.email || '',
        id: decodedToken.id || decodedToken.sub || '',
      };

      localStorage.setItem('user', JSON.stringify(userData));

      // Navigate by role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'tailor') {
        navigate('/tailor');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-sans"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <div className="bg-white bg-opacity-95 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center transition-transform duration-300 transform hover:scale-105"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/forgot-password" className="font-bold text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
