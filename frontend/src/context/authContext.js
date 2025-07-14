import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function is the single source of truth for checking user status.
  const checkUserStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      // We only set loading to false after the initial check.
      if (loading) setLoading(false);
    }
  }, [loading]);

  // Initial check when the app loads
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  const login = async (email, password) => {
    // The backend sets the cookie and returns the user data.
    const { data } = await api.post('/auth/login', { email, password });
    // Directly use the user data from the response to set the state.
    setUser(data);
  };

  const register = async (userData) => {
    // Same logic as login: register and use the response data directly.
    const { data } = await api.post('/auth/register', userData);
    setUser(data);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);