
import axios from 'axios';

// Use the appropriate API URL based on environment
const API_URL = import.meta.env.PROD 
  ? 'https://preview-a03ddab8--quantis-trade-front.lovable.app:5000/api'  // Production URL
  : 'http://localhost:5000/api'; // Development URL

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
