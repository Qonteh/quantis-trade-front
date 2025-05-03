
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";
import { 
  ArrowUpRight, ArrowDownRight, Clock, Wallet, CreditCard, 
  Circle, Check, ExternalLink, Info, RefreshCw
} from "lucide-react";
import DashboardSidebar from "./dashboard-sidebar";
import { TradingService } from "@/services/api";

// Define trading account type
interface TradingAccount {
  accountId: string;
  type: string;
  leverage: string;
  equity: number;
  balance: number;
  margin: number;
  platform: string;
  currency: string;
  openDate: string;
  server: string;
  isActive: boolean;
}

// Define recent activity type
interface Activity {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState({
    profile: false,
    document: false,
    percentage: 0
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [activeVerificationTab, setActiveVerificationTab] = useState("profile");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [liveAccount, setLiveAccount] = useState<TradingAccount>({
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
  const [demoAccount, setDemoAccount] = useState<TradingAccount>({
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentTab, setCurrentTab] = useState("live");
  
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
      // Check verification status
      setVerificationStatus({
        profile: user.isVerified || false,
        document: false,
        percentage: user.isVerified ? 50 : 0
      });

      // Get real account data
      const fetchAccountData = async () => {
        try {
          // In a real app, we'd fetch this from the API
          // For now we'll just use the user data we have
          
          // Set live account data based on user's wallet balance
          setLiveAccount(prev => ({
            ...prev,
            equity: user?.walletBalance || 0,
            balance: user?.walletBalance || 0
          }));
          
          // Set demo account data based on user's demo balance
          setDemoAccount(prev => ({
            ...prev,
            equity: user?.demoBalance || 10000,
            balance: user?.demoBalance || 10000
          }));
          
          // Dummy activities - in a real app, these would come from an API
          if (user?.id) {
            setActivities([
              {
                id: "act-1",
                type: "deposit",
                description: "Deposit to account",
                amount: user.walletBalance,
                date: new Date().toISOString(),
                status: "completed"
              }
            ]);
          }
        } catch (error) {
          console.error("Error fetching account data:", error);
        }
      };
      
      fetchAccountData();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isAuthenticated, loading, user, navigate]);

  const handleCompleteVerification = () => {
    setShowVerificationModal(true);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin border-4 border-gray-200 border-t-[#7C3AED] rounded-full"></div>
          <p className="mt-3 text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar isMobile={isMobile} />
        
        <div className={`flex-1 ${!isMobile ? 'ml-64' : ''}`}>
          {/* Header with market data */}
          <header className="bg-[#2D1B69] py-4 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  {isMobile && (
                    <div className="flex items-baseline">
                      <span className="text-[#9D6FFF] font-bold">Q</span>
                      <span className="text-white font-bold">uantis</span>
                      <span className="text-[#9D6FFF] font-bold text-xs translate-y-[-8px] ml-[1px]">
                        FX
                      </span>
                    </div>
                  )}
                  <div className="flex ml-auto md:ml-0">
                    <span className="text-white font-medium">Dashboard</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 ml-2 text-xs font-medium text-green-800 bg-green-200 rounded">Live</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 overflow-auto pb-2 md:pb-0 whitespace-nowrap">
                  <div className="text-xs">
                    <div className="flex items-center">
                      <span className="text-white mr-2">EUR/USD</span>
                      <span className="text-red-400">1.0873</span>
                      <span className="text-red-400 ml-1">-0.01%</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center">
                      <span className="text-white mr-2">GBP/USD</span>
                      <span className="text-red-400">1.2543</span>
                      <span className="text-red-400 ml-1">-0.02%</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center">
                      <span className="text-white mr-2">USD/JPY</span>
                      <span className="text-green-400">153.6569</span>
                      <span className="text-green-400 ml-1">+0.01%</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center">
                      <span className="text-white mr-2">BTC/USD</span>
                      <span className="text-red-400">63,154.43</span>
                      <span className="text-red-400 ml-1">-0.03%</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                  <div className="relative w-48">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full h-8 px-3 py-1 pl-8 text-sm text-white bg-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
                    />
                    <svg className="absolute left-2.5 top-2 h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <button className="relative">
                    <svg className="h-6 w-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-[#2D1B69]"></span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Welcome section */}
          <div className="bg-[#f9f9ff] py-4 px-4 md:px-6 border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h2 className="font-medium">Welcome back, {user?.firstName || "Trader"}</h2>
                <p className="text-sm text-gray-500">Last login from {user?.countryCode || "US"} at {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Account Balance and Verification Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Account Balance Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Account Balance</CardTitle>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        +5.2%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h2 className="text-3xl font-bold">{formatCurrency(user?.walletBalance || 0)}</h2>
                      <p className="text-sm text-gray-500">Total Balance</p>
                    </div>

                    <div className="flex flex-wrap gap-4 md:flex-nowrap">
                      <Button 
                        onClick={handleDeposit}
                        className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                      >
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Deposit
                      </Button>
                      <Button 
                        onClick={handleWithdraw}
                        className="flex-1"
                        variant="outline"
                      >
                        <ArrowDownRight className="mr-2 h-4 w-4" />
                        Withdraw
                      </Button>
                    </div>

                    {/* Account stats */}
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div className="bg-[#f8f8ff] p-4 rounded-lg">
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 rounded-full bg-[#e1f5fe] flex items-center justify-center mr-2">
                            <Clock className="h-3 w-3 text-[#03a9f4]" />
                          </div>
                          <span className="text-xs text-gray-600">Total Equity</span>
                        </div>
                        <p className="font-bold">{formatCurrency(liveAccount.equity)}</p>
                      </div>
                      
                      <div className="bg-[#f8f8ff] p-4 rounded-lg">
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 rounded-full bg-[#ede7f6] flex items-center justify-center mr-2">
                            <CreditCard className="h-3 w-3 text-[#673ab7]" />
                          </div>
                          <span className="text-xs text-gray-600">Total Credit</span>
                        </div>
                        <p className="font-bold">$1,000.00</p>
                      </div>
                      
                      <div className="bg-[#f8f8ff] p-4 rounded-lg">
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 rounded-full bg-[#e3f2fd] flex items-center justify-center mr-2">
                            <Wallet className="h-3 w-3 text-[#2196f3]" />
                          </div>
                          <span className="text-xs text-gray-600">Total Deposit</span>
                        </div>
                        <p className="font-bold">{formatCurrency(user?.walletBalance || 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trading Account Tabs */}
                <div className="bg-white rounded-md border shadow-sm">
                  <Tabs defaultValue="live" value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="live" className="rounded-t-md py-3">Live Account</TabsTrigger>
                      <TabsTrigger value="demo" className="rounded-t-md py-3">Demo Account</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="live" className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Live Trading Account</h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <span>#{liveAccount.accountId}</span>
                              <span className="mx-1">•</span>
                              <span>{liveAccount.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-1 rounded-full bg-green-400"></div>
                            <span className="text-sm font-medium text-green-700">Active</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Leverage</p>
                            <p className="font-medium">{liveAccount.leverage}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Equity</p>
                            <p className="font-medium">{formatCurrency(liveAccount.equity)}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Balance</p>
                            <p className="font-medium">{formatCurrency(liveAccount.balance)}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Margin</p>
                            <p className="font-medium">{formatCurrency(liveAccount.margin)}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm pt-2">
                          <div className="flex space-x-4">
                            <span>Platform: <span className="font-medium">{liveAccount.platform}</span></span>
                            <span>Currency: <span className="font-medium">{liveAccount.currency}</span></span>
                            <span>Open Date: <span className="font-medium">{new Date(liveAccount.openDate).toLocaleDateString()}</span></span>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex items-center justify-between">
                          <Button variant="outline" className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Platform
                          </Button>
                          
                          <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                            Account Actions
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="demo" className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Demo Trading Account</h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <span>#{demoAccount.accountId}</span>
                              <span className="mx-1">•</span>
                              <span>{demoAccount.type}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-1 rounded-full bg-green-400"></div>
                            <span className="text-sm font-medium text-green-700">Active</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Leverage</p>
                            <p className="font-medium">{demoAccount.leverage}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Equity</p>
                            <p className="font-medium">{formatCurrency(demoAccount.equity)}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Balance</p>
                            <p className="font-medium">{formatCurrency(demoAccount.balance)}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Margin</p>
                            <p className="font-medium">{formatCurrency(demoAccount.margin)}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm pt-2">
                          <div className="flex space-x-4">
                            <span>Platform: <span className="font-medium">{demoAccount.platform}</span></span>
                            <span>Currency: <span className="font-medium">{demoAccount.currency}</span></span>
                            <span>Open Date: <span className="font-medium">{new Date(demoAccount.openDate).toLocaleDateString()}</span></span>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex items-center justify-between">
                          <Button variant="outline" className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Platform
                          </Button>
                          
                          <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                            Account Actions
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Recent Activity Section */}
                <div className="bg-white rounded-md border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Recent Activities</h3>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All
                    </Button>
                  </div>
                  
                  {activities.length > 0 ? (
                    <div className="space-y-3">
                      {activities.map(activity => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              {activity.type === 'deposit' && <ArrowUpRight className="h-4 w-4 text-blue-600" />}
                              {activity.type === 'withdraw' && <ArrowDownRight className="h-4 w-4 text-orange-600" />}
                              {activity.type === 'trade' && <RefreshCw className="h-4 w-4 text-purple-600" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{activity.description}</p>
                              <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${activity.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {activity.amount >= 0 ? '+' : ''}{formatCurrency(activity.amount)}
                            </p>
                            <p className={`text-xs ${
                              activity.status === 'completed' ? 'text-green-600' : 
                              activity.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Clock className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <h3 className="text-sm font-medium text-gray-600">No Recent Activities</h3>
                      <p className="text-xs text-gray-500 mt-1">Your account activities will appear here</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Verification Status Section */}
              <div className="space-y-6">
                {/* Verification Status Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="text-amber-700 font-medium">Basic Level</div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Limited account access</p>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                        <span className="text-sm font-medium text-gray-700">{verificationStatus.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-amber-400 rounded-full" 
                          style={{ width: `${verificationStatus.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center">
                        {verificationStatus.profile ? (
                          <div className="mr-3 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="mr-3 w-6 h-6 rounded-full border-2 border-gray-300"></div>
                        )}
                        <div>
                          <p className="text-sm font-medium">Email Verification</p>
                          <p className="text-xs text-gray-500">Verify your email address</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {verificationStatus.document ? (
                          <div className="mr-3 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="mr-3 w-6 h-6 rounded-full border-2 border-gray-300"></div>
                        )}
                        <div>
                          <p className="text-sm font-medium">Document Verification</p>
                          <p className="text-xs text-gray-500">Verify your identity</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleCompleteVerification}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Complete Verification
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Deposit Limit Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Deposit Limit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md bg-blue-50 border border-blue-100 p-3 flex items-start mb-4">
                      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        You can deposit up to $2,000 and start trading immediately. Complete verification to increase your limit.
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleDeposit}
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    >
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Deposit Now
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Account Details Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Account Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account type</span>
                      <span className="text-sm font-medium">{liveAccount.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Platform</span>
                      <span className="text-sm font-medium">{liveAccount.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Server</span>
                      <span className="text-sm font-medium">{liveAccount.server}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Verification Modal - In a real application, this would be a separate component */}
            {showVerificationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Verification</h2>
                    
                    <Tabs defaultValue={activeVerificationTab} onValueChange={setActiveVerificationTab}>
                      <TabsList className="mb-6">
                        <TabsTrigger value="profile">Profile Verification</TabsTrigger>
                        <TabsTrigger value="document">Document Verification</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="profile" className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">Please provide your personal information to complete profile verification.</p>
                        
                        {/* This would be a form in a real application */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                              <option>Select Nationality</option>
                              <option>United States</option>
                              <option>United Kingdom</option>
                              <option>Canada</option>
                              {/* More countries would be here */}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Your address" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Your city" />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="document">
                        <p className="text-sm text-gray-600 mb-4">Please upload one of the following documents for verification.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-[#7C3AED] cursor-pointer">
                            <div className="mb-2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-medium">Passport</h3>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-[#7C3AED] cursor-pointer">
                            <div className="mb-2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-medium">Driver's License</h3>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-[#7C3AED] cursor-pointer">
                            <div className="mb-2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-medium">Identity Card</h3>
                          </div>
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <div className="mb-2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium mb-1">Upload Document</h3>
                          <p className="text-xs text-gray-500">Drag and drop or click to upload</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <Button 
                        variant="outline"
                        onClick={() => setShowVerificationModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                        onClick={() => {
                          // In a real application, this would submit the verification data
                          // For now, we'll just close the modal and update the status
                          setVerificationStatus(prev => ({
                            ...prev,
                            [activeVerificationTab]: true,
                            percentage: prev.percentage + 50 > 100 ? 100 : prev.percentage + 50
                          }));
                          setShowVerificationModal(false);
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
