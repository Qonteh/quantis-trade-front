"use client"

import { useState } from "react"
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

// Add this CSS class to style the progress indicator properly
const progressIndicatorStyles = "bg-gradient-to-r from-[#9D6FFF] to-[#7C3AED]"

// Currency options
const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "THB", name: "Thai Baht" },
  { code: "KRW", name: "South Korean Won" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "RWF", name: "Rwandan Franc" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "KWD", name: "Kuwaiti Dinar" },
]

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

// Mock account data
const accounts = [
  {
    id: "account1",
    name: "QFX7654321 MT5",
    balance: 5250.75,
    currency: "USD",
    available: 5000.00,
  },
  {
    id: "account2",
    name: "QFX7654322 MT5",
    balance: 3200.50,
    currency: "EUR",
    available: 3000.00,
  },
  {
    id: "account3",
    name: "QFX7654323 MT5",
    balance: 2800.25,
    currency: "GBP",
    available: 2500.00,
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
  
  // Handle account selection
  const handleAccountSelection = (accountId: string) => {
    setSelectedAccount(accountId)
    const account = accounts.find(acc => acc.id === accountId)
    if (account) {
      setAccountDetails(account)
      setSelectedCurrency(account.currency)
    }
  }
  
  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      // Handle form submission
      console.log("Form submitted", {
        account: selectedAccount,
        currency: selectedCurrency,
        amount,
        withdrawalMethod: selectedWithdrawalMethod,
        purpose: withdrawalPurpose
      })
    }
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
    }).format(value)
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
              </div>
              <div className="text-xs text-gray-500">
                {step === 1 ? "Enter Details" : step === 2 ? "Withdrawal Method" : "Confirmation"}
              </div>
            </div>
          </div>

          {/* Step 1: Withdrawal Details */}
          {step === 1 && (
            <Card className="border-none shadow-sm overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-4 pb-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                    <ArrowUpFromLine className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Withdrawal Details</CardTitle>
                    <CardDescription>Enter your withdrawal information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4">
                <div className="grid gap-4">
                  {/* Select Account */}
                  <div className="grid gap-2">
                    <Label htmlFor="account">Select Account</Label>
                    <Select value={selectedAccount} onValueChange={handleAccountSelection}>
                      <SelectTrigger id="account" className="w-full">
                        <SelectValue placeholder="Select your trading account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Trading Accounts</SelectLabel>
                          {accounts.map(account => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} ({account.currency} {account.balance.toFixed(2)})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Account Information */}
                  {accountDetails && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Account Information</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Total Balance:</span>
                          <span className="text-xs font-medium">{formatCurrency(accountDetails.balance)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Available for Withdrawal:</span>
                          <span className="text-xs font-medium">{formatCurrency(accountDetails.available)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Currency:</span>
                          <span className="text-xs font-medium">{accountDetails.currency}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amount */}
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        className="pl-10"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        max={accountDetails?.available || 0}
                      />
                    </div>
                    {accountDetails && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: {formatCurrency(50)}</span>
                        <span>Max: {formatCurrency(accountDetails.available)}</span>
                      </div>
                    )}
                  </div>

                  {/* Withdrawal Purpose */}
                  <div className="grid gap-2">
                    <Label htmlFor="purpose">Withdrawal Purpose</Label>
                    <Select value={withdrawalPurpose} onValueChange={setWithdrawalPurpose}>
                      <SelectTrigger id="purpose" className="w-full">
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
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-xs font-medium text-amber-700">Important Notice</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Withdrawals can only be processed to accounts registered under your name. Third-party withdrawals are not permitted.
                    </p>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2 mt-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </label>
                      <p className="text-xs text-gray-500">
                        I confirm that I am the account holder and that all information provided is accurate. I understand that withdrawals are subject to verification.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10 p-4 flex justify-end">
                <Button 
                  className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                  onClick={handleContinue}
                  disabled={!selectedAccount || !amount || Number.parseFloat(amount) <= 0 || !withdrawalPurpose || !agreeToTerms || (accountDetails && Number.parseFloat(amount) > accountDetails.available)}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Withdrawal Method */}
          {step === 2 && (
            <Card className="border-none shadow-sm overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-4 pb-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                    <CreditCard className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Select Withdrawal Method</CardTitle>
                    <CardDescription>Choose how you want to receive your funds</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4">
                <div className="grid gap-4">
                  {/* Withdrawal Summary */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Withdrawal Summary</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Account:</span>
                        <span className="text-xs font-medium">{accountDetails?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Amount:</span>
                        <span className="text-xs font-medium">{formatCurrency(Number.parseFloat(amount) || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Fee:</span>
                        <span className="text-xs font-medium text-red-500">-{formatCurrency(fee)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Total to Receive:</span>
                        <span className="text-sm font-bold">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Methods */}
                  <div className="grid gap-3">
                    <Label>Withdrawal Method</Label>
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
                            className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-200 peer-data-[state=checked]:border-[#7C3AED] [&:has([data-state=checked])]:border-[#7C3AED]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center">
                                <method.icon className="h-5 w-5 text-[#7C3AED]" />
                              </div>
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-xs text-gray-500">{method.description}</div>
                              </div>
                            </div>
                            <div className="text-right text-xs">
                              <div className="font-medium">Fee: {method.fee}</div>
                              <div className="text-gray-500">{method.processingTime}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-[#7C3AED] mr-2" />
                      <span className="text-xs font-medium">Secure Withdrawal Processing</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      All withdrawals are processed securely. For your protection, additional verification may be required for large withdrawals.
                    </p>
                  </div>

                  {/* Processing Time Notice */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-xs font-medium text-blue-700">Processing Time</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Withdrawal requests are typically processed within 24 hours. The time it takes for funds to reach your account depends on the withdrawal method selected.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10 p-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card className="border-none shadow-sm overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-4 pb-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Confirm Withdrawal</CardTitle>
                    <CardDescription>Please review your withdrawal details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4">
                <div className="grid gap-4">
                  {/* Withdrawal Details */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-medium mb-3">Withdrawal Details</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Account</p>
                        <p className="text-sm font-medium">{accountDetails?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Currency</p>
                        <p className="text-sm font-medium">{selectedCurrency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm font-medium">{formatCurrency(Number.parseFloat(amount) || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fee</p>
                        <p className="text-sm font-medium text-red-500">-{formatCurrency(fee)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total to Receive</p>
                        <p className="text-sm font-bold">{formatCurrency(totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Method</p>
                        <p className="text-sm font-medium">
                          {withdrawalMethods.find(m => m.id === selectedWithdrawalMethod)?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Method Details */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium mb-3">Withdrawal Method Details</h3>
                    
                    {selectedWithdrawalMethod === 'bank-transfer' && (
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label htmlFor="bank-name">Bank Name</Label>
                          <Input id="bank-name" placeholder="Enter your bank name" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input id="account-number" placeholder="Enter your account number" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="swift-code">SWIFT/BIC Code</Label>
                          <Input id="swift-code" placeholder="Enter SWIFT/BIC code" />
                        </div>
                      </div>
                    )}

                    {selectedWithdrawalMethod === 'credit-card' && (
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" placeholder="Enter last 4 digits only" maxLength={4} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="card-holder">Card Holder Name</Label>
                          <Input id="card-holder" placeholder="Enter card holder name" />
                        </div>
                      </div>
                    )}

                    {selectedWithdrawalMethod === 'crypto' && (
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label htmlFor="crypto-type">Cryptocurrency</Label>
                          <Select defaultValue="btc">
                            <SelectTrigger id="crypto-type">
                              <SelectValue placeholder="Select cryptocurrency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                              <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                              <SelectItem value="usdt">Tether (USDT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="wallet-address">Wallet Address</Label>
                          <Input id="wallet-address" placeholder="Enter your wallet address" />
                        </div>
                      </div>
                    )}

                    {selectedWithdrawalMethod === 'e-wallet' && (
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label htmlFor="ewallet-type">E-Wallet Provider</Label>
                          <Select defaultValue="paypal">
                            <SelectTrigger id="ewallet-type">
                              <SelectValue placeholder="Select e-wallet provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="skrill">Skrill</SelectItem>
                              <SelectItem value="neteller">Neteller</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="ewallet-email">E-Wallet Email/ID</Label>
                          <Input id="ewallet-email" placeholder="Enter your e-wallet email or ID" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Final Confirmation */}
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-xs font-medium text-amber-700">Important Notice</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Please verify all details before confirming your withdrawal. Once submitted, withdrawal requests cannot be easily modified. By proceeding, you confirm that all information provided is accurate.
                    </p>
                  </div>

                  {/* Final Checkbox */}
                  <div className="flex items-start space-x-2 mt-2">
                    <Checkbox 
                      id="final-confirm" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="final-confirm"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Confirm withdrawal request
                      </label>
                      <p className="text-xs text-gray-500">
                        I confirm that all information is correct and I authorize Quantis FX to process this withdrawal request.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10 p-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button 
                  className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                  onClick={handleContinue}
                  disabled={!agreeToTerms}
                >
                  Confirm Withdrawal
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Withdrawal Information */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Withdrawal Process</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ul className="space-y-2">
                  <li className="flex items-center text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Submit withdrawal request</span>
                  </li>
                  <li className="flex items-center text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Verification by compliance team</span>
                  </li>
                  <li className="flex items-center text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Processing by finance department</span>
                  </li>
                  <li className="flex items-center text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Funds sent to your account</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-gray-500 mb-3">
                  If you have any questions or need assistance with your withdrawal, our support team is here to help.
                </p>
                <Button variant="outline" className="w-full text-xs h-8">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
