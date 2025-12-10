
import axios from 'axios';

// Create a global Axios instance
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // your API base URL
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Request interceptor to add Bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // or Redux/Context
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle unauthorized globally
      console.log('Unauthorized! Redirect to login.');
      // Optionally: redirect using router
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
