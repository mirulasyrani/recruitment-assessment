import axios from 'axios';

const API_URL = 'https://recruitment-assessment.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// ✅ Attach token from localStorage if available
const token = localStorage.getItem('token');
if (token && token !== 'undefined') {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// 🔁 Optional: Intercept responses to catch errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 🔁 Optional: Intercept requests to attach token
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

export default api;
