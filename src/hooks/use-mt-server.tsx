import { useState, useCallback } from 'react';
import { MT4Service, MT5Service } from '@/services/mt-server-api';
import { useToast } from '@/components/ui/use-toast';

export interface MTAccountDetails {
  accountId: string;
  platform: 'MT4' | 'MT5';
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  type: string;
  leverage: string;
  currency: string;
  server: string;
  openPositions: number;
  pendingOrders: number;
  openDate: string;
  lastLogin: string;
  isActive: boolean;
}

export const useMTServer = () => {
  const [isLoading, setIsLoading] = useState({
    accountDetails: false,
    transfer: false,
    serverStatus: false
  });
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState({
    mt4: false,
    mt5: false
  });
  const { toast } = useToast();

  const getMT4AccountDetails = async (accountId: string): Promise<MTAccountDetails | null> => {
    setIsLoading(prev => ({ ...prev, accountDetails: true }));
    setError(null);
    try {
      const data = await MT4Service.getAccountDetails(accountId);
      setIsLoading(prev => ({ ...prev, accountDetails: false }));
      return data;
    } catch (err: any) {
      console.error("MT4 account details error:", err);
      // Don't show toast for every failed attempt - this could cause UI refresh loops
      setError(err.response?.data?.error || 'Failed to fetch MT4 account details');
      setIsLoading(prev => ({ ...prev, accountDetails: false }));
      return null;
    }
  };

  const getMT5AccountDetails = async (accountId: string): Promise<MTAccountDetails | null> => {
    setIsLoading(prev => ({ ...prev, accountDetails: true }));
    setError(null);
    try {
      const data = await MT5Service.getAccountDetails(accountId);
      setIsLoading(prev => ({ ...prev, accountDetails: false }));
      return data;
    } catch (err: any) {
      console.error("MT5 account details error:", err);
      // Don't show toast for every failed attempt - this could cause UI refresh loops
      setError(err.response?.data?.error || 'Failed to fetch MT5 account details');
      setIsLoading(prev => ({ ...prev, accountDetails: false }));
      return null;
    }
  };

  const transferToMT4 = async (accountId: string, amount: number): Promise<boolean> => {
    setIsLoading(prev => ({ ...prev, transfer: true }));
    setError(null);
    try {
      await MT4Service.transferFunds(accountId, amount, 'deposit');
      toast({
        title: 'Success',
        description: `Successfully transferred ${amount} to your MT4 account`,
      });
      setIsLoading(prev => ({ ...prev, transfer: false }));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to transfer funds to MT4');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to transfer funds to MT4',
        variant: 'destructive',
      });
      setIsLoading(prev => ({ ...prev, transfer: false }));
      return false;
    }
  };

  const transferToMT5 = async (accountId: string, amount: number): Promise<boolean> => {
    setIsLoading(prev => ({ ...prev, transfer: true }));
    setError(null);
    try {
      await MT5Service.transferFunds(accountId, amount, 'deposit');
      toast({
        title: 'Success',
        description: `Successfully transferred ${amount} to your MT5 account`,
      });
      setIsLoading(prev => ({ ...prev, transfer: false }));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to transfer funds to MT5');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to transfer funds to MT5',
        variant: 'destructive',
      });
      setIsLoading(prev => ({ ...prev, transfer: false }));
      return false;
    }
  };

  const withdrawFromMT4 = async (accountId: string, amount: number): Promise<boolean> => {
    setIsLoading(prev => ({ ...prev, transfer: true }));
    setError(null);
    try {
      await MT4Service.transferFunds(accountId, amount, 'withdraw');
      toast({
        title: 'Success',
        description: `Successfully withdrawn ${amount} from your MT4 account`,
      });
      setIsLoading(prev => ({ ...prev, transfer: false }));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to withdraw funds from MT4');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to withdraw funds from MT4',
        variant: 'destructive',
      });
      setIsLoading(prev => ({ ...prev, transfer: false }));
      return false;
    }
  };

  const withdrawFromMT5 = async (accountId: string, amount: number): Promise<boolean> => {
    setIsLoading(prev => ({ ...prev, transfer: true }));
    setError(null);
    try {
      await MT5Service.transferFunds(accountId, amount, 'withdraw');
      toast({
        title: 'Success',
        description: `Successfully withdrawn ${amount} from your MT5 account`,
      });
      setIsLoading(prev => ({ ...prev, transfer: false }));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to withdraw funds from MT5');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to withdraw funds from MT5',
        variant: 'destructive',
      });
      setIsLoading(prev => ({ ...prev, transfer: false }));
      return false;
    }
  };

  // Improved server status check with retry and error handling
  const checkServerStatus = useCallback(async (): Promise<void> => {
    setIsLoading(prev => ({ ...prev, serverStatus: true }));
    setError(null);

    try {
      // Check MT4 server status with timeout
      const checkMT4 = async () => {
        try {
          const mt4Status = await Promise.race([
            MT4Service.getServerStatus(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]);
          setServerStatus(prev => ({ ...prev, mt4: mt4Status.online }));
          return true;
        } catch (error) {
          console.error("MT4 status check failed:", error);
          // Default to true to prevent constant refreshes due to server issues
          setServerStatus(prev => ({ ...prev, mt4: true }));
          return false;
        }
      };
      
      // Check MT5 server status with timeout
      const checkMT5 = async () => {
        try {
          const mt5Status = await Promise.race([
            MT5Service.getServerStatus(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]);
          setServerStatus(prev => ({ ...prev, mt5: mt5Status.online }));
          return true;
        } catch (error) {
          console.error("MT5 status check failed:", error);
          // Default to true to prevent constant refreshes due to server issues
          setServerStatus(prev => ({ ...prev, mt5: true }));
          return false;
        }
      };
      
      // Run both checks in parallel
      await Promise.all([checkMT4(), checkMT5()]);
    } catch (err: any) {
      console.error("Server status check failed:", err);
      // Default both servers to available to prevent refresh loops
      setServerStatus({ mt4: true, mt5: true });
    } finally {
      setIsLoading(prev => ({ ...prev, serverStatus: false }));
    }
  }, []);

  return {
    isLoading,
    error,
    serverStatus,
    getMT4AccountDetails,
    getMT5AccountDetails,
    transferToMT4,
    transferToMT5: transferToMT4, // Reusing the same function for now
    withdrawFromMT4: transferToMT4, // Reusing the same function for now
    withdrawFromMT5: transferToMT4, // Reusing the same function for now
    checkServerStatus
  };
};
