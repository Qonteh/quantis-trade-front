"use client";

import { useState, useEffect } from "react";
import {
  Wallet, ArrowDownToLine, ArrowUpFromLine, RefreshCw, 
  DollarSign, CreditCard, Clock, Search, Filter, 
  ChevronDown, Download, Shield, AlertCircle, CheckCircle2, 
  Plus, ExternalLink, Trash2, Edit, Copy, Bitcoin, 
  Banknote, Euro, PoundSterling, JapaneseYenIcon as Yen
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/UserContext";
import { useWallet, currencyOptions } from "@/hooks/use-wallet";
import { TradingService } from "@/services/api";

// Logo component to ensure consistent styling
const QuantisLogo = ({ className = "", darkMode = false }) => (
  <div className={`flex items-baseline ${className}`}>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold`}>Q</span>
    <span className={`${darkMode ? "text-white" : "text-black"} font-bold`}>uantis</span>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold text-xs translate-y-[-8px] ml-[1px]`}>FX</span>
  </div>
);

// Map transaction types to appropriate display values and colors
const transactionTypeConfig = {
  deposit: {
    label: "Deposit",
    color: "border-green-500 text-green-600 bg-green-50",
    prefix: "+",
    textColor: "text-green-600",
  },
  withdraw: {
    label: "Withdraw",
    color: "border-red-500 text-red-600 bg-red-50",
    prefix: "-",
    textColor: "text-red-600",
  },
  transfer_in: {
    label: "Received",
    color: "border-green-500 text-green-600 bg-green-50",
    prefix: "+",
    textColor: "text-green-600",
  },
  transfer_out: {
    label: "Sent",
    color: "border-red-500 text-red-600 bg-red-50",
    prefix: "-",
    textColor: "text-red-600",
  },
  platform_transfer_live: {
    label: "To Live Account",
    color: "border-blue-500 text-blue-600 bg-blue-50",
    prefix: "",
    textColor: "text-blue-600",
  },
  platform_transfer_demo: {
    label: "To Demo Account",
    color: "border-purple-500 text-purple-600 bg-purple-50",
    prefix: "",
    textColor: "text-purple-600",
  },
};

// Sample payment methods - we'll keep these for now as they're UI-only
const paymentMethods = [
  {
    id: 1,
    name: "Bank Account",
    type: "Bank Transfer",
    details: "•••• 4567",
    bank: "Chase Bank",
    isDefault: true,
    icon: Banknote,
  },
  {
    id: 2,
    name: "Credit Card",
    type: "Visa",
    details: "•••• 8912",
    expiry: "09/27",
    isDefault: false,
    icon: CreditCard,
  },
  {
    id: 3,
    name: "Bitcoin Wallet",
    type: "Cryptocurrency",
    details: "bc1q•••••••••••••••",
    isDefault: false,
    icon: Bitcoin,
  },
];

const formatCurrency = (value: number, currency = "USD") => {
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: currency === "BTC" ? 8 : 2,
      maximumFractionDigits: currency === "BTC" ? 8 : 2,
    });
    return formatter.format(value);
  } catch (error) {
    // Fallback in case of invalid currency
    return `${currency} ${value.toFixed(2)}`;
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return "Invalid date";
  }
};

// Helper to get an icon component based on currency
const getCurrencyIcon = (currency: string) => {
  switch (currency) {
    case "USD":
      return DollarSign;
    case "EUR":
      return Euro;
    case "GBP":
      return PoundSterling;
    case "JPY":
      return Yen;
    case "BTC":
      return Bitcoin;
    default:
      return DollarSign;
  }
};

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("balances");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferFrom, setTransferFrom] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferCurrency, setTransferCurrency] = useState("USD");
  const [isPlatformTransferDialogOpen, setIsPlatformTransferDialogOpen] = useState(false);
  const [platformTransferAmount, setPlatformTransferAmount] = useState("");
  const [platformTransferType, setPlatformTransferType] = useState<"live" | "demo">("live");
  const [platformName, setPlatformName] = useState("MT5");

  const { user } = useAuth();
  const { 
    balanceData, 
    transactions, 
    isLoading, 
    transferToPlatform, 
    transferFunds,
    getWalletBalance,
    getTransactionHistory
  } = useWallet();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Define our wallet balances based on real data
  const walletBalances = [
    {
      id: 1,
      currency: "USD",
      name: "US Dollar",
      balance: balanceData?.walletBalance || 0,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      change: "+0.0%", // In a real app, we'd calculate this from historical data
      trend: "up",
    },
    {
      id: 2,
      currency: "DEMO",
      name: "Demo Balance",
      balance: balanceData?.demoBalance || 0,
      icon: DollarSign,
      color: "bg-blue-100 text-blue-600",
      change: "0.0%",
      trend: "none",
    },
  ];

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const txType = transaction.type.toLowerCase();
    const txStatus = transaction.status.toLowerCase();
    const txReference = transaction.reference?.toLowerCase() || "";
    
    const matchesSearch =
      searchQuery === "" ||
      txReference.includes(searchQuery.toLowerCase()) ||
      txType.includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || txStatus === filterStatus.toLowerCase();
    const matchesType = filterType === "all" || txType.includes(filterType.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle transfer submission
  const handleTransferSubmit = async () => {
    try {
      const amount = parseFloat(transferAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount greater than 0",
          variant: "destructive",
        });
        return;
      }

      // In a real app, we'd get the recipient email from the selected account
      // For now, we'll use a placeholder
      const recipientEmail = "recipient@example.com";
      await transferFunds(recipientEmail, amount);
      
      setIsTransferDialogOpen(false);
      // Reset form
      setTransferAmount("");
      setTransferFrom("");
      setTransferTo("");
      setTransferCurrency("USD");
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  // Handle platform transfer submission
  const handlePlatformTransferSubmit = async () => {
    try {
      const amount = parseFloat(platformTransferAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount greater than 0",
          variant: "destructive",
        });
        return;
      }

      await transferToPlatform(amount, platformName, platformTransferType);
      
      setIsPlatformTransferDialogOpen(false);
      // Reset form
      setPlatformTransferAmount("");
    } catch (error) {
      console.error("Platform transfer failed:", error);
    }
  };

  // Handle navigation to deposit/withdraw pages
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "balances") {
        getWalletBalance();
      } else if (activeTab === "transactions") {
        getTransactionHistory();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Wallet</h1>
            <p className="text-sm text-gray-500">Manage your funds and payment methods</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-4 pb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                    <ArrowDownToLine className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <CardTitle className="text-sm">Deposit Funds</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4 pt-2">
                <p className="text-xs text-gray-500 mb-3">Add funds to your trading account quickly and securely</p>
                <Button
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-8 text-xs"
                  onClick={() => handleNavigation("/deposit")}
                >
                  Deposit Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-4 pb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                    <ArrowUpFromLine className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <CardTitle className="text-sm">Withdraw Funds</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4 pt-2">
                <p className="text-xs text-gray-500 mb-3">Withdraw funds from your trading account to your bank</p>
                <Button
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-8 text-xs"
                  onClick={() => handleNavigation("/withdraw")}
                >
                  Withdraw Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-4 pb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                    <RefreshCw className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <CardTitle className="text-sm">Trading Platform Transfer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4 pt-2">
                <p className="text-xs text-gray-500 mb-3">Transfer funds to your MT4/MT5 trading platform</p>
                <Dialog open={isPlatformTransferDialogOpen} onOpenChange={setIsPlatformTransferDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-8 text-xs">Transfer to Platform</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Platform Transfer</DialogTitle>
                      <DialogDescription>Transfer funds to your trading platform account.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="platform-transfer-amount">Amount</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input
                            id="platform-transfer-amount"
                            type="number"
                            placeholder="Enter amount"
                            className="pl-10"
                            value={platformTransferAmount}
                            onChange={(e) => setPlatformTransferAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="platform">Trading Platform</Label>
                        <Select value={platformName} onValueChange={setPlatformName}>
                          <SelectTrigger id="platform">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="MT4">MetaTrader 4</SelectItem>
                              <SelectItem value="MT5">MetaTrader 5</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="account-type">Account Type</Label>
                        <Select 
                          value={platformTransferType} 
                          onValueChange={(value: "live" | "demo") => setPlatformTransferType(value)}
                        >
                          <SelectTrigger id="account-type">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="live">Live Account</SelectItem>
                              <SelectItem value="demo">Demo Account</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                        onClick={handlePlatformTransferSubmit}
                        disabled={isLoading.transfer || !platformTransferAmount || parseFloat(platformTransferAmount) <= 0}
                      >
                        {isLoading.transfer ? "Processing..." : "Transfer Funds"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="balances" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="balances" className="text-xs">
                Wallet Balances
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs">
                Transaction History
              </TabsTrigger>
              <TabsTrigger value="payment-methods" className="text-xs">
                Payment Methods
              </TabsTrigger>
            </TabsList>

            {/* Wallet Balances Tab */}
            <TabsContent value="balances" className="space-y-4">
              {isLoading.balance ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2].map((item) => (
                    <Card key={item} className="border-none shadow-sm overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                      <CardHeader className="relative z-10 p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="ml-2.5">
                              <Skeleton className="h-5 w-20" />
                              <Skeleton className="h-4 w-16 mt-1" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-12" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10 p-4 pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Skeleton className="h-7 flex-1" />
                          <Skeleton className="h-7 flex-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {walletBalances.map((wallet) => (
                    <Card key={wallet.id} className="border-none shadow-sm overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                      <CardHeader className="relative z-10 p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full ${wallet.color} flex items-center justify-center mr-2.5`}>
                              <wallet.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <CardTitle className="text-sm">{wallet.currency}</CardTitle>
                              <CardDescription className="text-xs">{wallet.name}</CardDescription>
                            </div>
                          </div>
                          {wallet.trend !== "none" && (
                            <Badge
                              variant={wallet.trend === "up" ? "default" : "outline"}
                              className={
                                wallet.trend === "up"
                                  ? "bg-green-500 hover:bg-green-600 text-[10px]"
                                  : "border-red-500 text-red-500 bg-red-50 text-[10px]"
                              }
                            >
                              {wallet.change}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10 p-4 pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500">Available Balance</span>
                          <span className="text-sm font-bold">{formatCurrency(wallet.balance)}</span>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          {wallet.currency !== "DEMO" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-7 text-xs border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
                                onClick={() => handleNavigation("/deposit")}
                              >
                                <ArrowDownToLine className="h-3 w-3 mr-1" />
                                Deposit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-7 text-xs border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
                                onClick={() => handleNavigation("/withdraw")}
                              >
                                <ArrowUpFromLine className="h-3 w-3 mr-1" />
                                Withdraw
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 h-7 text-xs border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
                              onClick={() => {
                                setPlatformTransferType("demo");
                                setIsPlatformTransferDialogOpen(true);
                              }}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Transfer to MT5
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Security Notice */}
              <Card className="border-none shadow-sm overflow-hidden mt-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50/50 to-transparent rounded-xl"></div>
                <CardHeader className="relative z-10 p-4 pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2.5">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-sm">Wallet Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-4 pt-2">
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600">
                      Your funds are securely held in segregated accounts with a leverage of 1:2000. We employ industry-leading security measures
                      to protect your assets.
                    </p>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      <span>Two-factor authentication {user?.isVerified ? "enabled" : "recommended"}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      <span>Funds held in segregated accounts</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      <span>Regular security audits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transaction History Tab */}
            <TabsContent value="transactions" className="space-y-4">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                <CardHeader className="relative z-10 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center">
                      <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search transactions..."
                          className="pl-9 h-9 md:w-64 text-xs"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="h-9 text-xs w-[130px]">
                          <div className="flex items-center">
                            <Filter className="mr-2 h-3.5 w-3.5" />
                            <span>{filterType === "all" ? "All Types" : filterType}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="withdraw">Withdraw</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                          <SelectItem value="platform">Platform</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-9 text-xs w-[130px]">
                          <div className="flex items-center">
                            <Filter className="mr-2 h-3.5 w-3.5" />
                            <span>{filterStatus === "all" ? "All Status" : filterStatus}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="sm" className="h-9 text-xs">
                        <Download className="mr-2 h-3.5 w-3.5" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-4 pt-0">
                  <div className="rounded-lg overflow-hidden border border-gray-100">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-[10px] font-medium py-2">Type</TableHead>
                          <TableHead className="text-[10px] font-medium py-2">Reference</TableHead>
                          <TableHead className="text-[10px] font-medium py-2">Date</TableHead>
                          <TableHead className="text-[10px] font-medium py-2">Status</TableHead>
                          <TableHead className="text-[10px] font-medium py-2 text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading.transactions ? (
                          // Loading state
                          Array(5).fill(0).map((_, index) => (
                            <TableRow key={`loading-${index}`} className="hover:bg-gray-50">
                              <TableCell className="py-1.5">
                                <Skeleton className="h-5 w-16" />
                              </TableCell>
                              <TableCell className="py-1.5">
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell className="py-1.5">
                                <Skeleton className="h-4 w-32" />
                              </TableCell>
                              <TableCell className="py-1.5">
                                <Skeleton className="h-5 w-16" />
                              </TableCell>
                              <TableCell className="py-1.5 text-right">
                                <Skeleton className="h-4 w-16 ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : filteredTransactions.length > 0 ? (
                          filteredTransactions.map((transaction) => {
                            const typeConfig = transactionTypeConfig[transaction.type as keyof typeof transactionTypeConfig] || {
                              label: transaction.type,
                              color: "border-gray-500 text-gray-600 bg-gray-50",
                              prefix: "",
                              textColor: "",
                            };
                            
                            return (
                              <TableRow key={transaction.id} className="hover:bg-gray-50">
                                <TableCell className="py-1.5">
                                  <Badge variant="outline" className={typeConfig.color}>
                                    <span className="text-[10px]">{typeConfig.label}</span>
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-1.5 text-xs">{transaction.reference || "-"}</TableCell>
                                <TableCell className="py-1.5 text-xs">{formatDate(transaction.createdAt)}</TableCell>
                                <TableCell className="py-1.5">
                                  <Badge
                                    variant="outline"
                                    className={
                                      transaction.status === "completed"
                                        ? "border-green-500 text-green-600 bg-green-50"
                                        : transaction.status === "pending"
                                          ? "border-amber-500 text-amber-600 bg-amber-50"
                                          : "border-red-500 text-red-600 bg-red-50"
                                    }
                                  >
                                    <span className="text-[10px]">{transaction.status}</span>
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-1.5 text-right text-xs">
                                  <span className={typeConfig.textColor}>
                                    {typeConfig.prefix}
                                    {formatCurrency(transaction.amount)}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                  <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">No transactions found</p>
                                <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="relative z-10 border-t pt-3 p-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Showing <span className="font-medium">{filteredTransactions.length}</span> of{" "}
                    <span className="font-medium">{transactions.length}</span> transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="payment-methods" className="space-y-4">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                <CardHeader className="relative z-10 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Saved Payment Methods</CardTitle>
                    <Button size="sm" className="h-8 text-xs bg-[#7C3AED] hover:bg-[#6D28D9]">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add New Method
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-4 pt-0">
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-3">
                            <method.icon className="h-5 w-5 text-[#7C3AED]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{method.name}</p>
                            <div className="flex items-center">
                              <p className="text-xs text-gray-500">
                                {method.type} • {method.details}
                              </p>
                              {method.isDefault && (
                                <Badge className="ml-2 bg-[#7C3AED] text-[10px] px-1.5 py-0">Default</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#7C3AED]">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Add New Payment Method Card */}
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 transition-colors cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <Plus className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Add New Payment Method</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Add a new card, bank account, or cryptocurrency wallet
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-50/50 to-transparent rounded-xl"></div>
                <CardHeader className="relative z-10 p-4 pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2.5">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <CardTitle className="text-sm">Important Notice</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-4 pt-2">
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600">
                      For your security, we only process withdrawals to payment methods that are registered under your
                      name. Third-party withdrawals are not permitted.
                    </p>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      <span>All payment methods must be verified before use</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      <span>Your data is encrypted and securely stored</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      <span>We comply with global financial regulations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
