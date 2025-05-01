
import axios from 'axios';

// Use the appropriate API URL based on environment
// For XAMPP, we typically use http://localhost/your-project-folder/api
const API_URL = import.meta.env.PROD 
  ? 'https://quantis-trade-back.herokuapp.com/api'  // Production URL (replace with your actual deployed backend URL)
  : 'http://localhost/quantisfx/api'; // Local XAMPP path - adjust the folder name if different

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Adding this header can help with some CORS configurations
  },
  timeout: 30000, // 30 second timeout - increased for potential slower local development
  withCredentials: false, // Set to false to avoid CORS preflight issues
});

// Add a request interceptor to inject the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle CORS errors
    if (error.message && error.message.includes('Network Error')) {
      console.error('CORS or Network Error: Unable to connect to the server.');
      console.error('Please ensure your XAMPP server is running and properly configured for CORS.');
      console.error('Check that mod_headers is enabled in your Apache configuration.');
      return Promise.reject({
        response: {
          data: {
            error: 'Network Error: Unable to connect to the server. Please check your XAMPP services are running and Apache is correctly configured for CORS.'
          }
        }
      });
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error: Unable to connect to the server.');
      return Promise.reject({
        response: {
          data: {
            error: 'Network Error: Unable to connect to the server. Please check your XAMPP services are running and Apache is started.'
          }
        }
      });
    }
    
    return Promise.reject(error);
  }
);

// Define API services
export const AuthService = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  verifyEmail: async (userId: string, verificationCode: string) => {
    const response = await api.post('/auth/verify-email', { userId, verificationCode });
    return response.data;
  },
  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (userData: any) => {
    const response = await api.put('/auth/update-profile', userData);
    return response.data;
  },
  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/update-password', { currentPassword, newPassword });
    return response.data;
  }
};

export const TradingService = {
  getBalance: async () => {
    const response = await api.get('/trading/balance');
    return response.data;
  },
  deposit: async (amount: number) => {
    const response = await api.post('/trading/deposit', { amount });
    return response.data;
  },
  withdraw: async (amount: number) => {
    const response = await api.post('/trading/withdraw', { amount });
    return response.data;
  },
  transfer: async (toEmail: string, amount: number) => {
    const response = await api.post('/trading/transfer', { toEmail, amount });
    return response.data;
  },
  getTransactionHistory: async () => {
    const response = await api.get('/trading/history');
    return response.data;
  }
};

export default api;
