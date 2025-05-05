
import axios from 'axios';

// Use the MT server API URL from environment variables
const MT_API_URL = import.meta.env.VITE_MT_SERVER_URL || 'https://mt-server-api.quantisfx.com/api';
const MT_API_KEY = import.meta.env.VITE_MT_SERVER_API_KEY;

// Create axios instance for MT server communications
const mtServerApi = axios.create({
  baseURL: MT_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': MT_API_KEY,
  },
  timeout: 30000,
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

// Add response interceptor for better error handling
mtServerApi.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error('MT Server API Error: Unable to connect to MT server.');
      return Promise.reject({
        response: {
          data: {
            error: 'Unable to connect to MT server. Please check your connection.'
          }
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export const MT4Service = {
  getAccountDetails: async (accountId: string) => {
    try {
      const response = await mtServerApi.get(`/mt4/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching MT4 account details:', error);
      throw error;
    }
  },
  
  transferFunds: async (accountId: string, amount: number, direction: 'deposit' | 'withdraw') => {
    try {
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
      const response = await mtServerApi.get(`/mt5/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching MT5 account details:', error);
      throw error;
    }
  },
  
  transferFunds: async (accountId: string, amount: number, direction: 'deposit' | 'withdraw') => {
    try {
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
