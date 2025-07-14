import axios from 'axios';

// This is the corrected URL. It MUST include the /api prefix.
const API_URL = 'https://recruitment-assessment.onrender.com/api';

const api = axios.create({ 
  baseURL: API_URL,
  withCredentials: true // This is crucial for sending cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
