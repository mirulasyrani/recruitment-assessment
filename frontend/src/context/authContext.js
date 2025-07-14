import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This useEffect only runs ONCE when the app first loads.
  // Its job is to check if a user is already logged in from a previous session.
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          // The stored token is invalid, so remove it.
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    // The backend sends back an object with { token, user }
    const { data } = await api.post('/auth/login', { email, password });
    
    // 1. Store the token
    localStorage.setItem('token', data.token);
    
    // 2. Set the auth header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    
    // 3. Set the user state directly. This will cause React to re-render
    //    and show the authenticated parts of the app.
    setUser(data.user);
  };

  const register = async (userData) => {
    // Same logic as login
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);