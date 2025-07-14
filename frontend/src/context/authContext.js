import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function is still used to verify the user when the app first loads.
  const checkUserStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial check when the app loads or user revisits.
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  const login = async (email, password) => {
    // Step 1: Perform the login API call.
    // The backend sets the cookie AND returns the user data.
    const { data } = await api.post('/auth/login', { email, password });
    
    // Step 2: Directly use the user data from the response to set the state.
    // This is more reliable than making a second request immediately.
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
      // Still clear user on the frontend even if backend call fails
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
