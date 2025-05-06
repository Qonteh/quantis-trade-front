
"use client"

import { useState, useEffect } from "react"
import { ArrowUpFromLine, CreditCard, Wallet, BanknoteIcon as Bank, DollarSign, Info, AlertCircle, CheckCircle2, Bitcoin, Shield, MessageCircle, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { tradingApi } from "@/services/api"

// Withdrawal methods
const withdrawalMethods = [
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    icon: Bank,
    description: "Withdraw directly to your bank account",
    fee: "0%",
    processingTime: "1-3 business days",
  },
  {
    id: "credit-card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Withdraw to your registered card",
    fee: "1.5%",
    processingTime: "1-2 business days",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: Bitcoin,
    description: "Withdraw using Bitcoin, Ethereum, or other cryptocurrencies",
    fee: "1%",
    processingTime: "10-60 minutes",
  },
  {
    id: "e-wallet",
    name: "E-Wallet",
    icon: Wallet,
    description: "Use popular e-wallets like PayPal, Skrill, or Neteller",
    fee: "1%",
    processingTime: "24 hours",
  },
]

export default function WithdrawPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] = useState("bank-transfer")
  const [step, setStep] = useState(1)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [withdrawalPurpose, setWithdrawalPurpose] = useState("")
  const [accountDetails, setAccountDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tradingAccounts, setTradingAccounts] = useState([])
  const { toast } = useToast()
  
  // Fetch user trading accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true)
        const response = await tradingApi.getMTAccounts()
        if (response && response.data) {
          setTradingAccounts(response.data)
          if (response.data.length > 0) {
            handleAccountSelection(response.data[0].accountId)
          }
        }
      } catch (error) {
        console.error("Error fetching accounts:", error)
        toast({
          title: "Failed to load accounts",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccounts()
  }, [toast])
  
  // Handle account selection
  const handleAccountSelection = (accountId: string) => {
    setSelectedAccount(accountId)
    const account = tradingAccounts.find(acc => acc.accountId === accountId)
    if (account) {
      setAccountDetails(account)
      setSelectedCurrency(account.currency)
    }
  }
  
  const handleContinue = async () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      // Process withdrawal
      try {
        setIsProcessing(true)
        
        // Make API call to withdraw
        await tradingApi.withdraw(parseFloat(amount))
        
        // Success notification
        toast({
          title: "Withdrawal Request Submitted",
          description: `Your withdrawal request for ${formatCurrency(amount)} has been submitted.`,
          variant: "default",
        })
        
        // Reset form
        setAmount("")
        setSelectedWithdrawalMethod("bank-transfer")
        setWithdrawalPurpose("")
        setAgreeToTerms(false)
        
        // Show success state
        setStep(4)
      } catch (error) {
        console.error("Error processing withdrawal:", error)
        toast({
          title: "Withdrawal Failed",
          description: error.response?.data?.error || "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    } else {
      // Reset form and go back to step 1
      setStep(1)
    }
  }
  
  const formatCurrency = (value: any) => {
    const numberValue = Number.parseFloat(value) || 0
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
    }).format(numberValue)
  }

  // Calculate fee based on withdrawal method
  const calculateFee = () => {
    const method = withdrawalMethods.find(m => m.id === selectedWithdrawalMethod)
    if (!method) return 0
    
    const feePercentage = parseFloat(method.fee.replace('%', '')) / 100
    return Number.parseFloat(amount) * feePercentage || 0
  }

  const fee = calculateFee()
  const totalAmount = Number.parseFloat(amount) - fee || 0

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Withdraw Funds</h1>
            <p className="text-sm text-gray-500">
              Withdraw funds from your trading account securely
            </p>
          </div>

          {/* Withdraw Process Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-500"}`}>
                  1
                </div>
                <div className={`h-1 w-12 ${step >= 2 ? "bg-[#7C3AED]" : "bg-gray-200"}`}></div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-500"}`}>
                  2
                </div>
                <div className={`h-1 w-12 ${step >= 3 ? "bg-[#7C3AED]" : "bg-gray-200"}`}></div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-500"}`}>
                  3
                </div>
                <div className={`h-1 w-12 ${step >= 4 ? "bg-[#7C3AED]" : "bg-gray-200"}`}></div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-500"}`}>
                  4
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {step === 1 ? "Enter Details" : step === 2 ? "Withdrawal Method" : step === 3 ? "Confirmation" : "Complete"}
              </div>
            </div>
          </div>

          {/* Step 1: Withdrawal Details */}
          {step === 1 && (
            <Card className="border border-gray-100 shadow-lg overflow-hidden mb-6 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-3">
                    <ArrowUpFromLine className="h-5 w-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Withdrawal Details</CardTitle>
                    <CardDescription className="text-gray-500">Enter your withdrawal information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {/* Select Account */}
                  <div className="grid gap-2">
                    <Label htmlFor="account" className="text-gray-700">Select Account</Label>
                    <Select value={selectedAccount} onValueChange={handleAccountSelection} disabled={isLoading}>
                      <SelectTrigger id="account" className="w-full bg-white border-gray-200">
                        <SelectValue placeholder={isLoading ? "Loading accounts..." : "Select your trading account"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Trading Accounts</SelectLabel>
                          {tradingAccounts.length > 0 ? (
                            tradingAccounts.map((account) => (
                              <SelectItem key={account.accountId} value={account.accountId}>
                                {account.platform} {account.accountId} ({account.currency} {account.balance.toFixed(2)})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-accounts" disabled>No accounts available</SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Account Information */}
                  {accountDetails && (
                    <div className="bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-4 rounded-lg border border-[#7C3AED]/20">
                      <div className="flex items-center mb-3">
                        <Info className="h-5 w-5 text-[#7C3AED] mr-2" />
                        <h3 className="font-medium text-gray-800">Account Information</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-md border border-gray-100">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Account Type</p>
                            <p className="text-sm font-medium">{accountDetails.type === "demo" ? "Demo" : "Live"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Currency</p>
                            <p className="text-sm font-medium">{accountDetails.currency}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Total Balance</p>
                            <p className="text-sm font-medium">{formatCurrency(accountDetails.balance)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Available for Withdrawal</p>
                            <p className="text-sm font-medium">{formatCurrency(accountDetails.freeMargin || accountDetails.balance)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amount */}
                  <div className="grid gap-2">
                    <Label htmlFor="amount" className="text-gray-700">Amount</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        className="pl-10 bg-white border-gray-200"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        max={accountDetails?.freeMargin || accountDetails?.balance || 0}
                      />
                    </div>
                    {accountDetails && (
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Min: 50.00 {accountDetails.currency}</span>
                        <span>Max: {formatCurrency(accountDetails.freeMargin || accountDetails.balance)}</span>
                      </div>
                    )}
                  </div>

                  {/* Withdrawal Purpose */}
                  <div className="grid gap-2">
                    <Label htmlFor="purpose" className="text-gray-700">Withdrawal Purpose</Label>
                    <Select value={withdrawalPurpose} onValueChange={setWithdrawalPurpose}>
                      <SelectTrigger id="purpose" className="w-full bg-white border-gray-200">
                        <SelectValue placeholder="Select purpose of withdrawal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Purpose</SelectLabel>
                          <SelectItem value="profit">Profit Withdrawal</SelectItem>
                          <SelectItem value="investment">Investment Elsewhere</SelectItem>
                          <SelectItem value="personal">Personal Expenses</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Warning */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium text-amber-700">Important Notice</span>
                    </div>
                    <p className="text-sm text-amber-600">
                      Withdrawals can only be processed to accounts registered under your name. Third-party withdrawals are not permitted for security reasons.
                    </p>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <Checkbox 
                      id="terms" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium text-gray-700 leading-none"
                      >
                        Accept terms and conditions
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        I confirm that I am the account holder and that all information provided is accurate. I understand that withdrawals are subject to verification and may take 1-3 business days to process.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button 
                  className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-8"
                  onClick={handleContinue}
                  disabled={!selectedAccount || !amount || Number.parseFloat(amount) <= 0 || !withdrawalPurpose || !agreeToTerms || (accountDetails && Number.parseFloat(amount) > (accountDetails.freeMargin || accountDetails.balance))}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Withdrawal Method */}
          {step === 2 && (
            <Card className="border border-gray-100 shadow-lg overflow-hidden mb-6 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Select Withdrawal Method</CardTitle>
                    <CardDescription className="text-gray-500">Choose how you want to receive your funds</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {/* Withdrawal Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
                    <div className="flex items-center mb-3">
                      <Info className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium text-gray-800">Withdrawal Summary</h3>
                    </div>
                    <div className="space-y-3 bg-white p-4 rounded-md border border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account:</span>
                        <span className="text-sm font-medium">
                          {accountDetails?.platform} {accountDetails?.accountId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="text-sm font-medium">{formatCurrency(Number.parseFloat(amount) || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Fee:</span>
                        <span className="text-sm font-medium text-red-500">-{formatCurrency(fee)}</span>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total to Receive:</span>
                        <span className="text-lg font-bold">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Methods */}
                  <div className="grid gap-4">
                    <Label className="text-gray-800 text-base">Withdrawal Method</Label>
                    <RadioGroup 
                      value={selectedWithdrawalMethod} 
                      onValueChange={setSelectedWithdrawalMethod}
                      className="grid gap-3"
                    >
                      {withdrawalMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                          <Label
                            htmlFor={method.id}
                            className="flex flex-1 items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-[#7C3AED] peer-data-[state=checked]:bg-[#7C3AED]/5 [&:has([data-state=checked])]:border-[#7C3AED] [&:has([data-state=checked])]:bg-[#7C3AED]/5"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#7C3AED]/10 to-[#9D6FFF]/10 flex items-center justify-center">
                                <method.icon className="h-6 w-6 text-[#7C3AED]" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{method.name}</div>
                                <div className="text-sm text-gray-500">{method.description}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-700">Fee: {method.fee}</div>
                              <div className="text-sm text-gray-500">{method.processingTime}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-2">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium text-blue-700">Secure Withdrawal Processing</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      All withdrawals are processed securely. For your protection, additional verification may be required for large withdrawals or if this is a new withdrawal method.
                    </p>
                  </div>

                  {/* Processing Time Notice */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-gray-700 mr-2" />
                      <span className="font-medium text-gray-800">Processing Time</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Withdrawal requests are typically processed within 24 hours. The time it takes for funds to reach your account depends on the withdrawal method selected and your financial institution.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-8"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card className="border border-gray-100 shadow-lg overflow-hidden mb-6 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-3">
                    <CheckCircle2 className="h-5 w-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Confirm Withdrawal</CardTitle>
                    <CardDescription className="text-gray-500">Please review your withdrawal details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {/* Withdrawal Details */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-base font-medium text-gray-800 mb-4">Withdrawal Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-md border border-gray-100">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Account</p>
                          <p className="text-sm font-medium">{accountDetails?.platform} {accountDetails?.accountId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Currency</p>
                          <p className="text-sm font-medium">{selectedCurrency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Purpose</p>
                          <p className="text-sm font-medium">
                            {withdrawalPurpose === 'profit' ? 'Profit Withdrawal' :
                             withdrawalPurpose === 'investment' ? 'Investment Elsewhere' :
                             withdrawalPurpose === 'personal' ? 'Personal Expenses' : 'Other'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="text-sm font-medium">{formatCurrency(Number.parseFloat(amount) || 0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fee</p>
                          <p className="text-sm font-medium text-red-500">-{formatCurrency(fee)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total to Receive</p>
                          <p className="text-sm font-bold">{formatCurrency(totalAmount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Method Details */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-base font-medium text-gray-800 mb-4">Withdrawal Method Details</h3>
                    
                    {selectedWithdrawalMethod === 'bank-transfer' && (
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <Label htmlFor="bank-name" className="text-gray-700">Bank Name</Label>
                          <Input id="bank-name" placeholder="Enter your bank name" className="bg-white border-gray-200" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-3">
                            <Label htmlFor="account-number" className="text-gray-700">Account Number</Label>
                            <Input id="account-number" placeholder="Enter your account number" className="bg-white border-gray-200" />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="swift-code" className="text-gray-700">SWIFT/BIC Code</Label>
                            <Input id="swift-code" placeholder="Enter SWIFT/BIC code" className="bg-white border-gray-200" />
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="account-holder" className="text-gray-700">Account Holder Name</Label>
                          <Input id="account-holder" placeholder="Enter account holder name" className="bg-white border-gray-200" />
                        </div>
                      </div>
                    )}

                    {selectedWithdrawalMethod === 'credit-card' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-3">
                            <Label htmlFor="card-number" className="text-gray-700">Card Number (last 4 digits)</Label>
                            <Input id="card-number" placeholder="Enter last 4 digits only" maxLength={4} className="bg-white border-gray-200" />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="card-holder" className="text-gray-700">Card Holder Name</Label>
                            <Input id="card-holder" placeholder="Enter card holder name" className="bg-white border-gray-200" />
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                          <p className="text-xs text-blue-600">
                            For security reasons, withdrawals can only be made to the card used for deposits.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedWithdrawalMethod === 'crypto' && (
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <Label htmlFor="crypto-type" className="text-gray-700">Cryptocurrency</Label>
                          <Select defaultValue="btc">
                            <SelectTrigger id="crypto-type" className="bg-white border-gray-200">
                              <SelectValue placeholder="Select cryptocurrency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                              <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                              <SelectItem value="usdt">Tether (USDT)</SelectItem>
                              <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="wallet-address" className="text-gray-700">Wallet Address</Label>
                          <Input id="wallet-address" placeholder="Enter your wallet address" className="bg-white border-gray-200" />
                        </div>
                        <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
                          <p className="text-xs text-amber-600">
                            Please double-check your wallet address. Transactions sent to incorrect addresses cannot be recovered.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedWithdrawalMethod === 'e-wallet' && (
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <Label htmlFor="ewallet-type" className="text-gray-700">E-Wallet Provider</Label>
                          <Select defaultValue="paypal">
                            <SelectTrigger id="ewallet-type" className="bg-white border-gray-200">
                              <SelectValue placeholder="Select e-wallet provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="skrill">Skrill</SelectItem>
                              <SelectItem value="neteller">Neteller</SelectItem>
                              <SelectItem value="perfectmoney">Perfect Money</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="ewallet-email" className="text-gray-700">E-Wallet Email/ID</Label>
                          <Input id="ewallet-email" type="email" placeholder="Enter your e-wallet email or ID" className="bg-white border-gray-200" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Final Confirmation */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium text-amber-700">Important Notice</span>
                    </div>
                    <p className="text-sm text-amber-600">
                      Please verify all details before confirming your withdrawal. Once submitted, withdrawal requests cannot be easily modified. By proceeding, you confirm that all information provided is accurate.
                    </p>
                  </div>

                  {/* Final Checkbox */}
                  <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <Checkbox 
                      id="final-confirm" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="final-confirm"
                        className="text-sm font-medium text-gray-700 leading-none"
                      >
                        Confirm withdrawal request
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        I confirm that all information is correct and I authorize QuantisFX to process this withdrawal request.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-8"
                  onClick={handleContinue}
                  disabled={!agreeToTerms || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Confirm Withdrawal"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <Card className="border border-gray-100 shadow-lg overflow-hidden mb-6 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Withdrawal Request Submitted</CardTitle>
                    <CardDescription className="text-gray-500">Your request has been received</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
                    <p className="text-center text-green-800 text-lg mb-2">
                      Thank you for your withdrawal request!
                    </p>
                    <p className="text-center text-green-600">
                      Your request has been submitted and is now being processed.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-base font-medium text-gray-800 mb-3">Withdrawal Status</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Reference Number:</span>
                          <span className="text-sm font-medium">WDR-{Date.now().toString().substring(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="text-sm font-medium">{formatCurrency(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Method:</span>
                          <span className="text-sm font-medium">
                            {withdrawalMethods.find(m => m.id === selectedWithdrawalMethod)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
                        </div>
                      </div>
                      
                      <div className="pt-3 space-y-2">
                        <Label className="text-sm text-gray-700">Estimated Completion</Label>
                        <Progress value={25} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Request Received</span>
                          <span>Verification</span>
                          <span>Processing</span>
                          <span>Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <Info className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium text-blue-700">What happens next?</span>
                    </div>
                    <p className="text-sm text-blue-600 mb-3">
                      Our team will now verify your withdrawal request. This usually takes 24-48 hours. Once verified, the funds will be sent to your selected withdrawal method.
                    </p>
                    <p className="text-sm text-blue-600">
                      You can check the status of your withdrawal in your transaction history.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white"
                    >
                      Go to Dashboard
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      New Withdrawal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Withdrawal Information */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base text-gray-800">Withdrawal Process</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-[#7C3AED]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Submit withdrawal request</p>
                      <p className="text-xs text-gray-500">Complete the form with your withdrawal details</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-[#7C3AED]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Verification</p>
                      <p className="text-xs text-gray-500">Our compliance team verifies your request</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-[#7C3AED]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Processing</p>
                      <p className="text-xs text-gray-500">Finance department processes your withdrawal</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-[#7C3AED]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Funds sent</p>
                      <p className="text-xs text-gray-500">Money is transferred to your selected method</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base text-gray-800">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-500 mb-3">
                  If you have any questions or need assistance with your withdrawal, our support team is here to help
                  24/7.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full text-xs h-9">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                  <Button variant="outline" className="w-full text-xs h-9">
                    <Info className="h-4 w-4 mr-2" />
                    FAQ
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
