"use client"

import { useState, useEffect } from "react"
import { ArrowLeftRight, ArrowRight, ChevronDown, Clock, DollarSign, ExternalLink, Filter, Info, Search, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define types for our data
interface Account {
  id: string
  name: string
  number: string
  balance: number
  currency: string
  type: "Live" | "Demo" | "MT5" | "MT4"
  platform?: string
}

interface TransferHistory {
  id: string
  date: string
  fromAccount: string
  toAccount: string
  amount: number
  status: "Completed" | "Pending" | "Failed"
  reference: string
}

// Sample data
const accounts: Account[] = [
  {
    id: "acc1",
    name: "Main Trading Account",
    number: "QFX7654321",
    balance: 5250.75,
    currency: "USD",
    type: "Live",
  },
  {
    id: "acc2",
    name: "Demo Account",
    number: "DEMO9876543",
    balance: 10000.0,
    currency: "USD",
    type: "Demo",
  },
  {
    id: "acc3",
    name: "MetaTrader 5",
    number: "MT5-8765432",
    balance: 3200.50,
    currency: "USD",
    type: "MT5",
    platform: "MetaTrader 5",
  },
  {
    id: "acc4",
    name: "MetaTrader 4",
    number: "MT4-9876543",
    balance: 1500.25,
    currency: "USD",
    type: "MT4",
    platform: "MetaTrader 4",
  },
]

const transferHistory: TransferHistory[] = [
  {
    id: "tr1",
    date: "2025-04-27T14:30:00",
    fromAccount: "Main Trading Account",
    toAccount: "MetaTrader 5",
    amount: 1000.00,
    status: "Completed",
    reference: "MT5 Trading",
  },
  {
    id: "tr2",
    date: "2025-04-25T10:15:00",
    fromAccount: "Main Trading Account",
    toAccount: "MetaTrader 4",
    amount: 500.00,
    status: "Completed",
    reference: "MT4 Trading",
  },
  {
    id: "tr3",
    date: "2025-04-23T16:45:00",
    fromAccount: "MetaTrader 5",
    toAccount: "Main Trading Account",
    amount: 750.25,
    status: "Completed",
    reference: "Profit Withdrawal",
  },
  {
    id: "tr4",
    date: "2025-04-20T09:30:00",
    fromAccount: "Main Trading Account",
    toAccount: "MetaTrader 5",
    amount: 2000.00,
    status: "Failed",
    reference: "Transfer Failed - Insufficient Funds",
  },
  {
    id: "tr5",
    date: "2025-04-18T11:20:00",
    fromAccount: "MetaTrader 4",
    toAccount: "Main Trading Account",
    amount: 300.50,
    status: "Pending",
    reference: "Pending Approval",
  },
]

// Helper functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
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

export default function TransferPage() {
  const [activeTab, setActiveTab] = useState("internal")
  const [fromAccount, setFromAccount] = useState("")
  const [toAccount, setToAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [reference, setReference] = useState("")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [filteredHistory, setFilteredHistory] = useState<TransferHistory[]>(transferHistory)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  // Filter transfer history based on search query and status filter
  useEffect(() => {
    let filtered = [...transferHistory]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        item => 
          item.fromAccount.toLowerCase().includes(query) ||
          item.toAccount.toLowerCase().includes(query) ||
          item.reference.toLowerCase().includes(query)
      )
    }
    
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter)
    }
    
    setFilteredHistory(filtered)
  }, [searchQuery, statusFilter])

  // Reset form when tab changes
  useEffect(() => {
    setFromAccount("")
    setToAccount("")
    setAmount("")
    setReference("")
  }, [activeTab])

  // Simulate processing progress
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(interval)
            setIsProcessing(false)
            setIsSuccessDialogOpen(true)
            return 100
          }
          return newProgress
        })
      }, 300)
      
      return () => clearInterval(interval)
    }
  }, [isProcessing])

  // Filter accounts based on the active tab
  const getFromAccounts = () => {
    if (activeTab === "internal") {
      return accounts
    } else if (activeTab === "to-mt5") {
      return accounts.filter(acc => acc.type !== "MT5")
    } else {
      return accounts.filter(acc => acc.type === "MT5")
    }
  }

  const getToAccounts = () => {
    if (activeTab === "internal") {
      return accounts.filter(acc => acc.id !== fromAccount)
    } else if (activeTab === "to-mt5") {
      return accounts.filter(acc => acc.type === "MT5")
    } else {
      return accounts.filter(acc => acc.type !== "MT5")
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmDialogOpen(true)
  }

  // Handle transfer confirmation
  const handleConfirmTransfer = () => {
    setIsConfirmDialogOpen(false)
    setIsProcessing(true)
    setProcessingProgress(0)
    
    // Reset form
    setFromAccount("")
    setToAccount("")
    setAmount("")
    setReference("")
  }

  // Get account details by ID
  const getAccountById = (id: string) => {
    return accounts.find(acc => acc.id === id)
  }

  // Check if form is valid
  const isFormValid = fromAccount && toAccount && amount && parseFloat(amount) > 0

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transfer Funds</h1>
          <p className="text-gray-500 mt-1">Transfer funds between your accounts and trading platforms</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Transfer Funds</CardTitle>
              <CardDescription>Move funds between your accounts or to trading platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="internal" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="internal" className="text-xs">Internal Transfer</TabsTrigger>
                  <TabsTrigger value="to-mt5" className="text-xs">To MT5/MT4</TabsTrigger>
                  <TabsTrigger value="from-mt5" className="text-xs">From MT5/MT4</TabsTrigger>
                </TabsList>
                
                <TabsContent value="internal">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="from-account">From Account</Label>
                          <Select value={fromAccount} onValueChange={setFromAccount}>
                            <SelectTrigger id="from-account">
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                            <SelectContent>
                              {getFromAccounts().map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex flex-col">
                                    <span>{account.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {account.number} • {formatCurrency(account.balance)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="to-account">To Account</Label>
                          <Select 
                            value={toAccount} 
                            onValueChange={setToAccount}
                            disabled={!fromAccount}
                          >
                            <SelectTrigger id="to-account">
                              <SelectValue placeholder="Select destination account" />
                            </SelectTrigger>
                            <SelectContent>
                              {getToAccounts().map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex flex-col">
                                    <span>{account.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {account.number} • {formatCurrency(account.balance)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0.01"
                            step="0.01"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference (Optional)</Label>
                        <Textarea
                          id="reference"
                          placeholder="Add a reference for this transfer"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                        />
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-blue-800 font-medium">Internal Transfer Information</p>
                          <p className="text-xs text-blue-700 mt-1">
                            Internal transfers between your accounts are processed instantly. There are no fees for internal transfers.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        type="submit" 
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                        disabled={!isFormValid}
                      >
                        Continue to Transfer
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="to-mt5">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="from-account">From Account</Label>
                          <Select value={fromAccount} onValueChange={setFromAccount}>
                            <SelectTrigger id="from-account">
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                            <SelectContent>
                              {getFromAccounts().map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex flex-col">
                                    <span>{account.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {account.number} • {formatCurrency(account.balance)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="to-account">To MT5/MT4 Account</Label>
                          <Select 
                            value={toAccount} 
                            onValueChange={setToAccount}
                            disabled={!fromAccount}
                          >
                            <SelectTrigger id="to-account">
                              <SelectValue placeholder="Select MT5/MT4 account" />
                            </SelectTrigger>
                            <SelectContent>
                              {getToAccounts().map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex flex-col">
                                    <span>{account.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {account.number} • {formatCurrency(account.balance)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0.01"
                            step="0.01"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference (Optional)</Label>
                        <Textarea
                          id="reference"
                          placeholder="Add a reference for this transfer"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                        />
                      </div>
                      
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                        <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-amber-800 font-medium">MT5/MT4 Transfer Information</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Transfers to MT5/MT4 accounts are typically processed within 5-10 minutes. Please ensure your MT5/MT4 account is properly connected to your Quantis FX account.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        type="submit" 
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                        disabled={!isFormValid}
                      >
                        Continue to Transfer
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="from-mt5">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="from-account">From MT5/MT4 Account</Label>
                          <Select value={fromAccount} onValueChange={setFromAccount}>
                            <SelectTrigger id="from-account">
                              <SelectValue placeholder="Select MT5/MT4 account" />
                            </SelectTrigger>
                            <SelectContent>
                              {getFromAccounts().map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex flex-col">
                                    <span>{account.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {account.number} • {formatCurrency(account.balance)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="to-account">To Account</Label>
                          <Select 
                            value={toAccount} 
                            onValueChange={setToAccount}
                            disabled={!fromAccount}
                          >
                            <SelectTrigger id="to-account">
                              <SelectValue placeholder="Select destination account" />
                            </SelectTrigger>
                            <SelectContent>
                              {getToAccounts().map(account => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex flex-col">
                                    <span>{account.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {account.number} • {formatCurrency(account.balance)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0.01"
                            step="0.01"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference (Optional)</Label>
                        <Textarea
                          id="reference"
                          placeholder="Add a reference for this transfer"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                        />
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-start gap-2">
                        <Info className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-green-800 font-medium">MT5/MT4 Withdrawal Information</p>
                          <p className="text-xs text-green-700 mt-1">
                            Withdrawals from MT5/MT4 accounts may take up to 24 hours to process. Ensure you don't have any open positions or pending orders that might be affected by this withdrawal.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        type="submit" 
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                        disabled={!isFormValid}
                      >
                        Continue to Transfer
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Account Summary */}
        <div>
          <Card className="border-none shadow-sm mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Your available accounts and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={
                          account.type === "Live" ? "bg-green-100 text-green-600" :
                          account.type === "Demo" ? "bg-blue-100 text-blue-600" :
                          "bg-purple-100 text-purple-600"
                        }>
                          {account.type === "Live" ? "L" : account.type === "Demo" ? "D" : "M"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(account.balance)}</p>
                      <Badge variant="outline" className={
                        account.type === "Live" ? "border-green-500 text-green-600 bg-green-50" :
                        account.type === "Demo" ? "border-blue-500 text-blue-600 bg-blue-50" :
                        "border-purple-500 text-purple-600 bg-purple-50"
                      }>
                        <span className="text-[10px]">{account.type}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Support resources for transfers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-medium mb-1">Transfer Limits</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    Minimum transfer: $10.00<br />
                    Maximum transfer: $50,000.00 per day
                  </p>
                  <Button variant="link" className="h-auto p-0 text-xs text-[#7C3AED]">
                    View full limits
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-medium mb-1">Processing Times</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    Internal: Instant<br />
                    To MT5/MT4: 5-10 minutes<br />
                    From MT5/MT4: Up to 24 hours
                  </p>
                </div>
                
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Transfer History */}
      <div className="mt-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Transfer History</CardTitle>
                <CardDescription>Recent fund transfers between your accounts</CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transfers..."
                    className="pl-9 h-9 w-full sm:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      {statusFilter || "All Statuses"}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Failed")}>
                      Failed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border border-gray-100">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium py-2">Date</TableHead>
                    <TableHead className="text-xs font-medium py-2">From</TableHead>
                    <TableHead className="text-xs font-medium py-2">To</TableHead>
                    <TableHead className="text-xs font-medium py-2">Amount</TableHead>
                    <TableHead className="text-xs font-medium py-2">Status</TableHead>
                    <TableHead className="text-xs font-medium py-2">Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 text-xs">{formatDate(item.date)}</TableCell>
                        <TableCell className="py-2 text-xs">{item.fromAccount}</TableCell>
                        <TableCell className="py-2 text-xs">{item.toAccount}</TableCell>
                        <TableCell className="py-2 text-xs font-medium">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="outline"
                            className={
                              item.status === "Completed"
                                ? "border-green-500 text-green-600 bg-green-50"
                                : item.status === "Pending"
                                  ? "border-amber-500 text-amber-600 bg-amber-50"
                                  : "border-red-500 text-red-600 bg-red-50"
                            }
                          >
                            <span className="text-[10px]">{item.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-xs">{item.reference}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-sm text-gray-500">
                        No transfers found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>
              Please review the transfer details before proceeding
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center py-2">
              <div className="flex flex-col items-center">
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {fromAccount && getAccountById(fromAccount)?.type.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{fromAccount && getAccountById(fromAccount)?.name}</p>
                <p className="text-xs text-gray-500">{fromAccount && getAccountById(fromAccount)?.number}</p>
              </div>
              
              <div className="mx-4 p-2 rounded-full bg-gray-100">
                <ArrowRight className="h-5 w-5 text-gray-600" />
              </div>
              
              <div className="flex flex-col items-center">
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {toAccount && getAccountById(toAccount)?.type.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{toAccount && getAccountById(toAccount)?.name}</p>
                <p className="text-xs text-gray-500">{toAccount && getAccountById(toAccount)?.number}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-bold">{amount ? formatCurrency(parseFloat(amount)) : "$0.00"}</span>
              </div>
              
              {reference && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reference:</span>
                  <span className="text-sm">{reference}</span>
                </div>
              )}
            </div>
            
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                By confirming this transfer, you agree to the terms and conditions of Quantis FX's fund transfer policy.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#7C3AED] hover:bg-[#6D28D9]"
              onClick={handleConfirmTransfer}
            >
              Confirm Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Processing Transfer</DialogTitle>
            <DialogDescription>
              Please wait while we process your transfer request
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center">
            <div className="w-full mb-4">
              <Progress value={processingProgress} className="h-2" />
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 animate-pulse" />
              Processing your request...
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Successful</DialogTitle>
            <DialogDescription>
              Your transfer has been processed successfully
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <p className="text-center text-sm text-gray-600 mb-4">
              Your transfer request has been processed successfully. The funds should be available in the destination account shortly.
            </p>
            
            <p className="text-center text-xs text-gray-500">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
          
          <DialogFooter>
            <Button
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
              onClick={() => setIsSuccessDialogOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
