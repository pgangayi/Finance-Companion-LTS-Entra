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

  const DEV_MODE = true; // ✅ Toggle this to false in production

  useEffect(() => {
    if (DEV_MODE) {
      // ✅ Simulate a logged-in user
      setUser({
        id: 'dev-user',
        name: 'Munyaradzi',
        role: 'admin',
        email: 'dev@church.org',
      });
      setLoading(false);
      return;
    }

    // 🔐 Normal authentication flow
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
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
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        const response = await axios.post('/api/v1/auth/ms-entra/callback', { code });
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        const userResponse = await axios.get('/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${access_token}` }
        });

        setUser(userResponse.data);
      } catch (error) {
        console.error('Microsoft Entra callback failed:', error);
      } finally {
        setLoading(false);
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

      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

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
