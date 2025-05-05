
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";
import { 
  ArrowUpRight, ArrowDownRight, Circle, CheckCircle, ExternalLink,
  Info, Clock, ArrowRight, AlertCircle, Wallet, DollarSign, CreditCard,
  Loader, RefreshCw, TrendingUp, TrendingDown, BarChart, Shield
} from "lucide-react";
import DashboardHeader from "./dashboard/dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import TradingAccountPanel from "./dashboard/trading-account-panel";
import VerificationStatusPanel from "./dashboard/verification-status-panel";
import DashboardStats from "./dashboard/dashboard-stats";
import SupportChat from "./dashboard/support-chat";
import { TradingService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useMTServer } from "@/hooks/use-mt-server";
import { Progress } from "@/components/ui/progress";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentTab, setCurrentTab] = useState("live");
  const [liveAccount, setLiveAccount] = useState({
    accountId: "QFX7654321",
    type: "Standard",
    leverage: "1:2000",
    equity: 0,
    balance: 0,
    margin: 0,
    platform: "MetaTrader 5",
    currency: "USD",
    openDate: "2023-05-01",
    server: "Quantis-Live",
    isActive: true
  });
  const [demoAccount, setDemoAccount] = useState({
    accountId: "DEMO7654321",
    type: "Demo",
    leverage: "1:2000",
    equity: 0,
    balance: 0,
    margin: 0,
    platform: "MetaTrader 5",
    currency: "USD",
    openDate: "2023-05-01",
    server: "Quantis-Demo",
    isActive: true
  });
  const [marketData, setMarketData] = useState([
    { pair: "EUR/USD", price: "1.0873", change: "-0.01%" },
    { pair: "GBP/USD", price: "1.2543", change: "-0.02%" },
    { pair: "USD/JPY", price: "153.6569", change: "+0.01%" },
    { pair: "BTC/USD", price: "63,154.43", change: "-0.03%" },
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [accountPerformance, setAccountPerformance] = useState({
    daily: Math.random() * 2 - 1, // Random between -1% and 1%
    weekly: Math.random() * 4 - 2, // Random between -2% and 2%
    monthly: Math.random() * 6 - 3 // Random between -3% and 3%
  });
  
  const { toast } = useToast();
  const { serverStatus, checkServerStatus } = useMTServer();
  
  useEffect(() => {
    // Handle responsive sidebar
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    // Use real user data if authenticated
    if (isAuthenticated && user) {
      // Get real account data
      const fetchAccountData = async () => {
        try {
          setIsLoading(true);
          
          // Check MT server status
          await checkServerStatus();
          
          // Fetch real account details from backend
          const accountDetails = await TradingService.getAccountDetails();
          
          // Set live account data based on user's wallet balance and account details
          setLiveAccount(prev => ({
            ...prev,
            leverage: accountDetails.data?.leverage || "1:2000",
            accountType: accountDetails.data?.accountType || "Standard",
            tradingServer: accountDetails.data?.tradingServer || "Quantis-Live",
            equity: user?.walletBalance || 0,
            balance: user?.walletBalance || 0,
            margin: user?.walletBalance ? user.walletBalance * 0.02 : 0
          }));
          
          // Set demo account data based on user's demo balance
          setDemoAccount(prev => ({
            ...prev,
            leverage: accountDetails.data?.leverage || "1:2000",
            accountType: accountDetails.data?.accountType || "Demo",
            tradingServer: accountDetails.data?.tradingServer || "Quantis-Demo",
            equity: user?.demoBalance || 10000,
            balance: user?.demoBalance || 10000,
            margin: user?.demoBalance ? user.demoBalance * 0.01 : 0
          }));
          
          setIsLoading(false);
          
          // Show welcome toast
          toast({
            title: "Welcome back!",
            description: `Good to see you again, ${user.firstName}!`,
          });
        } catch (error) {
          console.error("Error fetching account data:", error);
          setIsLoading(false);
          
          toast({
            variant: "destructive",
            title: "Error fetching account data",
            description: "Could not load your account information. Please try again later."
          });
        }
      };
      
      fetchAccountData();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isAuthenticated, loading, user, navigate, toast, checkServerStatus]);

  const handleDeposit = () => {
    navigate("/deposit");
  };

  const handleWithdraw = () => {
    navigate("/withdraw");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Refresh account details
      const accountDetails = await TradingService.getAccountDetails();
      
      // Fetch wallet balance
      const balanceData = await TradingService.getBalance();
      
      // Update account data
      setLiveAccount(prev => ({
        ...prev,
        equity: balanceData.data?.walletBalance || 0,
        balance: balanceData.data?.walletBalance || 0,
        margin: balanceData.data?.walletBalance ? balanceData.data.walletBalance * 0.02 : 0,
        leverage: accountDetails.data?.leverage || "1:2000",
      }));
      
      setDemoAccount(prev => ({
        ...prev,
        equity: balanceData.data?.demoBalance || 10000,
        balance: balanceData.data?.demoBalance || 10000,
        margin: balanceData.data?.demoBalance ? balanceData.data.demoBalance * 0.01 : 0,
        leverage: accountDetails.data?.leverage || "1:2000",
      }));
      
      toast({
        title: "Data refreshed",
        description: "Your account information has been updated."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Could not update your account information."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced loading screen with branded colors
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2D1B69]">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="h-20 w-20 mx-auto animate-spin border-4 border-[#7C3AED]/20 border-t-[#9D6FFF] rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-[#1A1F2C]/80 flex items-center justify-center">
                  <span className="text-[#9D6FFF] font-bold">Q</span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-lg font-medium text-white">Loading your dashboard...</p>
            <p className="mt-2 text-sm text-gray-300">Please wait while we prepare your trading environment</p>
            <Progress className="mt-4 w-48 h-1.5 bg-[#7C3AED]/20" value={Math.floor(Math.random() * 100)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar isMobile={isMobile} />
        
        <div className={`flex-1 ${!isMobile ? 'md:ml-64' : ''}`}>
          {/* Header */}
          <DashboardHeader marketData={marketData} isMobile={isMobile} />

          {/* Welcome section */}
          <div className="bg-white py-3 px-4 md:px-6 border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium">Welcome back, {user?.firstName || "Trader"}</h2>
                <p className="text-xs text-gray-500">Last login from {user?.countryCode || "US"} at {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs flex items-center"
                  onClick={refreshData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="h-3 w-3 mr-1.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                  )}
                  Refresh
                </Button>
                <div className="text-right text-xs text-gray-500">
                  <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  <p>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 opacity-50">
                {/* Skeleton Loading State */}
                <div className="lg:col-span-2 space-y-5">
                  <Card className="border-0 shadow-sm animate-pulse">
                    <CardHeader className="pb-2 pt-5">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Account Balance and Trading Account Section */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Account Balance Card */}
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                    <CardHeader className="relative z-10 pb-2 pt-5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2">
                            <Wallet className="h-4 w-4 text-[#7C3AED]" />
                          </div>
                          <CardTitle className="text-base">Trading Account</CardTitle>
                        </div>
                        {accountPerformance.monthly > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{accountPerformance.monthly.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            {accountPerformance.monthly.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{formatCurrency(user?.walletBalance || 0)}</h2>
                        <p className="text-xs text-gray-500">total trading balance</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Button 
                          onClick={handleDeposit}
                          size="sm"
                          className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-xs py-1 px-3 h-auto border-0 hover:from-[#6D28D9] hover:to-[#5B21B6] shadow-sm"
                        >
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          Deposit Funds
                        </Button>
                        <Button 
                          onClick={handleWithdraw}
                          size="sm"
                          variant="outline"
                          className="text-xs py-1 px-3 h-auto border-[#7C3AED]/30 text-[#7C3AED] hover:bg-[#7C3AED]/5"
                        >
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                          Withdraw Funds
                        </Button>
                      </div>

                      {/* Enhanced Account Performance */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-50/50 p-3 rounded-md border border-gray-200 mb-4">
                        <h3 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                          <BarChart className="h-3 w-3 mr-1 text-[#7C3AED]" />
                          Account Performance
                        </h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className={`p-2 rounded-md ${accountPerformance.daily >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <p className="text-[10px] mb-1 opacity-80">Daily</p>
                            <p className="text-sm font-semibold flex items-center justify-center">
                              {accountPerformance.daily >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {accountPerformance.daily >= 0 ? '+' : ''}{accountPerformance.daily.toFixed(2)}%
                            </p>
                          </div>
                          <div className={`p-2 rounded-md ${accountPerformance.weekly >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <p className="text-[10px] mb-1 opacity-80">Weekly</p>
                            <p className="text-sm font-semibold flex items-center justify-center">
                              {accountPerformance.weekly >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {accountPerformance.weekly >= 0 ? '+' : ''}{accountPerformance.weekly.toFixed(2)}%
                            </p>
                          </div>
                          <div className={`p-2 rounded-md ${accountPerformance.monthly >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <p className="text-[10px] mb-1 opacity-80">Monthly</p>
                            <p className="text-sm font-semibold flex items-center justify-center">
                              {accountPerformance.monthly >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {accountPerformance.monthly >= 0 ? '+' : ''}{accountPerformance.monthly.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account stats */}
                      <DashboardStats 
                        equity={liveAccount.equity}
                        credit={1000}
                        deposit={user?.walletBalance || 0}
                        formatCurrency={formatCurrency}
                      />
                    </CardContent>
                  </Card>

                  {/* Trading Account Tabs */}
                  <div>
                    <Tabs defaultValue="live" value={currentTab} onValueChange={setCurrentTab} className="w-full">
                      <TabsList className="w-full grid grid-cols-2 h-auto p-0 bg-gray-100 rounded-md mb-2">
                        <TabsTrigger 
                          value="live" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7C3AED] data-[state=active]:to-[#6D28D9] data-[state=active]:text-white text-xs py-2 rounded-l-md"
                        >
                          Live Trading Account
                        </TabsTrigger>
                        <TabsTrigger 
                          value="demo" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7C3AED] data-[state=active]:to-[#6D28D9] data-[state=active]:text-white text-xs py-2 rounded-r-md"
                        >
                          Demo Trading Account
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="live" className="mt-0">
                        <TradingAccountPanel 
                          account={liveAccount}
                          formatCurrency={formatCurrency}
                        />
                      </TabsContent>
                      
                      <TabsContent value="demo" className="mt-0">
                        <TradingAccountPanel 
                          account={demoAccount}
                          formatCurrency={formatCurrency}
                          isDemoAccount={true}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* MT Server Status Card */}
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-blue-50/20 to-transparent rounded-xl"></div>
                    <CardHeader className="relative z-10 py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <CardTitle className="text-sm">Trading Platform Status</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 py-1 px-4 pb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center mr-1.5">
                                <span className="text-[10px] font-semibold text-blue-600">MT4</span>
                              </div>
                              <span className="text-xs font-medium">MetaTrader 4</span>
                            </div>
                            {serverStatus.mt4 ? (
                              <Badge className="bg-green-500 text-[10px]">Online</Badge>
                            ) : (
                              <Badge variant="outline" className="border-red-500 text-red-500 bg-red-50 text-[10px]">Offline</Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center">
                            <Info className="h-2.5 w-2.5 mr-1 text-gray-400" />
                            MT4 server: {liveAccount.server.replace('Quantis', 'Quantis-MT4')}
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center mr-1.5">
                                <span className="text-[10px] font-semibold text-blue-600">MT5</span>
                              </div>
                              <span className="text-xs font-medium">MetaTrader 5</span>
                            </div>
                            {serverStatus.mt5 ? (
                              <Badge className="bg-green-500 text-[10px]">Online</Badge>
                            ) : (
                              <Badge variant="outline" className="border-red-500 text-red-500 bg-red-50 text-[10px]">Offline</Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center">
                            <Info className="h-2.5 w-2.5 mr-1 text-gray-400" />
                            MT5 server: {liveAccount.server.replace('Quantis', 'Quantis-MT5')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Verification Status Section */}
                <div className="space-y-5">
                  <VerificationStatusPanel 
                    user={user}
                  />

                  {/* New Security Tips Card */}
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
                    <CardHeader className="relative z-10 py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-2">
                          <Shield className="h-4 w-4 text-[#7C3AED]" />
                        </div>
                        <CardTitle className="text-sm">Security Tips</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 py-1 px-4 pb-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">Enable two-factor authentication for enhanced account security.</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">Regularly update your password and never share it with anyone.</p>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">Verify all withdrawal requests carefully before confirming.</p>
                        </div>
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">Quantis staff will never ask for your password or full account details.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Support Chat */}
      <SupportChat />
    </div>
  );
};

export default DashboardPage;
