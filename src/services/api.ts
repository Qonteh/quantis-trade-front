
import axios from 'axios';

// Create axios instance with error handling
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to inject auth credentials
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

// Add response interceptor with improved error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject({
        response: {
          data: {
            error: 'Network error. Please check your connection and try again.'
          }
        }
      });
    }
    
    // Handle authentication errors
    if (error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Auth service
const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  verifyEmail: async (verificationData) => {
    const response = await api.post('/auth/verify-email', verificationData);
    return response.data;
  },
  
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/auth/update-profile', userData);
    return response.data;
  },
  
  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/update-password', passwordData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Trading service with added MT server methods
const tradingApi = {
  getBalance: async () => {
    const response = await api.get('/trading/balance');
    return response.data;
  },
  
  deposit: async (amount) => {
    const response = await api.post('/trading/deposit', { amount });
    return response.data;
  },
  
  withdraw: async (amount) => {
    const response = await api.post('/trading/withdraw', { amount });
    return response.data;
  },
  
  transfer: async (toEmail, amount) => {
    const response = await api.post('/trading/transfer', { toEmail, amount });
    return response.data;
  },
  
  transferToPlatform: async (amount, platform, accountType) => {
    const response = await api.post('/trading/platform-transfer', { 
      amount, 
      platform, 
      accountType 
    });
    return response.data;
  },
  
  getTransactionHistory: async () => {
    const response = await api.get('/trading/history');
    return response.data;
  },
  
  getAccountDetails: async () => {
    const response = await api.get('/trading/account-details');
    return response.data;
  },
  
  // Add the missing methods for MT servers
  getServerStatus: async () => {
    const response = await api.get('/trading/mt-servers/status');
    return response.data;
  },
  
  getMTAccounts: async () => {
    const response = await api.get('/trading/mt-accounts');
    return response.data;
  },
  
  createMTAccount: async (accountData) => {
    const response = await api.post('/trading/mt-accounts', accountData);
    return response.data;
  }
};

export { api, authApi, tradingApi };
