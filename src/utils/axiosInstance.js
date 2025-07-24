// src/utils/axiosInstance.js
import axios from 'axios';

// Backend API base URL
const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Required for CORS
  validateStatus: function (status) {
    // Accept 304 Not Modified as a valid status
    return (status >= 200 && status < 300) || status === 304;
  }
});

// Cache token to prevent unnecessary localStorage access
let cachedToken = null;

// Track timestamps of requests to enable throttling
const requestTimestamps = new Map();
const THROTTLE_WINDOW = 5000; // 5 seconds

// Attach access token to all requests
api.interceptors.request.use(
  (config) => {
    // Implement throttling for profile requests
    if (config.url === '/user/profile') {
      const now = Date.now();
      const lastRequest = requestTimestamps.get(config.url) || 0;
      
      if (now - lastRequest < THROTTLE_WINDOW) {
        return Promise.reject({ 
          response: { status: 304, statusText: 'Not Modified (Throttled)' }
        });
      }
      
      requestTimestamps.set(config.url, now);
    }
    
    // Only get from localStorage if we don't have it cached
    if (!cachedToken) {
      cachedToken = localStorage.getItem('token');
    }
    
    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }
    
    // Add If-Modified-Since header if we have a last-modified timestamp
    if (config.method === 'get') {
      const lastModified = localStorage.getItem(`last-modified:${config.url}`);
      if (lastModified) {
        config.headers['If-Modified-Since'] = lastModified;
      }
    }
    
    return config;
  },
  async (error) => {
    // Network errors or timeout
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network Error or Timeout:', error.message);
      return retryHandler(error);
    }

    // Server errors (500+)
    if (error.response.status >= 500) {
      console.error('Server Error:', error.response.status, error.response.data);
      return retryHandler(error);
    }

    // Authentication error
    if (error.response.status === 401) {
      // Clear both cached and stored token
      cachedToken = null;
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Add retry logic
const retryHandler = async (error) => {
  const config = error.config;
  
  // If no retry config exists or we've run out of retries
  if (!config || !config.retries || config.retryCount >= config.retries) {
    return Promise.reject(error);
  }

  // Increment retry count
  config.retryCount = (config.retryCount || 0) + 1;

  // Delay before retrying
  await new Promise(resolve => setTimeout(resolve, config.retryDelay));

  // Retry the request
  return api(config);
};

// Handle responses globally
api.interceptors.response.use(
  (response) => {
    // Store last-modified header for future requests
    const lastModified = response.headers['last-modified'];
    if (lastModified) {
      localStorage.setItem(`last-modified:${response.config.url}`, lastModified);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip retry for login and refresh-token routes
    const isAuthRoute =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh-token');

    // If unauthorized (401) and it's not already retried and not an auth route
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      const user = localStorage.getItem('user');
      if (!user) {
        console.warn('No user session found. Redirecting to login.');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try refreshing token
        const response = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const newToken = response.data?.token;

        if (newToken) {
          localStorage.setItem('token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest); // Retry original request
        } else {
          throw new Error('No token returned from refresh endpoint');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
