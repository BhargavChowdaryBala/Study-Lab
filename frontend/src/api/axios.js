import axios from 'axios';

// Create Axios client with default configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Basic Auth header if user credentials exist
api.interceptors.request.use(
  (config) => {
    const authCredentials = localStorage.getItem('auth_credentials');
    if (authCredentials) {
      config.headers.Authorization = `Basic ${authCredentials}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    let message = 'An unexpected error occurred';
    if (error.response) {
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      } else if (error.response.status === 401) {
        message = 'Authentication failed. Please check your email and password.';
      } else if (error.response.status === 403) {
        message = 'Access denied. You do not have permission for this action.';
      } else if (error.response.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.response.status === 409) {
        message = error.response.data || 'Conflict: Record already exists.';
      }
    } else if (error.request) {
      message = 'Cannot connect to backend server. Make sure Spring Boot is running on port 8080.';
    }

    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.rawResponse = error.response;
    return Promise.reject(enhancedError);
  }
);

export default api;

