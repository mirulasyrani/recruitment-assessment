import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // 🔄 Load user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token && token !== 'undefined') {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (err) {
          console.error('🔒 Auth check failed:', err?.response?.data || err.message);
          logout(); // force logout if token invalid
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      if (data?.token && data?.user) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data.user);
        return true;
      } else {
        throw new Error('Login failed: No token/user received');
      }
    } catch (err) {
      console.error('❌ Login error:', err?.response?.data || err.message);
      throw err;
    }
  };

  // ✅ Register function
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);

      if (data?.token && data?.user) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data.user);
        return true;
      } else {
        throw new Error('Registration failed: No token/user received');
      }
    } catch (err) {
      console.error('❌ Registration error:', err?.response?.data || err.message);
      throw err;
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
