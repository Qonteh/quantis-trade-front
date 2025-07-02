
import axios from 'axios';

// Create axios instance with error handling
const api = axios.create({
  baseURL: 'http://localhost/quantisfx/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to inject auth credentials
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'demo-token-for-frontend-only') {
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
      localStorage.removeUser('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Auth service
const authApi = {
  register: async (userData) => {
    const response = await api.post('?route=auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('?route=auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    // No API call needed for logout in this implementation
    return { success: true };
  },
  
  verifyEmail: async (verificationData) => {
    const response = await api.post('?route=auth/verify-email', verificationData);
    return response.data;
  },
  
  resendVerification: async (email) => {
    const response = await api.post('?route=auth/resend-verification', { email });
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('?route=auth/update-profile', userData);
    return response.data;
  },
  
  updatePassword: async (passwordData) => {
    const response = await api.put('?route=auth/update-password', passwordData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('?route=auth/me');
    return response.data;
  }
};

// Trading service
const tradingApi = {
  getBalance: async () => {
    const response = await api.get('?route=trading/balance');
    return response.data;
  },
  
  deposit: async (amount) => {
    const response = await api.post('?route=trading/deposit', { amount });
    return response.data;
  },
  
  withdraw: async (amount) => {
    const response = await api.post('?route=trading/withdraw', { amount });
    return response.data;
  },
  
  transfer: async (toEmail, amount) => {
    const response = await api.post('?route=trading/transfer', { toEmail, amount });
    return response.data;
  },
  
  transferToPlatform: async (amount, platform, accountType) => {
    const response = await api.post('?route=trading/platform-transfer', { 
      amount, 
      platform, 
      accountType 
    });
    return response.data;
  },
  
  getTransactionHistory: async () => {
    const response = await api.get('?route=trading/history');
    return response.data;
  },
  
  getAccountDetails: async () => {
    const response = await api.get('?route=trading/account-details');
    return response.data;
  },
  
  getServerStatus: async () => {
    const response = await api.get('?route=trading/mt-servers/status');
    return response.data;
  },
  
  getMTAccounts: async () => {
    const response = await api.get('?route=trading/mt-accounts');
    return response.data;
  },
  
  createMTAccount: async (accountData) => {
    const response = await api.post('?route=trading/mt-accounts', accountData);
    return response.data;
  }
};

// Admin service
const adminApi = {
  getUsers: async () => {
    const response = await api.get('?route=admin/users');
    return response.data;
  },
  
  verifyUser: async (userId) => {
    const response = await api.post('?route=admin/users/verify', { userId });
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('?route=admin/stats');
    return response.data;
  }
};

// Export services
export { api, tradingApi, adminApi };
export const AuthService = authApi;
export const TradingService = tradingApi;
export const AdminService = adminApi;
