import axios from 'axios';

// Get the backend API URL from environment variables or use a default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // Uncomment if using Sanctum's cookie-based SPA auth
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle common errors (like 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return response on success
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.error("Unauthorized access - 401");
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      // Ensure this doesn't cause infinite loops if login page itself fails
      if (window.location.pathname !== '/login') {
         window.location.href = '/login'; // Force redirect
      }
    }
    // Handle other errors (e.g., display a notification)
    return Promise.reject(error); // Important: Reject the promise so calling code can handle it
  }
);


export default axiosInstance;