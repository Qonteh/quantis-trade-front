"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/UserContext"
import {
  ArrowRightLeft,
  User,
  CreditCard,
  Server,
  RefreshCw,
  Loader,
  Check,
  Users,
  Building,
  Share2,
  Wallet,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/hooks/use-wallet"
import { useMTServer } from "@/hooks/use-mt-server"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TransferPage: React.FC = () => {
  const { user } = useAuth()
  const [transferType, setTransferType] = useState("internal")

  // Form states for different transfer types
  const [internalTransfer, setInternalTransfer] = useState({
    email: "",
    amount: "",
  })

  const [platformTransfer, setPlatformTransfer] = useState({
    platform: "MT4",
    accountId: "",
    amount: "",
    accountType: "live",
  })

  const { balanceData, isLoading, transferFunds, transferToPlatform, getWalletBalance } = useWallet()

  const { serverStatus, checkServerStatus, getMT4AccountDetails, getMT5AccountDetails } = useMTServer()

  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [transferSuccess, setTransferSuccess] = useState(false)

  useEffect(() => {
    // Load wallet balance & check server status
    getWalletBalance()
    checkServerStatus()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const handleInternalTransfer = async () => {
    if (!internalTransfer.email || !internalTransfer.amount || Number.parseFloat(internalTransfer.amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid email and amount",
      })
      return
    }

    setIsProcessing(true)

    try {
      await transferFunds(internalTransfer.email, Number.parseFloat(internalTransfer.amount))
      setTransferSuccess(true)

      // Reset form after successful transfer
      setInternalTransfer({
        email: "",
        amount: "",
      })

      setTimeout(() => {
        setTransferSuccess(false)
      }, 5000)
    } catch (error) {
      console.error("Transfer error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePlatformTransfer = async () => {
    if (!platformTransfer.accountId || !platformTransfer.amount || Number.parseFloat(platformTransfer.amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid account ID and amount",
      })
      return
    }

    setIsProcessing(true)

    try {
      await transferToPlatform(
        Number.parseFloat(platformTransfer.amount),
        platformTransfer.platform,
        platformTransfer.accountType === "demo" ? "demo" : "live",
      )

      setTransferSuccess(true)

      // Reset form after successful transfer
      setPlatformTransfer({
        platform: "MT4",
        accountId: "",
        amount: "",
        accountType: "live",
      })

      setTimeout(() => {
        setTransferSuccess(false)
      }, 5000)
    } catch (error) {
      console.error("Platform transfer error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getBalanceBasedOnType = () => {
    if (!balanceData) return 0

    if (transferType === "internal") {
      return balanceData.walletBalance
    } else {
      // For platform transfers
      return platformTransfer.accountType === "demo" ? balanceData.demoBalance : balanceData.walletBalance
    }
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
            onClick={getWalletBalance}
            disabled={isLoading.balance}
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="mb-5">
          <h1 className="text-base font-medium text-gray-800">Transfer Funds</h1>
          <p className="text-xs text-gray-500 mt-0.5">Move funds between accounts and platforms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Balance Information */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center">
                  <div className="h-7 w-7 rounded-full bg-purple-50 flex items-center justify-center mr-2">
                    <Wallet className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-800">Available Balance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading.balance ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">{formatCurrency(getBalanceBasedOnType())}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {transferType === "internal"
                          ? "Wallet Balance"
                          : platformTransfer.accountType === "demo"
                            ? "Demo Account Balance"
                            : "Live Account Balance"}
                      </p>
                    </div>
                    {transferType === "platform" && (
                      <div className="bg-blue-50 rounded-md p-2.5 border border-blue-100">
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
                  <div className="mt-3 bg-green-50 p-2.5 rounded-md border border-green-100 flex items-start">
                    <Check className="h-3.5 w-3.5 text-green-500 mr-1.5 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-green-800">Transfer Successful!</p>
                      <p className="text-[10px] text-green-700 mt-0.5">
                        Your funds have been transferred successfully.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Market Rates Card */}
            
          </div>

          {/* Transfer Forms */}
          <Card className="border border-gray-100 shadow-sm md:col-span-3 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-medium text-gray-800">Transfer Funds</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Transfer funds to another account or trading platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={transferType} onValueChange={setTransferType} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-8 bg-gray-100 p-0.5">
                  <TabsTrigger
                    value="internal"
                    className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                  >
                    <Users className="h-3 w-3 mr-1.5" />
                    Internal Transfer
                  </TabsTrigger>
                  <TabsTrigger
                    value="platform"
                    className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                  >
                    <Server className="h-3 w-3 mr-1.5" />
                    Platform Transfer
                  </TabsTrigger>
                  <TabsTrigger
                    value="bank"
                    className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                  >
                    <Building className="h-3 w-3 mr-1.5" />
                    Bank Transfer
                  </TabsTrigger>
                </TabsList>

                {/* Internal Transfer */}
                <TabsContent value="internal" className="space-y-4 mt-4">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-md border border-purple-100 mb-4">
                    <h3 className="font-medium text-xs text-purple-800 flex items-center mb-1.5">
                      <Share2 className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
                      Transfer to Another User
                    </h3>
                    <p className="text-[10px] text-purple-700">
                      Send funds to another user instantly. You only need their registered email address.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="recipientEmail" className="text-xs">
                        Recipient Email
                      </Label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          id="recipientEmail"
                          placeholder="Enter recipient email address"
                          className="pl-8 h-8 text-xs"
                          type="email"
                          value={internalTransfer.email}
                          onChange={(e) => setInternalTransfer({ ...internalTransfer, email: e.target.value })}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="internalAmount" className="text-xs">
                        Amount to Transfer
                      </Label>
                      <div className="relative">
                        <div className="absolute left-2.5 top-2 text-gray-500 text-xs">$</div>
                        <Input
                          id="internalAmount"
                          placeholder="0.00"
                          className="pl-7 h-8 text-xs"
                          type="number"
                          value={internalTransfer.amount}
                          onChange={(e) => setInternalTransfer({ ...internalTransfer, amount: e.target.value })}
                          disabled={isProcessing}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">
                        Available balance: {formatCurrency(balanceData?.walletBalance || 0)}
                      </p>
                    </div>
                    <Button
                      className="w-full mt-3 bg-purple-600 hover:bg-purple-700 h-8 text-xs"
                      onClick={handleInternalTransfer}
                      disabled={
                        isProcessing ||
                        !internalTransfer.email ||
                        !internalTransfer.amount ||
                        Number.parseFloat(internalTransfer.amount) <= 0
                      }
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="mr-1.5 h-3 w-3 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="mr-1.5 h-3 w-3" />
                          Transfer Funds
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                {/* Platform Transfer */}
                <TabsContent value="platform" className="space-y-4 mt-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-md border border-blue-100 mb-4">
                    <h3 className="font-medium text-xs text-blue-800 flex items-center mb-1.5">
                      <Server className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                      Trading Platform Transfer
                    </h3>
                    <p className="text-[10px] text-blue-700">
                      Transfer funds to your MT4/MT5 trading accounts. Your funds will be available for trading
                      immediately.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="platform" className="text-xs">
                          Platform
                        </Label>
                        <Select
                          value={platformTransfer.platform}
                          onValueChange={(value) => setPlatformTransfer({ ...platformTransfer, platform: value })}
                          disabled={isProcessing}
                        >
                          <SelectTrigger id="platform" className="w-full h-8 text-xs">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MT4" className="text-xs">
                              MetaTrader 4
                            </SelectItem>
                            <SelectItem value="MT5" className="text-xs">
                              MetaTrader 5
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="accountType" className="text-xs">
                          Account Type
                        </Label>
                        <Select
                          value={platformTransfer.accountType}
                          onValueChange={(value) => setPlatformTransfer({ ...platformTransfer, accountType: value })}
                          disabled={isProcessing}
                        >
                          <SelectTrigger id="accountType" className="w-full h-8 text-xs">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="live" className="text-xs">
                              Live Account
                            </SelectItem>
                            <SelectItem value="demo" className="text-xs">
                              Demo Account
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="accountId" className="text-xs">
                        Account ID
                      </Label>
                      <div className="relative">
                        <CreditCard className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          id="accountId"
                          placeholder="Enter MT4/MT5 account ID"
                          className="pl-8 h-8 text-xs"
                          value={platformTransfer.accountId}
                          onChange={(e) => setPlatformTransfer({ ...platformTransfer, accountId: e.target.value })}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="platformAmount" className="text-xs">
                        Amount to Transfer
                      </Label>
                      <div className="relative">
                        <div className="absolute left-2.5 top-2 text-gray-500 text-xs">$</div>
                        <Input
                          id="platformAmount"
                          placeholder="0.00"
                          className="pl-7 h-8 text-xs"
                          type="number"
                          value={platformTransfer.amount}
                          onChange={(e) => setPlatformTransfer({ ...platformTransfer, amount: e.target.value })}
                          disabled={isProcessing}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">
                        Available balance:{" "}
                        {formatCurrency(
                          platformTransfer.accountType === "demo"
                            ? balanceData?.demoBalance || 0
                            : balanceData?.walletBalance || 0,
                        )}
                      </p>
                    </div>

                    <div className="pt-1.5">
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 h-8 text-xs"
                        onClick={handlePlatformTransfer}
                        disabled={
                          isProcessing ||
                          !platformTransfer.accountId ||
                          !platformTransfer.amount ||
                          Number.parseFloat(platformTransfer.amount) <= 0
                        }
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="mr-1.5 h-3 w-3 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ArrowRightLeft className="mr-1.5 h-3 w-3" />
                            Transfer to Platform
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Bank Transfer (Placeholder) */}
                <TabsContent value="bank" className="space-y-4 mt-4">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-md border border-amber-100 mb-4">
                    <h3 className="font-medium text-xs text-amber-800 flex items-center mb-1.5">
                      <Building className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                      Bank Wire Transfer
                    </h3>
                    <p className="text-[10px] text-amber-700">
                      Transfer funds to your bank account via wire transfer. Processing may take 1-3 business days.
                    </p>
                  </div>

                  <div className="text-center py-10 border border-dashed border-gray-200 rounded-lg">
                    <Server className="h-10 w-10 mx-auto text-gray-300" />
                    <h3 className="mt-3 text-sm font-medium text-gray-600">Coming Soon</h3>
                    <p className="mt-1.5 text-xs text-gray-500 max-w-md mx-auto">
                      Bank wire transfer functionality is currently under development. Please use our withdrawal system
                      to send funds to your bank account.
                    </p>
                    <Button
                      className="mt-3 bg-purple-600 hover:bg-purple-700 h-8 text-xs"
                      onClick={() => (window.location.href = "/withdraw")}
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
  )
}

export default TransferPage
