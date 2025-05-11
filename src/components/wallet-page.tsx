"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Clock, Search, Download, Filter, ChevronDown, CreditCard, Wallet, BarChart4, RefreshCw, TrendingUp } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWallet, currencyOptions } from "@/hooks/use-wallet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const WalletPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [activeTab, setActiveTab] = useState("live")

  const { balanceData, transactions, isLoading, error, getWalletBalance, getTransactionHistory } = useWallet()

  useEffect(() => {
    // Initial load of wallet data
    getWalletBalance()
    getTransactionHistory()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-green-50 text-green-700 border-green-200"
      case "withdraw":
        return "bg-red-50 text-red-700 border-red-200"
      case "transfer_in":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "transfer_out":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "platform_transfer_live":
      case "platform_transfer_demo":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="h-3 w-3 text-green-600" />
      case "withdraw":
        return <ArrowDownRight className="h-3 w-3 text-red-600" />
      case "transfer_in":
        return <ArrowUpRight className="h-3 w-3 text-blue-600" />
      case "transfer_out":
        return <ArrowDownRight className="h-3 w-3 text-orange-600" />
      case "platform_transfer_live":
      case "platform_transfer_demo":
        return <CreditCard className="h-3 w-3 text-purple-600" />
      default:
        return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • HH:mm")
    } catch (e) {
      return dateString
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit"
      case "withdraw":
        return "Withdrawal"
      case "transfer_in":
        return "Transfer Received"
      case "transfer_out":
        return "Transfer Sent"
      case "platform_transfer_live":
        return "To Live Platform"
      case "platform_transfer_demo":
        return "To Demo Platform"
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }
  }

  // Filter transactions based on search and type filter
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm)

    const matchesFilter = filterType === "all" || transaction.type.includes(filterType)

    return matchesSearch && matchesFilter
  })

  const refreshWalletData = () => {
    getWalletBalance()
    getTransactionHistory()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Simplified Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.jpg" alt="Logo" className="h-12 w-auto" />
            
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs flex items-center text-gray-600 hover:text-gray-900"
            onClick={refreshWalletData}
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="mb-5">
          <h1 className="text-base font-medium text-gray-800">Wallet & Transactions</h1>
          <p className="text-xs text-gray-500 mt-0.5">View your balance and transaction history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Wallet Section */}
          <div className="lg:col-span-1">
            <div className="space-y-5">
              {/* Wallet Card */}
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-purple-50 flex items-center justify-center mr-2">
                      <Wallet className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <CardTitle className="text-sm font-medium text-gray-800">Account Balance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading.balance ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 text-xs font-medium p-2 bg-red-50 rounded-md">
                      Error loading balance. Please try again.
                    </div>
                  ) : (
                    <Tabs defaultValue="live" className="w-full" onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-2 mb-3 h-7">
                        <TabsTrigger value="live" className="text-xs">
                          Live Account
                        </TabsTrigger>
                        <TabsTrigger value="demo" className="text-xs">
                          Demo Account
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="live" className="mt-0">
                        <div className="p-3 bg-white rounded-md border border-purple-100 shadow-sm">
                          <div className="flex items-center mb-1">
                            <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center mr-1.5">
                              <TrendingUp className="h-2.5 w-2.5 text-green-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Live Balance</span>
                          </div>
                          <div className="mb-1">
                            <h2 className="text-xl font-semibold text-gray-800">
                              {formatCurrency(balanceData?.walletBalance || 0)}
                            </h2>
                            <p className="text-[10px] text-gray-500">Available for trading</p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-gray-500">Equity:</span>
                              <span className="text-[10px] font-medium text-gray-700">
                                {formatCurrency((balanceData?.walletBalance || 0) * 1.05)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[10px] text-gray-500">Margin Used:</span>
                              <span className="text-[10px] font-medium text-gray-700">
                                {formatCurrency((balanceData?.walletBalance || 0) * 0.15)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="demo" className="mt-0">
                        <div className="p-3 bg-white rounded-md border border-blue-100 shadow-sm">
                          <div className="flex items-center mb-1">
                            <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center mr-1.5">
                              <Wallet className="h-2.5 w-2.5 text-blue-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Demo Balance</span>
                          </div>
                          <div className="mb-1">
                            <h2 className="text-xl font-semibold text-gray-800">
                              {formatCurrency(balanceData?.demoBalance || 0)}
                            </h2>
                            <p className="text-[10px] text-gray-500">Practice account</p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-gray-500">Equity:</span>
                              <span className="text-[10px] font-medium text-gray-700">
                                {formatCurrency((balanceData?.demoBalance || 0) * 1.02)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[10px] text-gray-500">Margin Used:</span>
                              <span className="text-[10px] font-medium text-gray-700">
                                {formatCurrency((balanceData?.demoBalance || 0) * 0.08)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  {/* Market Rates Card */}
                  
                </CardContent>
              </Card>

              {/* Currency Card */}
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm font-medium text-gray-800">Currency Preferences</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Select your preferred deposit currency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select defaultValue="USD">
                    <SelectTrigger className="w-full text-xs border-gray-200 h-8">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value} className="text-xs">
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-3 bg-blue-50 p-2 rounded-md border border-blue-100">
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
            <Card className="border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center mb-1">
                  <BarChart4 className="h-3.5 w-3.5 mr-2 text-purple-600" />
                  <CardTitle className="text-sm font-medium text-gray-800">Transaction History</CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-500">
                  View transactions for your {activeTab === "live" ? "live" : "demo"} account
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-4 flex flex-col md:flex-row gap-2 justify-between">
                  {/* Search Input */}
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2 h-3 w-3 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-7 text-xs h-7 border-gray-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs h-7 border-gray-200">
                        <Filter className="h-3 w-3 mr-1.5" />
                        {filterType === "all" ? "All Transactions" : getTransactionLabel(filterType)}
                        <ChevronDown className="h-3 w-3 ml-1.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterType("all")} className="text-xs">
                        All Transactions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("deposit")} className="text-xs">
                        Deposits
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("withdraw")} className="text-xs">
                        Withdrawals
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("transfer")} className="text-xs">
                        Transfers
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("platform")} className="text-xs">
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
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                          </div>
                          <div className="space-y-2 flex items-start justify-end w-1/4">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500 text-xs mb-1">No transactions found</p>
                    {searchTerm || filterType !== "all" ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-purple-600"
                        onClick={() => {
                          setSearchTerm("")
                          setFilterType("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="border border-gray-100 rounded-md p-2.5 transition-all hover:bg-gray-50 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <Badge
                                variant="outline"
                                className={`flex items-center mr-2 text-[10px] px-1.5 py-0.5 ${getTransactionTypeColor(
                                  transaction.type,
                                )}`}
                              >
                                {getTransactionIcon(transaction.type)}
                                <span className="ml-1">{getTransactionLabel(transaction.type)}</span>
                              </Badge>
                              <p className="text-xs text-gray-700">{transaction.reference}</p>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">{formatDate(transaction.createdAt)}</p>
                            {transaction.relatedUserId && (
                              <p className="text-[10px] text-gray-500 mt-0.5">User ID: {transaction.relatedUserId}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-xs font-medium ${
                                transaction.type === "deposit" || transaction.type === "transfer_in"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "deposit" || transaction.type === "transfer_in" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <Badge
                              className={
                                transaction.status === "completed"
                                  ? "bg-green-50 text-green-700 hover:bg-green-50 mt-1 text-[10px] border-green-200"
                                  : transaction.status === "pending"
                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-50 mt-1 text-[10px] border-amber-200"
                                    : "bg-red-50 text-red-700 hover:bg-red-50 mt-1 text-[10px] border-red-200"
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
                  <Button variant="outline" size="sm" className="text-xs border-gray-200 h-7">
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
  )
}

export default WalletPage

