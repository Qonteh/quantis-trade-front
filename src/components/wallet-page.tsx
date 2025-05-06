
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/UserContext";
import { 
  ArrowUpRight, ArrowDownRight, Clock, Search, Download, Filter, 
  ChevronDown, Loader, CreditCard, Wallet, BarChart4, RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "./dashboard/dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useWallet, currencyOptions } from "@/hooks/use-wallet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const { 
    balanceData, 
    transactions, 
    isLoading, 
    error, 
    getWalletBalance, 
    getTransactionHistory
  } = useWallet();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial load of wallet data
    getWalletBalance();
    getTransactionHistory();
    
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

  const handleDeposit = () => {
    navigate("/deposit");
  };

  const handleWithdraw = () => {
    navigate("/withdraw");
  };

  const handleTransfer = () => {
    navigate("/transfer");
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-green-100 text-green-800 border-green-200";
      case "withdraw":
        return "bg-red-100 text-red-800 border-red-200";
      case "transfer_in":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "transfer_out":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "platform_transfer_live":
      case "platform_transfer_demo":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="h-3 w-3 text-green-600" />;
      case "withdraw":
        return <ArrowDownRight className="h-3 w-3 text-red-600" />;
      case "transfer_in":
        return <ArrowUpRight className="h-3 w-3 text-blue-600" />;
      case "transfer_out":
        return <ArrowDownRight className="h-3 w-3 text-orange-600" />;
      case "platform_transfer_live":
      case "platform_transfer_demo":
        return <CreditCard className="h-3 w-3 text-purple-600" />;
      default:
        return <Clock className="h-3 w-3 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "withdraw":
        return "Withdrawal";
      case "transfer_in":
        return "Transfer Received";
      case "transfer_out":
        return "Transfer Sent";
      case "platform_transfer_live":
        return "To Live Platform";
      case "platform_transfer_demo":
        return "To Demo Platform";
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // Filter transactions based on search and type filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      searchTerm === "" || 
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
      
    const matchesFilter = 
      filterType === "all" || 
      transaction.type.includes(filterType);
      
    return matchesSearch && matchesFilter;
  });

  const refreshWalletData = () => {
    getWalletBalance();
    getTransactionHistory();
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
                <h2 className="text-sm font-medium">Wallet & Transactions</h2>
                <p className="text-xs text-gray-500">Manage your funds and view transaction history</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex items-center"
                onClick={refreshWalletData}
                disabled={isLoading.balance || isLoading.transactions}
              >
                {isLoading.balance || isLoading.transactions ? (
                  <Loader className="h-3 w-3 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Wallet Section */}
              <div className="lg:col-span-1">
                <div className="space-y-5">
                  {/* Wallet Card */}
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                    <CardHeader className="relative z-10 pb-2 pt-5">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2">
                          <Wallet className="h-4 w-4 text-[#7C3AED]" />
                        </div>
                        <CardTitle className="text-base">Wallet Balance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      {isLoading.balance ? (
                        <div className="animate-pulse space-y-2">
                          <div className="h-7 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      ) : error ? (
                        <div className="text-red-500 text-sm">Error loading balance</div>
                      ) : (
                        <>
                          <div className="mb-2">
                            <h2 className="text-2xl font-bold text-gray-800">
                              {formatCurrency(balanceData?.walletBalance || 0)}
                            </h2>
                            <p className="text-xs text-gray-500">available balance</p>
                          </div>

                          <div className="mb-4 p-2 bg-gray-50 rounded-md border border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Demo Balance:</span>
                              <span className="text-xs font-medium">{formatCurrency(balanceData?.demoBalance || 0)}</span>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex flex-col gap-2">
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
                        <Button 
                          onClick={handleTransfer}
                          size="sm"
                          variant="outline"
                          className="text-xs py-1 px-3 h-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <CreditCard className="mr-1 h-3 w-3" />
                          Transfer Funds
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Currency Card */}
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2 pt-5">
                      <CardTitle className="text-base">
                        Currency Preferences
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Select your preferred deposit currency
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select defaultValue="USD">
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="mt-4 bg-blue-50 p-3 rounded-md">
                        <p className="text-xs text-blue-700">
                          When you deposit in a currency other than USD, a conversion rate will be applied.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Transactions Section */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart4 className="h-4 w-4 mr-2 text-[#7C3AED]" />
                      Transaction History
                    </CardTitle>
                    <CardDescription className="text-xs">
                      View all your past transactions
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4 flex flex-col md:flex-row gap-2 justify-between">
                      {/* Search Input */}
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search transactions..." 
                          className="pl-8 text-sm h-9" 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      {/* Filter Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs h-9">
                            <Filter className="h-3.5 w-3.5 mr-1.5" />
                            {filterType === "all" ? "All Transactions" : getTransactionLabel(filterType)}
                            <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setFilterType("all")}>
                            All Transactions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterType("deposit")}>
                            Deposits
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterType("withdraw")}>
                            Withdrawals
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterType("transfer")}>
                            Transfers
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterType("platform")}>
                            Platform Transfers
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {isLoading.transactions ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse border rounded-md p-3">
                            <div className="flex justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                              </div>
                              <div className="space-y-2 flex items-start justify-end w-1/4">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No transactions found</p>
                        {searchTerm || filterType !== "all" ? (
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => {
                              setSearchTerm("");
                              setFilterType("all");
                            }}
                          >
                            Clear filters
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {filteredTransactions.map((transaction) => (
                          <div 
                            key={transaction.id} 
                            className="border border-gray-200 rounded-md p-3 transition-all hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <Badge 
                                    variant="outline" 
                                    className={`flex items-center mr-2 text-[10px] px-1.5 py-0.5 ${getTransactionTypeColor(transaction.type)}`}
                                  >
                                    {getTransactionIcon(transaction.type)}
                                    <span className="ml-1">{getTransactionLabel(transaction.type)}</span>
                                  </Badge>
                                  <p className="text-xs text-gray-500">{transaction.reference}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDate(transaction.createdAt)}
                                </p>
                                {transaction.relatedUserId && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    User ID: {transaction.relatedUserId}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className={`font-medium ${
                                  transaction.type === "deposit" || transaction.type === "transfer_in" 
                                    ? "text-green-600" 
                                    : "text-red-600"
                                }`}>
                                  {transaction.type === "deposit" || transaction.type === "transfer_in" 
                                    ? "+" 
                                    : "-"
                                  }
                                  {formatCurrency(transaction.amount)}
                                </p>
                                <Badge 
                                  className={
                                    transaction.status === "completed" 
                                      ? "bg-green-100 text-green-800 hover:bg-green-100 mt-1 text-[10px]" 
                                      : transaction.status === "pending" 
                                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100 mt-1 text-[10px]" 
                                        : "bg-red-100 text-red-800 hover:bg-red-100 mt-1 text-[10px]"
                                  }
                                >
                                  {transaction.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Export Button */}
                    <div className="mt-4 text-right">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1.5" />
                        Export History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
