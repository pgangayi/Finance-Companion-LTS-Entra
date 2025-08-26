import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and set user
      validateToken(token);
    } else {
      // Check for Microsoft Entra callback
      handleMicrosoftCallback();
    }
  }, []);

  const validateToken = async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftCallback = async () => {
    // Check if we have a code parameter (Microsoft Entra callback)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      try {
        // Exchange code for tokens
        const response = await axios.post('/api/v1/auth/ms-entra/callback', { code });
        const { access_token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', access_token);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Get user info
        const userResponse = await axios.get('/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        
        setUser(userResponse.data);
      } catch (error) {
        console.error('Microsoft Entra callback failed:', error);
      } finally {
        setLoading(false);
        // Remove code from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      const { access_token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', access_token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Get user info
      const userResponse = await axios.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      setUser(userResponse.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}