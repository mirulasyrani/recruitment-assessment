import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function is now the single source of truth for checking user status.
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
  }, [loading]); // Dependency on loading to prevent re-runs

  // Initial check when the app loads
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  const login = async (email, password) => {
    // Step 1: Perform the login API call. The backend will set the cookie.
    await api.post('/auth/login', { email, password });
    // Step 2: Immediately re-check the user status. This forces the app
    // to use the new cookie and re-validates the user session.
    await checkUserStatus();
  };

  const register = async (userData) => {
    // Same logic as login: register, then immediately re-validate.
    await api.post('/auth/register', userData);
    await checkUserStatus();
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
