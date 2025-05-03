import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";
import { 
  Circle, TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight, 
  BarChart3, Clock, Wallet, Users, CreditCard, Shield, FileCheck, User
} from "lucide-react";
import DashboardSidebar from "./dashboard-sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Let's keep the real trades from the user's account
interface Trade {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  openPrice: number;
  currentPrice: number;
  size: number;
  openTime: string;
  profitLoss: number;
  profitLossPercentage: number;
}

// Define verification status interface
interface VerificationStatus {
  profile: boolean;
  document: boolean;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balances, setBalances] = useState({
    totalBalance: 0,
    availableBalance: 0,
    equity: 0,
    margin: 0,
    freeMargin: 0,
    marginLevel: 0,
    profitLoss: 0,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    profile: false,
    document: false
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [activeVerificationTab, setActiveVerificationTab] = useState("profile");

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

    // Use real user data for balances
    if (isAuthenticated && user) {
      // Use the actual user wallet data instead of hardcoded values
      const userBalance = {
        totalBalance: user.walletBalance || 0,
        availableBalance: user.walletBalance || 0,
        equity: user.walletBalance || 0,
        margin: 0,
        freeMargin: user.walletBalance || 0,
        marginLevel: 0,
        profitLoss: 0,
      };
      
      setBalances(userBalance);
      
      // Start with empty trades for new users
      setTrades([]);
      
      // Check verification status (in a real app, this would come from the API)
      // For now, we'll simulate this based on the user object
      setVerificationStatus({
        profile: user.isVerified || false,
        document: false
      });
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
          {/* Header */}
          <header className="bg-[#2D1B69] py-4 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-baseline">
                  {isMobile && (
                    <span className="text-[#9D6FFF] font-bold">Q</span>
                  )}
                  {isMobile && (
                    <span className="text-white font-bold">uantis</span>
                  )}
                  {isMobile && (
                    <span className="text-[#9D6FFF] font-bold text-xs translate-y-[-8px] ml-[1px]">
                      FX
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:block">
                    <p className="text-white text-sm">
                      Welcome, <span className="font-medium">{user?.firstName || "Trader"}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate("/profile")}
                    className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                  >
                    <span className="text-xs font-medium">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-10">
            {/* Deposit Message Alert */}
            <div className="mb-5">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="flex items-center justify-between">
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">You can deposit up to $2,000 and start trading immediately!</p>
                    <p className="text-sm text-gray-600 mt-1">Complete verification to increase your deposit limits.</p>
                  </div>
                  <Button 
                    onClick={handleDeposit} 
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                  >
                    Deposit Now
                  </Button>
                </AlertDescription>
              </Alert>
            </div>

            {/* Verification Progress */}
            {!verificationStatus.profile || !verificationStatus.document ? (
              <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Complete Your Verification</h2>
                    <p className="text-sm text-gray-500 mt-1">To unlock full platform features, please complete all verification steps</p>
                  </div>
                  <Button 
                    onClick={handleCompleteVerification}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                  >
                    Complete Verification
                  </Button>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profile Verification Status */}
                  <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
                    <div className={`rounded-full p-2 ${verificationStatus.profile ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <User className={`h-5 w-5 ${verificationStatus.profile ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">Profile Verification</h3>
                      <p className="text-sm text-gray-500">
                        {verificationStatus.profile ? 'Completed' : 'Personal information verification'}
                      </p>
                    </div>
                    <div className="ml-auto">
                      {verificationStatus.profile ? (
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </div>
                      ) : (
                        <Circle className={`h-4 w-4 ${verificationStatus.profile ? 'text-green-600' : 'text-gray-300'}`} />
                      )}
                    </div>
                  </div>
                  
                  {/* Document Verification Status */}
                  <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
                    <div className={`rounded-full p-2 ${verificationStatus.document ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <FileCheck className={`h-5 w-5 ${verificationStatus.document ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">Document Verification</h3>
                      <p className="text-sm text-gray-500">
                        {verificationStatus.document ? 'Completed' : 'Upload ID or passport'}
                      </p>
                    </div>
                    <div className="ml-auto">
                      {verificationStatus.document ? (
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </div>
                      ) : (
                        <Circle className={`h-4 w-4 ${verificationStatus.document ? 'text-green-600' : 'text-gray-300'}`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Account overview */}
            <section className="mb-8">
              <h1 className="text-xl font-bold text-gray-900 font-display mb-4">Account Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <DollarSign className="h-4 w-4 text-[#7C3AED] mr-1" />
                      <span className="text-xl font-bold">{balances.totalBalance.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <DollarSign className="h-4 w-4 text-[#7C3AED] mr-1" />
                      <span className="text-xl font-bold">{balances.availableBalance.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Equity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      <DollarSign className="h-4 w-4 text-[#7C3AED] mr-1" />
                      <span className="text-xl font-bold">{balances.equity.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Profit/Loss</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline">
                      {balances.profitLoss >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-xl font-bold ${balances.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {balances.profitLoss >= 0 ? '+' : ''}{balances.profitLoss.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* Quick Actions */}
            <section className="mb-8">
              <h2 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <Button 
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 text-gray-700"
                  onClick={() => navigate("/deposit")}
                >
                  <ArrowUpRight className="h-4 w-4 text-[#7C3AED]" />
                  <span className="text-xs">Deposit</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 text-gray-700"
                  onClick={() => navigate("/withdraw")}
                >
                  <Wallet className="h-4 w-4 text-[#7C3AED]" />
                  <span className="text-xs">Withdraw</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 text-gray-700"
                  onClick={() => navigate("/trade")}
                >
                  <BarChart3 className="h-4 w-4 text-[#7C3AED]" />
                  <span className="text-xs">Trade</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 text-gray-700"
                  onClick={() => navigate("/refer")}
                >
                  <Users className="h-4 w-4 text-[#7C3AED]" />
                  <span className="text-xs">Refer</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 text-gray-700"
                  onClick={() => navigate("/transfer")}
                >
                  <CreditCard className="h-4 w-4 text-[#7C3AED]" />
                  <span className="text-xs">Transfer</span>
                </Button>

                <Button 
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 text-gray-700"
                  onClick={() => navigate("/platform")}
                >
                  <BarChart3 className="h-4 w-4 text-[#7C3AED]" />
                  <span className="text-xs">Platform</span>
                </Button>
              </div>
            </section>
            
            {/* Open Positions */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Trading Activity</h2>
              <Tabs defaultValue="positions">
                <TabsList className="mb-4">
                  <TabsTrigger value="positions" className="text-xs">Open Positions</TabsTrigger>
                  <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="positions" className="space-y-4">
                  {trades.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                      <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="text-sm font-medium text-gray-900">No Open Positions</h3>
                      <p className="text-xs text-gray-500 mt-1">Start trading to see your positions here.</p>
                      <Button 
                        onClick={() => navigate("/trade")} 
                        className="mt-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-xs h-8"
                      >
                        Start Trading
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Symbol</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Size</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Open Price</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">Current</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500">P/L</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {trades.map((trade) => (
                              <tr key={trade.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <Circle className={`h-2 w-2 ${trade.symbol.includes('BTC') ? 'text-[#F7931A]' : 'text-blue-500'} mr-2`} />
                                    {trade.symbol}
                                  </div>
                                </td>
                                <td className={`px-4 py-3 ${trade.type === 'buy' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                  {trade.type.toUpperCase()}
                                </td>
                                <td className="px-4 py-3">{trade.size}</td>
                                <td className="px-4 py-3">{trade.openPrice.toFixed(trade.symbol.includes('BTC') ? 2 : 4)}</td>
                                <td className="px-4 py-3">{trade.currentPrice.toFixed(trade.symbol.includes('BTC') ? 2 : 4)}</td>
                                <td className={`px-4 py-3 font-medium ${trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {trade.profitLoss >= 0 ? '+' : ''}${Math.abs(trade.profitLoss).toFixed(2)} 
                                  <span className="text-gray-400 ml-1">
                                    ({trade.profitLossPercentage >= 0 ? '+' : ''}{trade.profitLossPercentage.toFixed(2)}%)
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                    <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">Trading History</h3>
                    <p className="text-xs text-gray-500 mt-1">Your closed positions and transaction history will appear here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
            
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
                              <FileCheck className="h-6 w-6 text-gray-500" />
                            </div>
                            <h3 className="text-sm font-medium">Passport</h3>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-[#7C3AED] cursor-pointer">
                            <div className="mb-2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                              <FileCheck className="h-6 w-6 text-gray-500" />
                            </div>
                            <h3 className="text-sm font-medium">Driver's License</h3>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-[#7C3AED] cursor-pointer">
                            <div className="mb-2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                              <FileCheck className="h-6 w-6 text-gray-500" />
                            </div>
                            <h3 className="text-sm font-medium">Identity Card</h3>
                          </div>
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <div className="mb-2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                            <FileCheck className="h-6 w-6 text-gray-500" />
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
                            [activeVerificationTab]: true
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
