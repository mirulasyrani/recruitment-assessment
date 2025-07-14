import axios from 'axios';

const API_URL = 'https://recruitment-assessment.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // ⏱ optional: avoids hanging requests
});

// ✅ Request interceptor: Attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❗ Optional: Central error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 API Error:', error?.response?.data || error.message);

    // Optional: handle 401 or 403 globally
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('🔐 Unauthorized access - maybe logout?');
      // Optionally redirect or logout here
    }

    return Promise.reject(error);
  }
);

export default api;
