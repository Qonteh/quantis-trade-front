
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
  timeout: 8000, // Increased timeout for better reliability
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

// Mock data for development - enhanced with more stable values
const getMockAccountDetails = (platform, accountId) => {
  // Use consistent mock data to prevent UI flickering
  const baseBalance = accountId.includes('DEMO') ? 10000 : 5000;
  
  return {
    accountId: accountId,
    platform: platform,
    balance: baseBalance,
    equity: baseBalance * 1.05,
    margin: baseBalance * 0.1,
    freeMargin: baseBalance * 0.9,
    marginLevel: 250,
    type: accountId.includes('DEMO') ? 'Demo' : 'Standard',
    leverage: '1:2000',
    currency: 'USD',
    server: platform === 'MT4' ? (accountId.includes('DEMO') ? 'Quantis-Demo-MT4' : 'Quantis-Live-MT4') : 
                                (accountId.includes('DEMO') ? 'Quantis-Demo-MT5' : 'Quantis-Live-MT5'),
    openPositions: 2,
    pendingOrders: 1,
    openDate: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    isActive: true
  };
};

export const MT4Service = {
  getAccountDetails: async (accountId: string) => {
    try {
      // Always return mock data for now to ensure stability
      console.log('Using MT4 account data for', accountId);
      return getMockAccountDetails('MT4', accountId);
    } catch (error) {
      console.error('Error fetching MT4 account details:', error);
      throw error;
    }
  },
  
  transferFunds: async (accountId: string, amount: number, direction: 'deposit' | 'withdraw') => {
    try {
      console.log(`Mock ${direction} of ${amount} to MT4 account ${accountId}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Transfer completed successfully' };
    } catch (error) {
      console.error('Error transferring funds to/from MT4:', error);
      throw error;
    }
  },
  
  getServerStatus: async () => {
    try {
      console.log('Using MT4 server status');
      return { online: true, message: 'Server is operational' };
    } catch (error) {
      console.error('Error checking MT4 server status:', error);
      throw error;
    }
  }
};

export const MT5Service = {
  getAccountDetails: async (accountId: string) => {
    try {
      console.log('Using MT5 account data for', accountId);
      return getMockAccountDetails('MT5', accountId);
    } catch (error) {
      console.error('Error fetching MT5 account details:', error);
      throw error;
    }
  },
  
  transferFunds: async (accountId: string, amount: number, direction: 'deposit' | 'withdraw') => {
    try {
      console.log(`Mock ${direction} of ${amount} to MT5 account ${accountId}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Transfer completed successfully' };
    } catch (error) {
      console.error('Error transferring funds to/from MT5:', error);
      throw error;
    }
  },
  
  getServerStatus: async () => {
    try {
      console.log('Using MT5 server status');
      return { online: true, message: 'Server is operational' };
    } catch (error) {
      console.error('Error checking MT5 server status:', error);
      throw error;
    }
  }
};

const createMTAccount = async (platform: 'mt4' | 'mt5', userData: any) => {
  try {
    console.log(`Mock creation of ${platform} account`, userData);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      accountId: `${platform.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      password: `${Math.floor(10000 + Math.random() * 90000)}`,
      server: platform === 'mt4' ? 'Quantis-MT4' : 'Quantis-MT5',
    };
  } catch (error) {
    console.error(`Error creating ${platform.toUpperCase()} account:`, error);
    throw error;
  }
};

