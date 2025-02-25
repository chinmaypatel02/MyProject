import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'http://3.7.81.243/projects/plie-api/public/api',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to attach auth token for authenticated requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common API responses
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear stored token and redirect to login
      localStorage.removeItem('authToken');
      // You might want to dispatch a logout action here or handle it in your app
    }
    return Promise.reject(error);
  }
);

export default api;