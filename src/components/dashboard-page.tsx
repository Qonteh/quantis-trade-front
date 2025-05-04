
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";
import { 
  ArrowUpRight, ArrowDownRight, Circle, CheckCircle, ExternalLink,
  Info, Clock, ArrowRight, AlertCircle, Wallet, DollarSign, CreditCard,
  Loader
} from "lucide-react";
import DashboardHeader from "./dashboard/dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import TradingAccountPanel from "./dashboard/trading-account-panel";
import VerificationStatusPanel from "./dashboard/verification-status-panel";
import DashboardStats from "./dashboard/dashboard-stats";
import SupportChat from "./dashboard/support-chat";
import { TradingService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentTab, setCurrentTab] = useState("live");
  const [liveAccount, setLiveAccount] = useState({
    accountId: "QFX7654321",
    type: "Standard",
    leverage: "1:100",
    equity: 0,
    balance: 0,
    margin: 0,
    platform: "MetaTrader 5",
    currency: "USD",
    openDate: "2023-05-01",
    server: "Quantis FX-Live",
    isActive: true
  });
  const [demoAccount, setDemoAccount] = useState({
    accountId: "DEMO7654321",
    type: "Demo",
    leverage: "1:500",
    equity: 0,
    balance: 0,
    margin: 0,
    platform: "MetaTrader 5",
    currency: "USD",
    openDate: "2023-05-01",
    server: "Quantis FX-Demo",
    isActive: true
  });
  const [marketData, setMarketData] = useState([
    { pair: "EUR/USD", price: "1.0873", change: "-0.01%" },
    { pair: "GBP/USD", price: "1.2543", change: "-0.02%" },
    { pair: "USD/JPY", price: "153.6569", change: "+0.01%" },
    { pair: "BTC/USD", price: "63,154.43", change: "-0.03%" },
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
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
          
          // Simulate API call delay
          setTimeout(() => {
            // Set live account data based on user's wallet balance
            setLiveAccount(prev => ({
              ...prev,
              equity: user?.walletBalance || 0,
              balance: user?.walletBalance || 0,
              margin: user?.walletBalance ? user.walletBalance * 0.02 : 0
            }));
            
            // Set demo account data based on user's demo balance
            setDemoAccount(prev => ({
              ...prev,
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
          }, 1500);
        } catch (error) {
          console.error("Error fetching account data:", error);
          setIsLoading(false);
        }
      };
      
      fetchAccountData();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isAuthenticated, loading, user, navigate, toast]);

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

  // Enhanced loading screen with branded colors
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="h-16 w-16 mx-auto animate-spin border-4 border-gray-200 border-t-[#7C3AED] rounded-full"></div>
            <p className="mt-4 text-lg font-medium text-[#7C3AED]">Loading your dashboard...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your trading environment</p>
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
              <div className="text-right text-xs text-gray-500">
                <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                <p>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader className="h-8 w-8 text-[#7C3AED] animate-spin" />
                  <p className="mt-4 text-sm text-gray-600">Loading your account data...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Account Balance and Trading Account Section */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Account Balance Card */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2 pt-5">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Account Balance</CardTitle>
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          +5.2%
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold">{formatCurrency(user?.walletBalance || 0)}</h2>
                        <p className="text-xs text-gray-500">total balance</p>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={handleDeposit}
                          size="sm"
                          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs py-1 px-3 h-auto"
                        >
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          Deposit
                        </Button>
                        <Button 
                          onClick={handleWithdraw}
                          size="sm"
                          variant="outline"
                          className="text-xs py-1 px-3 h-auto"
                        >
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                          Withdraw
                        </Button>
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
                          className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-xs py-2 rounded-l-md"
                        >
                          Live Account
                        </TabsTrigger>
                        <TabsTrigger 
                          value="demo" 
                          className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-xs py-2 rounded-r-md"
                        >
                          Demo Account
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
                </div>
                
                {/* Verification Status Section */}
                <div>
                  <VerificationStatusPanel 
                    user={user}
                  />
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
