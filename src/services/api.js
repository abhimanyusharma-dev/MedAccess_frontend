import axios from 'axios';

// Set this to false to immediately switch all services to the backend URL
export const USE_MOCK = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.medaccess-saas.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor to attach Auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medaccess_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for centralized API logs & parsing errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Network error occurred. Please verify your connection.';
    console.error('[API Error Interceptor]:', message);
    return Promise.reject(new Error(message));
  }
);

// Helper wrapper to simulate latency when USE_MOCK is true
export const simulateNetworkLatency = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export default api;
