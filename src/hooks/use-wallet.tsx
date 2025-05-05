
import { useState, useEffect } from "react";
import { TradingService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type WalletBalanceData = {
  walletBalance: number;
  demoBalance: number;
};

type TransactionData = {
  id: number;
  type: string;
  amount: number;
  status: string;
  reference: string;
  createdAt: string;
  relatedUserId?: number;
  metadata?: any;
};

export const currencyOptions = [
  { value: "USD", label: "USD - US Dollar", icon: "DollarSign" },
  { value: "EUR", label: "EUR - Euro", icon: "Euro" },
  { value: "GBP", label: "GBP - British Pound", icon: "PoundSterling" },
  { value: "JPY", label: "JPY - Japanese Yen", icon: "Yen" },
  { value: "BTC", label: "BTC - Bitcoin", icon: "Bitcoin" },
];

export const useWallet = () => {
  const [balanceData, setBalanceData] = useState<WalletBalanceData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState({
    balance: false,
    transactions: false,
    deposit: false,
    withdraw: false,
    transfer: false,
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getWalletBalance = async () => {
    setIsLoading(prev => ({ ...prev, balance: true }));
    setError(null);
    try {
      const response = await TradingService.getBalance();
      setBalanceData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch wallet balance");
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to fetch wallet balance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, balance: false }));
    }
  };

  const getTransactionHistory = async () => {
    setIsLoading(prev => ({ ...prev, transactions: true }));
    setError(null);
    try {
      const response = await TradingService.getTransactionHistory();
      setTransactions(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch transaction history");
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to fetch transaction history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const depositFunds = async (amount: number) => {
    setIsLoading(prev => ({ ...prev, deposit: true }));
    setError(null);
    try {
      const response = await TradingService.deposit(amount);
      toast({
        title: "Success",
        description: `Successfully deposited ${amount} to your account`,
      });
      // Refresh balance after deposit
      getWalletBalance();
      getTransactionHistory();
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to deposit funds";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, deposit: false }));
    }
  };

  const withdrawFunds = async (amount: number) => {
    setIsLoading(prev => ({ ...prev, withdraw: true }));
    setError(null);
    try {
      const response = await TradingService.withdraw(amount);
      toast({
        title: "Success",
        description: `Successfully withdrawn ${amount} from your account`,
      });
      // Refresh balance after withdrawal
      getWalletBalance();
      getTransactionHistory();
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to withdraw funds";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  const transferFunds = async (toEmail: string, amount: number) => {
    setIsLoading(prev => ({ ...prev, transfer: true }));
    setError(null);
    try {
      const response = await TradingService.transfer(toEmail, amount);
      toast({
        title: "Success",
        description: `Successfully transferred ${amount} to ${toEmail}`,
      });
      // Refresh balance after transfer
      getWalletBalance();
      getTransactionHistory();
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to transfer funds";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, transfer: false }));
    }
  };

  const transferToPlatform = async (amount: number, platform: string, accountType: 'live' | 'demo') => {
    setIsLoading(prev => ({ ...prev, transfer: true }));
    setError(null);
    try {
      const response = await TradingService.transferToPlatform(amount, platform, accountType);
      toast({
        title: "Success",
        description: `Successfully transferred ${amount} to ${platform} ${accountType} account`,
      });
      // Refresh balance after transfer
      getWalletBalance();
      getTransactionHistory();
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to transfer funds to platform";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, transfer: false }));
    }
  };

  useEffect(() => {
    getWalletBalance();
    getTransactionHistory();
  }, []);

  return {
    balanceData,
    transactions,
    isLoading,
    error,
    getWalletBalance,
    getTransactionHistory,
    depositFunds,
    withdrawFunds,
    transferFunds,
    transferToPlatform,
  };
};
