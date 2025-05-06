
import axios from 'axios';

// Use the MT server API URL from environment variables
const MT_API_URL = import.meta.env.VITE_MT_SERVER_URL || 'https://mt-server-api.quantisfx.com/api';
const MT_API_KEY = import.meta.env.VITE_MT_SERVER_API_KEY;

// Create axios instance for MT server communications with error handling
const mtServerApi = axios.create({
  baseURL: MT_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': MT_API_KEY,
  },
  timeout: 5000, // Reduced timeout to prevent UI hanging
});

// Add request interceptor to inject auth credentials
mtServerApi.interceptors.request.use(
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
mtServerApi.interceptors.response.use(
  response => response,
  error => {
    // If server is unreachable or request times out
    if (!error.response) {
      console.error('MT Server API Error: Unable to connect to MT server.');
      return Promise.reject({
        response: {
          data: {
            error: 'Cannot connect to trading servers. Please try again later.'
          }
        }
      });
    }
    
    // Handle authentication errors
    if (error.response.status === 401) {
      console.error('MT Server API Error: Authentication failed');
      return Promise.reject({
        response: {
          data: {
            error: 'Authentication with trading server failed. Please log in again.'
          }
        }
      });
    }
    
    // Handle server errors
    if (error.response.status >= 500) {
      console.error('MT Server API Error: Server error', error.response.status);
      return Promise.reject({
        response: {
          data: {
            error: 'Trading server is experiencing issues. Please try again later.'
          }
        }
      });
    }
    
    return Promise.reject(error);
  }
);

// Mock data for development
const getMockAccountDetails = (platform, accountId) => {
  return {
    accountId: accountId,
    platform: platform,
    balance: 10000 + Math.random() * 5000,
    equity: 10000 + Math.random() * 6000,
    margin: 500 + Math.random() * 1000,
    freeMargin: 9000 + Math.random() * 4000,
    marginLevel: 200 + Math.random() * 300,
    type: 'Standard',
    leverage: '1:2000',
    currency: 'USD',
    server: platform === 'MT4' ? 'Quantis-MT4' : 'Quantis-MT5',
    openPositions: Math.floor(Math.random() * 5),
    pendingOrders: Math.floor(Math.random() * 3),
    openDate: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
    lastLogin: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
    isActive: Math.random() > 0.1 // 90% chance to be active
  };
};

export const MT4Service = {
  getAccountDetails: async (accountId: string) => {
    try {
      // For development/demo, return mock data to avoid dependency on external API
      if (import.meta.env.DEV) {
        console.log('Using mock MT4 account data');
        return getMockAccountDetails('MT4', accountId);
      }
      
      const response = await mtServerApi.get(`/mt4/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching MT4 account details:', error);
      throw error;
    }
  },
  
  transferFunds: async (accountId: string, amount: number, direction: 'deposit' | 'withdraw') => {
    try {
      // For development/demo, simulate success
      if (import.meta.env.DEV) {
        console.log(`Mock ${direction} of ${amount} to MT4 account ${accountId}`);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, message: 'Transfer completed successfully' };
      }
      
      const response = await mtServerApi.post(`/mt4/accounts/${accountId}/transfer`, {
        amount,
        direction
      });
      return response.data;
    } catch (error) {
      console.error('Error transferring funds to/from MT4:', error);
      throw error;
    }
  },
  
  getServerStatus: async () => {
    try {
      // For development/demo, always return online
      if (import.meta.env.DEV) {
        console.log('Using mock MT4 server status');
        return { online: true, message: 'Server is operational' };
      }
      
      const response = await mtServerApi.get('/mt4/status');
      return response.data;
    } catch (error) {
      console.error('Error checking MT4 server status:', error);
      throw error;
    }
  }
};

export const MT5Service = {
  getAccountDetails: async (accountId: string) => {
    try {
      // For development/demo, return mock data
      if (import.meta.env.DEV) {
        console.log('Using mock MT5 account data');
        return getMockAccountDetails('MT5', accountId);
      }
      
      const response = await mtServerApi.get(`/mt5/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching MT5 account details:', error);
      throw error;
    }
  },
  
  transferFunds: async (accountId: string, amount: number, direction: 'deposit' | 'withdraw') => {
    try {
      // For development/demo, simulate success
      if (import.meta.env.DEV) {
        console.log(`Mock ${direction} of ${amount} to MT5 account ${accountId}`);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, message: 'Transfer completed successfully' };
      }
      
      const response = await mtServerApi.post(`/mt5/accounts/${accountId}/transfer`, {
        amount,
        direction
      });
      return response.data;
    } catch (error) {
      console.error('Error transferring funds to/from MT5:', error);
      throw error;
    }
  },
  
  getServerStatus: async () => {
    try {
      // For development/demo, always return online
      if (import.meta.env.DEV) {
        console.log('Using mock MT5 server status');
        return { online: true, message: 'Server is operational' };
      }
      
      const response = await mtServerApi.get('/mt5/status');
      return response.data;
    } catch (error) {
      console.error('Error checking MT5 server status:', error);
      throw error;
    }
  }
};

export const createMTAccount = async (platform: 'mt4' | 'mt5', userData: any) => {
  try {
    // For development/demo, simulate success
    if (import.meta.env.DEV) {
      console.log(`Mock creation of ${platform} account`, userData);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        accountId: `${platform.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        password: `${Math.floor(10000 + Math.random() * 90000)}`,
        server: platform === 'mt4' ? 'Quantis-MT4' : 'Quantis-MT5',
      };
    }
    
    const response = await mtServerApi.post(`/${platform}/accounts`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error creating ${platform.toUpperCase()} account:`, error);
    throw error;
  }
};

export default {
  MT4Service,
  MT5Service,
  createMTAccount
};
