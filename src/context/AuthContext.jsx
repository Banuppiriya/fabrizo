import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/axiosInstance';

const AuthContext = createContext(null);
const PROFILE_CACHE_KEY = 'cached_user_profile';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const FETCH_COOLDOWN = 5000; // 5 seconds minimum between fetches

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          return data;
        }
      }
      return null;
    } catch {
      return null;
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);

  const updateProfileCache = useCallback((profileData) => {
    if (profileData) {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({
        data: profileData,
        timestamp: Date.now()
      }));
    }
  }, []);

  const fetchProfile = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && lastFetch && now - lastFetch < FETCH_COOLDOWN) {
      return; // Skip if fetched recently
    }
    setLastFetch(now);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get('/user/profile');
      const profileData = response.data?.data;
      
      if (profileData) {
        setUser(profileData);
        updateProfileCache(profileData);
        setError(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem(PROFILE_CACHE_KEY);
        setUser(null);
      }
      // Don't set error if it's just a 304 Not Modified
      if (err.response?.status !== 304) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [updateProfileCache]);

  useEffect(() => {
    if (!isInitialized) {
      fetchProfile();
    }
  }, [fetchProfile, isInitialized]);

  const login = async (authData) => {
    try {
      if (!authData?.token || !authData?.user) {
        throw new Error('Invalid auth data provided');
      }
      
      localStorage.setItem('token', authData.token);
      setUser(authData.user);
      updateProfileCache(authData.user);
      
      // Fetch full profile in background
      fetchProfile(true).catch(console.error);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(PROFILE_CACHE_KEY);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    fetchProfile,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
