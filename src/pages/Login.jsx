import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setLoginSuccess(false);

    try {
      const { data } = await axios.post('/api/auth/login', { email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMsg('Login successful!');
      setLoginSuccess(true);
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      setMsg(error);
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative"
      style={{
        backgroundImage: "url('/src/assets/background1.jpg')"
      }}
    >
      {/* Optional: Dark overlay for better contrast */}
      <div className="absolute inset-0 z-0"></div>

      {/* Login box */}
      <div className="relative z-10 bg-white rounded-lg shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in to Your Account</h1>
        <p className="text-sm text-gray-600 mb-4">Enter your credentials below</p>

        <form onSubmit={handleLogin} className="space-y-5 mt-2 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 cursor-pointer hover:underline">Forgot password?</span>
            <span
              className="text-indigo-600 hover:underline cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Create account
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {msg && (
          <p
            className={`text-center text-sm mt-4 ${
              loginSuccess ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {msg}
          </p>
        )}

        {loginSuccess && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-600 font-medium hover:underline"
            >
              Continue to Home
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-xs text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="flex justify-center w-full">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm">
            <img
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;