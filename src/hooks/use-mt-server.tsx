
import { useState } from 'react';
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
      setError(err.response?.data?.error || 'Failed to fetch MT4 account details');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to fetch MT4 account details',
        variant: 'destructive',
      });
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
      setError(err.response?.data?.error || 'Failed to fetch MT5 account details');
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to fetch MT5 account details',
        variant: 'destructive',
      });
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

  const checkServerStatus = async (): Promise<void> => {
    setIsLoading(prev => ({ ...prev, serverStatus: true }));
    setError(null);

    try {
      // Check MT4 server status
      const mt4Status = await MT4Service.getServerStatus();
      setServerStatus(prev => ({ ...prev, mt4: mt4Status.online }));
      
      // Check MT5 server status
      const mt5Status = await MT5Service.getServerStatus();
      setServerStatus(prev => ({ ...prev, mt5: mt5Status.online }));
    } catch (err: any) {
      setError('Failed to check server status');
      toast({
        title: 'Error',
        description: 'Failed to check MT server status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, serverStatus: false }));
    }
  };

  return {
    isLoading,
    error,
    serverStatus,
    getMT4AccountDetails,
    getMT5AccountDetails,
    transferToMT4,
    transferToMT5,
    withdrawFromMT4,
    withdrawFromMT5,
    checkServerStatus
  };
};
