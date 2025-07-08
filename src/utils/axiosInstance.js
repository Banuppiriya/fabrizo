// utils/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Optional: If you use httpOnly cookies
});

// Add token from localStorage or other method
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Adjust if you store it differently
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
