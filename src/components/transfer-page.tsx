
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { 
  ArrowRightLeft, User, CreditCard, Server, RefreshCw, Loader, 
  Check, Users, Building, Share2
} from "lucide-react";
import DashboardHeader from "./dashboard/dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/hooks/use-wallet";
import { useMTServer } from "@/hooks/use-mt-server";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransferPage: React.FC = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [transferType, setTransferType] = useState("internal");
  
  // Form states for different transfer types
  const [internalTransfer, setInternalTransfer] = useState({
    email: "",
    amount: ""
  });
  
  const [platformTransfer, setPlatformTransfer] = useState({
    platform: "MT4",
    accountId: "",
    amount: "",
    accountType: "live"
  });
  
  const { 
    balanceData, 
    isLoading, 
    transferFunds, 
    transferToPlatform,
    getWalletBalance 
  } = useWallet();
  
  const { 
    serverStatus, 
    checkServerStatus,
    getMT4AccountDetails,
    getMT5AccountDetails
  } = useMTServer();
  
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Load wallet balance & check server status
    getWalletBalance();
    checkServerStatus();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handleInternalTransfer = async () => {
    if (!internalTransfer.email || !internalTransfer.amount || parseFloat(internalTransfer.amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid email and amount"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await transferFunds(internalTransfer.email, parseFloat(internalTransfer.amount));
      setTransferSuccess(true);
      
      // Reset form after successful transfer
      setInternalTransfer({
        email: "",
        amount: ""
      });
      
      setTimeout(() => {
        setTransferSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Transfer error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePlatformTransfer = async () => {
    if (!platformTransfer.accountId || 
        !platformTransfer.amount || 
        parseFloat(platformTransfer.amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid account ID and amount"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await transferToPlatform(
        parseFloat(platformTransfer.amount),
        platformTransfer.platform,
        platformTransfer.accountType === "demo" ? "demo" : "live"
      );
      
      setTransferSuccess(true);
      
      // Reset form after successful transfer
      setPlatformTransfer({
        platform: "MT4",
        accountId: "",
        amount: "",
        accountType: "live"
      });
      
      setTimeout(() => {
        setTransferSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Platform transfer error:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getBalanceBasedOnType = () => {
    if (!balanceData) return 0;
    
    if (transferType === "internal") {
      return balanceData.walletBalance;
    } else {
      // For platform transfers
      return platformTransfer.accountType === "demo" 
        ? balanceData.demoBalance 
        : balanceData.walletBalance;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar isMobile={isMobile} />
        
        <div className={`flex-1 ${!isMobile ? 'md:ml-64' : ''}`}>
          {/* Header */}
          <DashboardHeader
            marketData={[
              { pair: "EUR/USD", price: "1.0873", change: "-0.01%" },
              { pair: "GBP/USD", price: "1.2543", change: "-0.02%" },
              { pair: "USD/JPY", price: "153.6569", change: "+0.01%" },
              { pair: "BTC/USD", price: "63,154.43", change: "-0.03%" },
            ]}
            isMobile={isMobile}
          />

          {/* Page Title */}
          <div className="bg-white py-3 px-4 md:px-6 border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium">Transfer Funds</h2>
                <p className="text-xs text-gray-500">Transfer funds between accounts</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex items-center"
                onClick={getWalletBalance}
                disabled={isLoading.balance}
              >
                {isLoading.balance ? (
                  <Loader className="h-3 w-3 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                )}
                Refresh Balance
              </Button>
            </div>
          </div>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Balance Information */}
              <Card className="border-0 shadow-sm md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading.balance ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <h3 className="text-2xl font-semibold">
                          {formatCurrency(getBalanceBasedOnType())}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {transferType === "internal" ? "Wallet Balance" : 
                           platformTransfer.accountType === "demo" ? "Demo Account Balance" : "Live Account Balance"}
                        </p>
                      </div>
                      {transferType === "platform" && (
                        <div className="bg-blue-50 rounded-md p-3">
                          <p className="text-xs text-blue-700">
                            You are transferring funds to a{" "}
                            <span className="font-medium">
                              {platformTransfer.accountType === "demo" ? "demo" : "live"}
                            </span>{" "}
                            trading account.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {transferSuccess && (
                    <div className="mt-4 bg-green-50 p-3 rounded-md flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Transfer Successful!</p>
                        <p className="text-xs text-green-700 mt-1">
                          Your funds have been transferred successfully.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Transfer Forms */}
              <Card className="border-0 shadow-sm md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-base">Transfer Funds</CardTitle>
                  <CardDescription className="text-xs">
                    Transfer funds to another account or trading platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={transferType} onValueChange={setTransferType}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="internal" className="text-xs">
                        <Users className="h-3.5 w-3.5 mr-2" />
                        Internal Transfer
                      </TabsTrigger>
                      <TabsTrigger value="platform" className="text-xs">
                        <Server className="h-3.5 w-3.5 mr-2" />
                        Platform Transfer
                      </TabsTrigger>
                      <TabsTrigger value="bank" className="text-xs">
                        <Building className="h-3.5 w-3.5 mr-2" />
                        Bank Transfer
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Internal Transfer */}
                    <TabsContent value="internal" className="space-y-4 mt-4">
                      <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-md border border-violet-100 mb-4">
                        <h3 className="font-medium text-sm text-violet-800 flex items-center mb-2">
                          <Share2 className="h-4 w-4 mr-2 text-violet-600" />
                          Transfer to Another User
                        </h3>
                        <p className="text-xs text-violet-700">
                          Send funds to another {import.meta.env.VITE_BROKER_NAME || "Quantis"} user instantly. 
                          You only need their registered email address.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label htmlFor="recipientEmail" className="text-xs">Recipient Email</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              id="recipientEmail"
                              placeholder="Enter recipient email address"
                              className="pl-10"
                              type="email"
                              value={internalTransfer.email}
                              onChange={(e) => setInternalTransfer({...internalTransfer, email: e.target.value})}
                              disabled={isProcessing}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="internalAmount" className="text-xs">Amount to Transfer</Label>
                          <div className="relative">
                            <div className="absolute left-3 top-2.5 text-gray-500">$</div>
                            <Input
                              id="internalAmount"
                              placeholder="0.00"
                              className="pl-8"
                              type="number"
                              value={internalTransfer.amount}
                              onChange={(e) => setInternalTransfer({...internalTransfer, amount: e.target.value})}
                              disabled={isProcessing}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Available balance: {formatCurrency(balanceData?.walletBalance || 0)}
                          </p>
                        </div>
                        <Button 
                          className="w-full mt-4 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9]"
                          onClick={handleInternalTransfer}
                          disabled={isProcessing || !internalTransfer.email || !internalTransfer.amount || parseFloat(internalTransfer.amount) <= 0}
                        >
                          {isProcessing ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ArrowRightLeft className="mr-2 h-4 w-4" />
                              Transfer Funds
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                    
                    {/* Platform Transfer */}
                    <TabsContent value="platform" className="space-y-4 mt-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100 mb-4">
                        <h3 className="font-medium text-sm text-blue-800 flex items-center mb-2">
                          <Server className="h-4 w-4 mr-2 text-blue-600" />
                          Trading Platform Transfer
                        </h3>
                        <p className="text-xs text-blue-700">
                          Transfer funds to your MT4/MT5 trading accounts. 
                          Your funds will be available for trading immediately.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="platform" className="text-xs">Platform</Label>
                            <Select
                              value={platformTransfer.platform}
                              onValueChange={(value) => setPlatformTransfer({...platformTransfer, platform: value})}
                              disabled={isProcessing}
                            >
                              <SelectTrigger id="platform" className="w-full">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MT4">MetaTrader 4</SelectItem>
                                <SelectItem value="MT5">MetaTrader 5</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accountType" className="text-xs">Account Type</Label>
                            <Select
                              value={platformTransfer.accountType}
                              onValueChange={(value) => setPlatformTransfer({...platformTransfer, accountType: value})}
                              disabled={isProcessing}
                            >
                              <SelectTrigger id="accountType" className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="live">Live Account</SelectItem>
                                <SelectItem value="demo">Demo Account</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="accountId" className="text-xs">Account ID</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              id="accountId"
                              placeholder="Enter MT4/MT5 account ID"
                              className="pl-10"
                              value={platformTransfer.accountId}
                              onChange={(e) => setPlatformTransfer({...platformTransfer, accountId: e.target.value})}
                              disabled={isProcessing}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="platformAmount" className="text-xs">Amount to Transfer</Label>
                          <div className="relative">
                            <div className="absolute left-3 top-2.5 text-gray-500">$</div>
                            <Input
                              id="platformAmount"
                              placeholder="0.00"
                              className="pl-8"
                              type="number"
                              value={platformTransfer.amount}
                              onChange={(e) => setPlatformTransfer({...platformTransfer, amount: e.target.value})}
                              disabled={isProcessing}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Available balance: {formatCurrency(
                              platformTransfer.accountType === "demo" 
                                ? balanceData?.demoBalance || 0
                                : balanceData?.walletBalance || 0
                            )}
                          </p>
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9]"
                            onClick={handlePlatformTransfer}
                            disabled={
                              isProcessing || 
                              !platformTransfer.accountId || 
                              !platformTransfer.amount || 
                              parseFloat(platformTransfer.amount) <= 0
                            }
                          >
                            {isProcessing ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                Transfer to Platform
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Bank Transfer (Placeholder) */}
                    <TabsContent value="bank" className="space-y-4 mt-4">
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-md border border-amber-100 mb-4">
                        <h3 className="font-medium text-sm text-amber-800 flex items-center mb-2">
                          <Building className="h-4 w-4 mr-2 text-amber-600" />
                          Bank Wire Transfer
                        </h3>
                        <p className="text-xs text-amber-700">
                          Transfer funds to your bank account via wire transfer.
                          Processing may take 1-3 business days.
                        </p>
                      </div>
                      
                      <div className="text-center py-12">
                        <Server className="h-12 w-12 mx-auto text-gray-300" />
                        <h3 className="mt-4 text-base font-medium text-gray-600">Coming Soon</h3>
                        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                          Bank wire transfer functionality is currently under development.
                          Please use our withdrawal system to send funds to your bank account.
                        </p>
                        <Button 
                          className="mt-4"
                          variant="outline"
                          onClick={() => window.location.href = '/withdraw'}
                        >
                          Go to Withdrawals
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
