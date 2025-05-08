
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowUpToLine,
  CreditCard,
  Wallet,
  BanknoteIcon as Bank,
  DollarSign,
  Info,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useToast } from "@/hooks/use-toast"
import { tradingApi } from "@/services/api"
import DashboardSidebar from "./dashboard-sidebar"

// Payment methods
const withdrawMethods = [
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
    id: "e-wallet",
    name: "E-Wallet",
    icon: Wallet,
    description: "Use popular e-wallets like PayPal, Skrill, or Neteller",
    fee: "1%",
    processingTime: "Up to 24 hours",
  },
]

export default function WithdrawPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState("bank-transfer")
  const [step, setStep] = useState(1)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [tradingAccounts, setTradingAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch user trading accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true)
        const response = await tradingApi.getMTAccounts()
        if (response && response.data) {
          setTradingAccounts(response.data)
          if (response.data.length > 0) {
            setSelectedAccount(response.data[0].accountId)
            // Set the default currency based on the first account's currency
            if (response.data[0].currency) {
              setSelectedCurrency(response.data[0].currency)
            }
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

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      // Process withdrawal
      try {
        setIsProcessing(true)
        
        // Make API call to withdraw
        await tradingApi.withdraw(parseFloat(amount))
        
        // Success notification
        toast({
          title: "Withdrawal Request Submitted",
          description: `Your withdrawal request for ${formatCurrency(amount)} has been submitted for processing.`,
          variant: "default",
        })
        
        // Reset form
        setAmount("")
        setSelectedWithdrawMethod("bank-transfer")
        setAgreeToTerms(false)
        
        // Show success state or redirect to dashboard
        setStep(3)
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
      navigate("/dashboard")
    }
  }

  const formatCurrency = (value) => {
    // Ensure value is treated as a string to avoid type issues
    const numValue = typeof value === 'string' ? parseFloat(value || '0') : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
    }).format(numValue);
  }

  const getSelectedAccount = () => {
    return tradingAccounts.find(account => account.accountId === selectedAccount) || {}
  }
  
  const accountBalance = getSelectedAccount()?.balance || 0
  const withdrawFee = selectedWithdrawMethod === "bank-transfer" ? 0 : 
    selectedWithdrawMethod === "credit-card" ? parseFloat(amount) * 0.015 : 
    parseFloat(amount) * 0.01
  
  // Calculate net amount
  const netWithdrawalAmount = parseFloat(amount || 0) - withdrawFee

  return (
    <div className="flex">
      <DashboardSidebar isMobile={isMobile} />
      
      <div className="flex flex-col min-h-screen w-full md:ml-64 transition-all duration-300 bg-[#f8fafc]">
        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Withdraw Funds</h1>
              <p className="text-sm text-gray-500">Withdraw funds from your trading account to your bank or preferred payment method</p>
            </div>

            {/* Withdrawal Process Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    1
                  </div>
                  <div className={`h-1 w-12 ${step >= 2 ? "bg-[#7C3AED]" : "bg-gray-200"}`}></div>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    2
                  </div>
                  <div className={`h-1 w-12 ${step >= 3 ? "bg-[#7C3AED]" : "bg-gray-200"}`}></div>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    3
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {step === 1 ? "Enter Details" : step === 2 ? "Withdrawal Method" : "Confirmation"}
                </div>
              </div>
            </div>

            {/* Step 1: Withdrawal Details */}
            {step === 1 && (
              <Card className="border border-gray-100 shadow-lg overflow-hidden mb-6 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-3">
                      <ArrowUpToLine className="h-5 w-5 text-[#7C3AED]" />
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
                      <Select value={selectedAccount} onValueChange={(value) => {
                        setSelectedAccount(value);
                        const account = tradingAccounts.find(acc => acc.accountId === value);
                        if (account?.currency) {
                          setSelectedCurrency(account.currency);
                        }
                      }} disabled={isLoading}>
                        <SelectTrigger id="account" className="w-full bg-white border-gray-200">
                          <SelectValue placeholder={isLoading ? "Loading accounts..." : "Select your trading account"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Trading Accounts</SelectLabel>
                            {tradingAccounts.length > 0 ? (
                              tradingAccounts.map((account) => (
                                <SelectItem key={account.accountId} value={account.accountId}>
                                  {account.platform} {account.accountId} ({account.currency} {account.balance?.toFixed(2)})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-accounts" disabled>No accounts available</SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Account Balance Information */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-3">
                        <Info className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-800">Account Balance</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-sm text-gray-700">Available for withdrawal:</span>
                        <span className="text-lg font-medium">{formatCurrency(accountBalance)}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="grid gap-2">
                      <Label htmlFor="amount" className="text-gray-700">Withdrawal Amount</Label>
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
                          max={accountBalance}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex justify-between">
                        <span>Min: 50 {selectedCurrency}</span>
                        <span>Max: {formatCurrency(accountBalance)}</span>
                      </div>
                    </div>

                    {/* Warning Information */}
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <span className="font-medium text-amber-700">Important Notice</span>
                      </div>
                      <p className="text-sm text-amber-600">
                        Withdrawals are processed according to the source of deposit policy. Funds will be returned to the same source from which they were deposited. Any profits can be withdrawn via your preferred method.
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
                          className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Accept terms and conditions
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                          I confirm that these are my own personal funds and the account details provided belong to me. I understand that withdrawals are subject to verification and may take 1-3 business days to process.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-8"
                    onClick={handleContinue}
                    disabled={!selectedAccount || !amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > accountBalance || !agreeToTerms}
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
                      <Wallet className="h-5 w-5 text-[#7C3AED]" />
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
                            {getSelectedAccount().platform} {selectedAccount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Withdrawal Amount:</span>
                          <span className="text-sm font-medium">{formatCurrency(parseFloat(amount) || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Fee:</span>
                          <span className="text-sm font-medium">{formatCurrency(withdrawFee)}</span>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Net Amount:</span>
                          <span className="text-lg font-bold">
                            {formatCurrency(netWithdrawalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Withdraw Methods */}
                    <div className="grid gap-4">
                      <Label className="text-gray-800 text-base">Withdrawal Method</Label>
                      <RadioGroup
                        value={selectedWithdrawMethod}
                        onValueChange={setSelectedWithdrawMethod}
                        className="grid gap-3"
                      >
                        {withdrawMethods.map((method) => (
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
                        All withdrawals undergo security verification to protect your funds. Make sure your account is fully verified to ensure smooth processing.
                      </p>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <span className="font-medium text-amber-700">Processing Time</span>
                      </div>
                      <p className="text-sm text-amber-600">
                        Withdrawal requests are processed within 24 hours. The actual time your funds arrive in your account depends on your payment provider and may take 1-3 business days.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-8"
                    onClick={handleContinue}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Complete Withdrawal"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <Card className="border border-gray-100 shadow-lg overflow-hidden mb-6 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">Withdrawal Request Submitted</CardTitle>
                      <CardDescription className="text-gray-500">Your request is being processed</CardDescription>
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
                        Your request has been successfully submitted and is now being processed. You will receive an email notification when the funds are sent.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-3">Withdrawal Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="text-sm font-medium">{formatCurrency(parseFloat(amount) || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Fee:</span>
                          <span className="text-sm font-medium">{formatCurrency(withdrawFee)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Net Amount:</span>
                          <span className="text-sm font-medium">{formatCurrency(netWithdrawalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Method:</span>
                          <span className="text-sm font-medium">
                            {withdrawMethods.find(m => m.id === selectedWithdrawMethod)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Expected Processing Time:</span>
                          <span className="text-sm font-medium">
                            {withdrawMethods.find(m => m.id === selectedWithdrawMethod)?.processingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => navigate("/dashboard")}
                        className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white"
                      >
                        Go to Dashboard
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Make Another Withdrawal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help Information */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base text-gray-800">Withdrawal Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span>Fast processing of withdrawal requests</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span>Multiple withdrawal methods available</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span>Low fees and transparent pricing</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span>Secure withdrawal process</span>
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
    </div>
  )
}

