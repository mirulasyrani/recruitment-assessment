import axios from 'axios';
const API_URL = 'https://recruitment-assessment.onrender.com/';

const api = axios.create({ 
  baseURL: API_URL,
  withCredentials: true // <-- THIS IS CRUCIAL for sending cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
export default api;
