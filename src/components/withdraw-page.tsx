"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Info, Smartphone, Building2, Bitcoin, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/context/UserContext"

export default function WithdrawPage() {
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("bank")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [cryptoAddress, setCryptoAddress] = useState("")
  const [cryptoNetwork, setCryptoNetwork] = useState("BTC")
  const [mobileProvider, setMobileProvider] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()

  // Get user verification status from UserContext
  const isFullyVerified = user?.isVerified || false
  const withdrawalLimit = isFullyVerified ? null : 2000

  // Available trading accounts (in a real app, this would come from an API)
  const tradingAccounts = [
    { id: "1", name: "Standard Account", balance: 5000, currency: "USD" },
    { id: "2", name: "ECN Account", balance: 2500, currency: "USD" },
  ]

  // Format currency helper function
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
    if (isNaN(numAmount)) return "$0.00"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount)
  }

  // Format number with commas
  const formatNumber = (amount: number | string | 0) => {
    // Convert to string first if it's a number, or use "0" if it's 0
    const amountFormatted = (amount === 0 ? "0" : amount.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return amountFormatted
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    // Basic validation
    if (!withdrawAmount || Number.parseFloat(withdrawAmount.toString()) <= 0) {
      setError("Please enter a valid withdrawal amount")
      return
    }

    if (!selectedAccount) {
      setError("Please select an account")
      return
    }

    // Method-specific validation
    if (withdrawMethod === "bank") {
      if (!bankName || !accountNumber || !accountName || !swiftCode) {
        setError("Please fill in all bank details")
        return
      }
    } else if (withdrawMethod === "crypto") {
      if (!cryptoAddress) {
        setError("Please enter a crypto wallet address")
        return
      }
    } else if (withdrawMethod === "mobile") {
      if (!mobileProvider || !mobileNumber) {
        setError("Please fill in all mobile money details")
        return
      }
    }

    // Check if withdrawal exceeds limit for non-verified users
    const withdrawalAmountNum = Number.parseFloat(withdrawAmount.toString())
    if (!isFullyVerified && withdrawalAmountNum > 2000) {
      setError(`Withdrawal amount exceeds your limit of $2,000. Please verify your identity to increase this limit.`)
      toast({
        title: "Verification required",
        description: "Complete identity verification to increase your withdrawal limit.",
        variant: "destructive",
      })
      return
    }

    // Check if withdrawal amount exceeds account balance
    const account = tradingAccounts.find((acc) => acc.id === selectedAccount)
    if (account && withdrawalAmountNum > account.balance) {
      setError(`Insufficient funds. Your available balance is ${formatCurrency(account.balance)}`)
      return
    }

    try {
      setIsLoading(true)

      // In a real app, this would call an API endpoint
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message and toast
      setSuccessMessage(
        `Your withdrawal request for ${formatCurrency(withdrawAmount)} has been submitted successfully. It will be processed within 1-3 business days.`,
      )
      toast({
        title: "Withdrawal request submitted",
        description: `Your request for ${formatCurrency(withdrawAmount)} is being processed.`,
        variant: "default",
      })

      // Reset form
      setWithdrawAmount("")
      setSelectedAccount("")
      setBankName("")
      setAccountNumber("")
      setAccountName("")
      setSwiftCode("")
      setCryptoAddress("")
      setCryptoNetwork("BTC")
      setMobileProvider("")
      setMobileNumber("")
    } catch (err) {
      console.error("Withdrawal error:", err)
      setError("Failed to process withdrawal. Please try again.")

      toast({
        title: "Withdrawal failed",
        description: "An error occurred while processing your request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc]">
      {/* Header with Logo */}
      <header className="bg-white border-b border-gray-100 py-3 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <img src="/logo.jpg" alt="QuantisFX" className="h-10 w-auto" />
        </div>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-[#5a2ca0]">Withdraw Funds</h1>

              <div className="bg-white border border-gray-100 rounded-lg p-2.5 shadow-sm">
                <div className="text-xs text-gray-500">Available Balance</div>
                <div className="text-xl font-bold text-[#5a2ca0]">
                  {formatCurrency(
                    selectedAccount ? tradingAccounts.find((acc) => acc.id === selectedAccount)?.balance || 0 : 0,
                  )}
                </div>
              </div>
            </div>

            {!isFullyVerified && (
              <Alert variant="warning" className="mb-5 bg-purple-50 border-purple-200">
                <Info className="h-4 w-4 text-[#5a2ca0]" />
                <AlertTitle className="text-sm text-[#5a2ca0]">Withdrawal Limit</AlertTitle>
                <AlertDescription className="text-xs text-[#5a2ca0]">
                  Your current withdrawal limit is $2,000.{" "}
                  <a href="/verify" className="underline cursor-pointer font-medium">
                    Complete identity verification
                  </a>{" "}
                  to remove this limit.
                </AlertDescription>
              </Alert>
            )}

            {successMessage ? (
              <Card className="shadow-md border-purple-100 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-[#5a2ca0] to-[#8a4fff]"></div>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-5">
                    <Check className="text-[#5a2ca0] w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-[#5a2ca0]">Withdrawal Request Submitted</h2>
                  <p className="text-gray-600 mb-6 text-sm">{successMessage}</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full px-5 border-[#5a2ca0] text-[#5a2ca0] hover:bg-purple-50"
                    >
                      <a href="/dashboard">Back to Dashboard</a>
                    </Button>
                    <Button
                      onClick={() => setSuccessMessage("")}
                      size="sm"
                      className="rounded-full px-5 bg-[#5a2ca0] hover:bg-[#4a2080]"
                    >
                      New Withdrawal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#5a2ca0] to-[#8a4fff]"></div>
                <CardHeader className="border-b bg-white py-4">
                  <CardTitle className="text-lg font-medium text-[#5a2ca0]">Request a Withdrawal</CardTitle>
                  <CardDescription className="text-xs">
                    Withdraw funds from your trading account to your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-5 bg-white">
                  {error && (
                    <Alert variant="destructive" className="mb-5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <AlertTitle className="text-sm">Error</AlertTitle>
                      <AlertDescription className="text-xs">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <Label htmlFor="account" className="text-sm mb-1.5 block text-gray-700">
                          Select Account
                        </Label>
                        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                          <SelectTrigger
                            id="account"
                            className="h-10 text-sm border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                          >
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {tradingAccounts.map((account) => (
                              <SelectItem key={account.id} value={account.id} className="text-sm">
                                {account.name} - {formatCurrency(account.balance)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="amount" className="text-sm mb-1.5 block text-gray-700">
                          Withdrawal Amount (USD)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="pl-7 h-10 text-sm border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                        </div>
                        {!isFullyVerified && (
                          <p className="text-xs text-[#5a2ca0] mt-1">
                            Maximum withdrawal: $2,000. Verify your identity to increase this limit.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm mb-1.5 block text-gray-700">Withdrawal Method</Label>

                      <Tabs
                        defaultValue="bank"
                        value={withdrawMethod}
                        onValueChange={setWithdrawMethod}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-3 mb-4 bg-purple-50 p-0.5">
                          <TabsTrigger
                            value="bank"
                            className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-[#5a2ca0] data-[state=active]:shadow-sm"
                          >
                            <Building2 className="h-3.5 w-3.5" />
                            <span>Bank Transfer</span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="crypto"
                            className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-[#5a2ca0] data-[state=active]:shadow-sm"
                          >
                            <Bitcoin className="h-3.5 w-3.5" />
                            <span>Cryptocurrency</span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="mobile"
                            className="flex items-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-[#5a2ca0] data-[state=active]:shadow-sm"
                          >
                            <Smartphone className="h-3.5 w-3.5" />
                            <span>Mobile Money</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="bank" className="border rounded-lg p-4 bg-white border-gray-100">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="bankName" className="text-xs mb-1.5 block text-gray-700">
                                Bank Name
                              </Label>
                              <Input
                                id="bankName"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="h-9 text-sm border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                              />
                            </div>

                            <div>
                              <Label htmlFor="accountName" className="text-xs mb-1.5 block text-gray-700">
                                Account Holder Name
                              </Label>
                              <Input
                                id="accountName"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                className="h-9 text-sm border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                              />
                            </div>

                            <div>
                              <Label htmlFor="accountNumber" className="text-xs mb-1.5 block text-gray-700">
                                Account Number
                              </Label>
                              <Input
                                id="accountNumber"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="h-9 text-sm border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                              />
                            </div>

                            <div>
                              <Label htmlFor="swiftCode" className="text-xs mb-1.5 block text-gray-700">
                                SWIFT/BIC Code
                              </Label>
                              <Input
                                id="swiftCode"
                                value={swiftCode}
                                onChange={(e) => setSwiftCode(e.target.value)}
                                className="h-9 text-sm border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                              />
                            </div>
                          </div>

                          <div className="mt-4 bg-purple-50 p-3 rounded-md text-[#5a2ca0] text-xs">
                            <p className="font-medium">Important Information:</p>
                            <ul className="list-disc pl-5 mt-1.5 space-y-0.5">
                              <li>Bank transfers typically take 1-3 business days to process</li>
                              <li>International transfers may incur additional fees from intermediary banks</li>
                              <li>Ensure your bank account details match your verified identity</li>
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="crypto" className="border rounded-lg p-4 bg-white border-gray-100">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cryptoNetwork" className="text-xs mb-1.5 block text-gray-700">
                                Select Cryptocurrency
                              </Label>
                              <RadioGroup
                                value={cryptoNetwork}
                                onValueChange={setCryptoNetwork}
                                className="grid grid-cols-2 md:grid-cols-4 gap-2"
                              >
                                <Label
                                  htmlFor="crypto-btc"
                                  className="flex flex-col items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50 [&:has([data-state=checked])]:border-[#5a2ca0] [&:has([data-state=checked])]:bg-purple-50"
                                >
                                  <RadioGroupItem value="BTC" id="crypto-btc" className="sr-only" />
                                  <Bitcoin className="mb-2 h-5 w-5 text-orange-500" />
                                  <span className="text-xs font-medium">Bitcoin</span>
                                </Label>
                                <Label
                                  htmlFor="crypto-eth"
                                  className="flex flex-col items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50 [&:has([data-state=checked])]:border-[#5a2ca0] [&:has([data-state=checked])]:bg-purple-50"
                                >
                                  <RadioGroupItem value="ETH" id="crypto-eth" className="sr-only" />
                                  <svg
                                    className="mb-2 h-5 w-5 text-blue-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M12 2L5 12L12 16L19 12L12 2Z" fill="currentColor" />
                                    <path d="M12 16L5 12L12 22L19 12L12 16Z" fill="currentColor" />
                                  </svg>
                                  <span className="text-xs font-medium">Ethereum</span>
                                </Label>
                                <Label
                                  htmlFor="crypto-usdt"
                                  className="flex flex-col items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50 [&:has([data-state=checked])]:border-[#5a2ca0] [&:has([data-state=checked])]:bg-purple-50"
                                >
                                  <RadioGroupItem value="USDT" id="crypto-usdt" className="sr-only" />
                                  <svg
                                    className="mb-2 h-5 w-5 text-green-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                                    <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" />
                                  </svg>
                                  <span className="text-xs font-medium">USDT</span>
                                </Label>
                                <Label
                                  htmlFor="crypto-usdc"
                                  className="flex flex-col items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50 [&:has([data-state=checked])]:border-[#5a2ca0] [&:has([data-state=checked])]:bg-purple-50"
                                >
                                  <RadioGroupItem value="USDC" id="crypto-usdc" className="sr-only" />
                                  <CreditCard className="mb-2 h-5 w-5 text-blue-500" />
                                  <span className="text-xs font-medium">USDC</span>
                                </Label>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="cryptoAddress" className="text-xs mb-1.5 block text-gray-700">
                                Wallet Address
                              </Label>
                              <Input
                                id="cryptoAddress"
                                value={cryptoAddress}
                                onChange={(e) => setCryptoAddress(e.target.value)}
                                className="h-9 text-xs font-mono border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                                placeholder={`Enter your ${cryptoNetwork} wallet address`}
                              />
                            </div>
                          </div>

                          <div className="mt-4 bg-purple-50 p-3 rounded-md text-[#5a2ca0] text-xs">
                            <p className="font-medium">Important Information:</p>
                            <ul className="list-disc pl-5 mt-1.5 space-y-0.5">
                              <li>Double-check your wallet address before submitting</li>
                              <li>Ensure you're using the correct network for your selected cryptocurrency</li>
                              <li>Crypto withdrawals are typically processed within 24 hours</li>
                              <li>Network fees will be deducted from your withdrawal amount</li>
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="mobile" className="border rounded-lg p-4 bg-white border-gray-100">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="mobileProvider" className="text-xs mb-1.5 block text-gray-700">
                                Mobile Money Provider
                              </Label>
                              <Select value={mobileProvider} onValueChange={setMobileProvider}>
                                <SelectTrigger
                                  id="mobileProvider"
                                  className="h-9 text-sm border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                                >
                                  <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="airtel" className="text-xs">
                                    Airtel
                                  </SelectItem>
                                  <SelectItem value="mixx" className="text-xs">
                                    Mixx by yas
                                  </SelectItem>
                                  <SelectItem value="vodacom" className="text-xs">
                                    Vodacom
                                  </SelectItem>
                                  <SelectItem value="orange" className="text-xs">
                                    Orange Money
                                  </SelectItem>
                                  <SelectItem value="vodafone" className="text-xs">
                                    Vodafone Cash
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="mobileNumber" className="text-xs mb-1.5 block text-gray-700">
                                Mobile Number
                              </Label>
                              <Input
                                id="mobileNumber"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                className="h-9 text-sm border-gray-200 focus:ring-[#5a2ca0] focus:border-[#5a2ca0]"
                                placeholder="e.g. +254712345678"
                              />
                            </div>
                          </div>

                          <div className="mt-4 bg-purple-50 p-3 rounded-md text-[#5a2ca0] text-xs">
                            <p className="font-medium">Important Information:</p>
                            <ul className="list-disc pl-5 mt-1.5 space-y-0.5">
                              <li>Mobile money withdrawals are typically processed within 24 hours</li>
                              <li>Include country code in your mobile number (e.g., +254 for Kenya)</li>
                              <li>The mobile number must be registered under your name</li>
                              <li>Service fees may apply depending on your provider and location</li>
                            </ul>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-10 text-sm font-medium bg-[#5a2ca0] hover:bg-[#4a2080] rounded-md"
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Submit Withdrawal Request"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex-col border-t px-5 py-4 bg-white space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                    <div className="bg-[#f8f9fc] p-3 rounded-md border border-gray-100">
                      <h4 className="font-medium text-[#5a2ca0] mb-1.5 text-xs">Processing Time</h4>
                      <p className="text-xs text-gray-600">
                        Bank: 1-3 business days
                        <br />
                        Crypto: 24 hours
                        <br />
                        Mobile: 24 hours
                      </p>
                    </div>
                    <div className="bg-[#f8f9fc] p-3 rounded-md border border-gray-100">
                      <h4 className="font-medium text-[#5a2ca0] mb-1.5 text-xs">Withdrawal Limits</h4>
                      <p className="text-xs text-gray-600">
                        Minimum: $2000 USD
                        <br />
                        {!isFullyVerified ? (
                          <span>
                            Maximum: $2,000 USD{" "}
                            <a href="/verify" className="text-[#5a2ca0] hover:underline">
                              Verify now
                            </a>
                          </span>
                        ) : (
                          <span>Maximum: No limit</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-[#f8f9fc] p-3 rounded-md border border-gray-100">
                      <h4 className="font-medium text-[#5a2ca0] mb-1.5 text-xs">Need Help?</h4>
                      <p className="text-xs text-gray-600">
                        Contact our support team:
                        <br />
                        <a href="mailto:support@quantisfx.com" className="text-[#5a2ca0] hover:underline">
                          support@quantisfx.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-500 text-center pt-1">
                    All withdrawals are subject to our{" "}
                    <a href="/terms" className="text-[#5a2ca0] hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/fees" className="text-[#5a2ca0] hover:underline">
                      Fee Schedule
                    </a>
                    .
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
