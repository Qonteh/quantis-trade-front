import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";
import { Circle, TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight, BarChart3, Clock, Wallet, Users, CreditCard } from "lucide-react";
import DashboardSidebar from "./dashboard-sidebar";

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

    // Fetch user data and update balances if authenticated
    if (isAuthenticated && user) {
      // This would normally come from an API call, but for demo purposes, we'll create sample data
      const sampleBalance = {
        totalBalance: 10000.00 + Math.random() * 500,
        availableBalance: 8500.00 + Math.random() * 300,
        equity: 10200.00 + Math.random() * 500,
        margin: 1500.00,
        freeMargin: 8700.00,
        marginLevel: 680,
        profitLoss: 200.00 + Math.random() * 100 * (Math.random() > 0.5 ? 1 : -1),
      };
      
      setBalances(sampleBalance);
      
      // Sample trades - in a real app, these would come from an API
      const sampleTrades: Trade[] = [
        {
          id: "T123456",
          symbol: "EUR/USD",
          type: "buy",
          openPrice: 1.0876,
          currentPrice: 1.0892,
          size: 0.5,
          openTime: "2025-04-28T14:32:00Z",
          profitLoss: 8.00,
          profitLossPercentage: 0.15,
        },
        {
          id: "T123457",
          symbol: "GBP/USD",
          type: "sell",
          openPrice: 1.2532,
          currentPrice: 1.2502,
          size: 0.3,
          openTime: "2025-04-29T09:15:00Z",
          profitLoss: 9.00,
          profitLossPercentage: 0.24,
        },
        {
          id: "T123458",
          symbol: "BTC/USD",
          type: "buy",
          openPrice: 63500.00,
          currentPrice: 63250.00,
          size: 0.01,
          openTime: "2025-04-29T12:45:00Z",
          profitLoss: -2.50,
          profitLossPercentage: -0.39,
        },
      ];
      
      setTrades(sampleTrades);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isAuthenticated, loading, user, navigate]);

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
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
