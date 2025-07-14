import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      // Log the token retrieved from localStorage on page load
      console.log("AuthContext (on load): Token from localStorage is:", token);

      if (token && token !== 'undefined') {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    // Log the token received from the server after login
    console.log("AuthContext (on login): Token received from server is:", data.token);

    localStorage.setItem('token', data.token);
    window.location.reload();
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);

    // Log the token received from the server after registration
    console.log("AuthContext (on register): Token received from server is:", data.token);

    localStorage.setItem('token', data.token);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);