"use client"

import { useState } from "react"
import { Wallet, ArrowDownToLine, ArrowUpFromLine, RefreshCw, DollarSign, CreditCard, Clock, Search, Filter, ChevronDown, Download, Shield, AlertCircle, CheckCircle2, Plus, ExternalLink, Trash2, Edit, Copy, Bitcoin, Banknote, Euro, PoundSterling, JapaneseYenIcon as Yen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Logo component to ensure consistent styling
const QuantisLogo = ({ className = "", darkMode = false }) => (
  <div className={`flex items-baseline ${className}`}>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold`}>Q</span>
    <span className={`${darkMode ? "text-white" : "text-black"} font-bold`}>uantis</span>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold text-xs translate-y-[-8px] ml-[1px]`}>
      FX
    </span>
  </div>
)

// Mock data for wallet balances
const walletBalances = [
  {
    id: 1,
    currency: "USD",
    name: "US Dollar",
    balance: 5250.75,
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
    change: "+2.5%",
    trend: "up",
  },
  {
    id: 2,
    currency: "EUR",
    name: "Euro",
    balance: 3200.5,
    icon: Euro,
    color: "bg-blue-100 text-blue-600",
    change: "-0.8%",
    trend: "down",
  },
  {
    id: 3,
    currency: "GBP",
    name: "British Pound",
    balance: 2800.25,
    icon: PoundSterling,
    color: "bg-purple-100 text-purple-600",
    change: "+1.2%",
    trend: "up",
  },
  {
    id: 4,
    currency: "JPY",
    name: "Japanese Yen",
    balance: 450000.0,
    icon: Yen,
    color: "bg-red-100 text-red-600",
    change: "+0.3%",
    trend: "up",
  },
  {
    id: 5,
    currency: "BTC",
    name: "Bitcoin",
    balance: 0.12,
    icon: Bitcoin,
    color: "bg-amber-100 text-amber-600",
    change: "+4.7%",
    trend: "up",
  },
]

// Mock data for transactions
const transactions = [
  {
    id: 1,
    type: "Deposit",
    amount: 2000.0,
    currency: "USD",
    status: "Completed",
    date: "2025-04-25T14:30:00",
    description: "Bank Transfer",
    account: "QFX7654321",
  },
  {
    id: 2,
    type: "Withdraw",
    amount: 500.0,
    currency: "USD",
    status: "Pending",
    date: "2025-04-26T10:15:00",
    description: "Bank Transfer",
    account: "QFX7654321",
  },
  {
    id: 3,
    type: "Deposit",
    amount: 3000.0,
    currency: "USD",
    status: "Completed",
    date: "2025-04-20T10:15:00",
    description: "Credit Card",
    account: "QFX7654321",
  },
  {
    id: 4,
    type: "Internal Transfer",
    amount: 1000.0,
    currency: "USD",
    status: "Completed",
    date: "2025-04-22T16:45:00",
    description: "To Demo Account",
    account: "QFX7654321",
  },
  {
    id: 5,
    type: "Withdraw",
    amount: 750.0,
    currency: "EUR",
    status: "Completed",
    date: "2025-04-18T11:30:00",
    description: "Bank Transfer",
    account: "QFX7654322",
  },
]

// Mock data for payment methods
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
]

const formatCurrency = (value: number, currency: string) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "BTC" ? 8 : 2,
    maximumFractionDigits: currency === "BTC" ? 8 : 2,
  })
  return formatter.format(value)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("balances")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [transferAmount, setTransferAmount] = useState("")
  const [transferFrom, setTransferFrom] = useState("")
  const [transferTo, setTransferTo] = useState("")
  const [transferCurrency, setTransferCurrency] = useState("USD")

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchQuery === "" ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.account.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || transaction.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesType = filterType === "all" || transaction.type.toLowerCase() === filterType.toLowerCase()

    return matchesSearch && matchesStatus && matchesType
  })

  // Handle transfer submission
  const handleTransferSubmit = () => {
    // In a real app, this would submit the transfer to the backend
    console.log("Transfer submitted:", {
      amount: transferAmount,
      from: transferFrom,
      to: transferTo,
      currency: transferCurrency,
    })
    setIsTransferDialogOpen(false)
    // Reset form
    setTransferAmount("")
    setTransferFrom("")
    setTransferTo("")
    setTransferCurrency("USD")
  }

  // Handle navigation to deposit/withdraw pages
  const handleNavigation = (path: string) => {
    window.location.href = path
  }

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
                  <CardTitle className="text-sm">Internal Transfer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4 pt-2">
                <p className="text-xs text-gray-500 mb-3">Transfer funds between your trading accounts</p>
                <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-8 text-xs">Transfer Funds</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Internal Transfer</DialogTitle>
                      <DialogDescription>Transfer funds between your trading accounts.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="transfer-amount">Amount</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input
                            id="transfer-amount"
                            type="number"
                            placeholder="Enter amount"
                            className="pl-10"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="transfer-currency">Currency</Label>
                        <Select value={transferCurrency} onValueChange={setTransferCurrency}>
                          <SelectTrigger id="transfer-currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Currencies</SelectLabel>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                              <SelectItem value="GBP">GBP - British Pound</SelectItem>
                              <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="transfer-from">From Account</Label>
                        <Select value={transferFrom} onValueChange={setTransferFrom}>
                          <SelectTrigger id="transfer-from">
                            <SelectValue placeholder="Select source account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Trading Accounts</SelectLabel>
                              <SelectItem value="account1">QFX7654321 MT5 (USD 5,250.75)</SelectItem>
                              <SelectItem value="account2">QFX7654322 MT5 (EUR 3,200.50)</SelectItem>
                              <SelectItem value="account3">QFX7654323 MT5 (GBP 2,800.25)</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="transfer-to">To Account</Label>
                        <Select value={transferTo} onValueChange={setTransferTo}>
                          <SelectTrigger id="transfer-to">
                            <SelectValue placeholder="Select destination account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Trading Accounts</SelectLabel>
                              <SelectItem value="account1">QFX7654321 MT5 (USD 5,250.75)</SelectItem>
                              <SelectItem value="account2">QFX7654322 MT5 (EUR 3,200.50)</SelectItem>
                              <SelectItem value="account3">QFX7654323 MT5 (GBP 2,800.25)</SelectItem>
                              <SelectItem value="demo1">DEMO9876543 MT5 (USD 10,000.00)</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                        onClick={handleTransferSubmit}
                        disabled={!transferAmount || !transferFrom || !transferTo || transferFrom === transferTo}
                      >
                        Transfer Funds
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
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 p-4 pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Available Balance</span>
                        <span className="text-sm font-bold">{formatCurrency(wallet.balance, wallet.currency)}</span>
                      </div>
                      <div className="flex space-x-2 mt-3">
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
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Currency Card */}
                <Card className="border-none shadow-sm overflow-hidden bg-gray-50/50 border border-dashed border-gray-200">
                  <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[160px]">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Plus className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Add New Currency</p>
                    <p className="text-xs text-gray-500 text-center mb-3">
                      Deposit funds in a new currency to your account
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleNavigation("/deposit")}
                    >
                      Add Currency
                    </Button>
                  </CardContent>
                </Card>
              </div>

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
                      Your funds are securely held in segregated accounts. We employ industry-leading security measures
                      to protect your assets.
                    </p>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      <span>Two-factor authentication enabled</span>
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
                          <SelectItem value="internal transfer">Internal Transfer</SelectItem>
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
                          <TableHead className="text-[10px] font-medium py-2">Description</TableHead>
                          <TableHead className="text-[10px] font-medium py-2">Date</TableHead>
                          <TableHead className="text-[10px] font-medium py-2">Status</TableHead>
                          <TableHead className="text-[10px] font-medium py-2">Account</TableHead>
                          <TableHead className="text-[10px] font-medium py-2 text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((transaction) => (
                            <TableRow key={transaction.id} className="hover:bg-gray-50">
                              <TableCell className="py-1.5">
                                <Badge
                                  variant="outline"
                                  className={
                                    transaction.type === "Deposit"
                                      ? "border-green-500 text-green-600 bg-green-50"
                                      : transaction.type === "Withdraw"
                                        ? "border-red-500 text-red-600 bg-red-50"
                                        : "border-blue-500 text-blue-600 bg-blue-50"
                                  }
                                >
                                  <span className="text-[10px]">{transaction.type}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="py-1.5 text-xs">{transaction.description}</TableCell>
                              <TableCell className="py-1.5 text-xs">{formatDate(transaction.date)}</TableCell>
                              <TableCell className="py-1.5">
                                <Badge
                                  variant="outline"
                                  className={
                                    transaction.status === "Completed"
                                      ? "border-green-500 text-green-600 bg-green-50"
                                      : transaction.status === "Pending"
                                        ? "border-amber-500 text-amber-600 bg-amber-50"
                                        : "border-red-500 text-red-600 bg-red-50"
                                  }
                                >
                                  <span className="text-[10px]">{transaction.status}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="py-1.5 text-xs">{transaction.account}</TableCell>
                              <TableCell className="py-1.5 text-right text-xs">
                                <span
                                  className={
                                    transaction.type === "Deposit"
                                      ? "text-green-600"
                                      : transaction.type === "Withdraw"
                                        ? "text-red-600"
                                        : ""
                                  }
                                >
                                  {transaction.type === "Deposit" ? "+" : transaction.type === "Withdraw" ? "-" : ""}
                                  {formatCurrency(transaction.amount, transaction.currency)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
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
  )
}
