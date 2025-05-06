
"use client"

import { useState, useEffect } from "react"
import {
  ArrowDownToLine,
  CreditCard,
  Wallet,
  BanknoteIcon as Bank,
  DollarSign,
  Info,
  AlertCircle,
  CheckCircle2,
  Bitcoin,
  Shield,
  MessageCircle,
} from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { tradingApi } from "@/services/api"

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
]

// Payment methods
const paymentMethods = [
  {
    id: "credit-card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Instant deposit with Visa, Mastercard, or other cards",
    fee: "2.5%",
    processingTime: "Instant",
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    icon: Bank,
    description: "Transfer directly from your bank account",
    fee: "0%",
    processingTime: "1-3 business days",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: Bitcoin,
    description: "Deposit using Bitcoin, Ethereum, or other cryptocurrencies",
    fee: "1%",
    processingTime: "10-60 minutes",
  },
  {
    id: "e-wallet",
    name: "E-Wallet",
    icon: Wallet,
    description: "Use popular e-wallets like PayPal, Skrill, or Neteller",
    fee: "1.5%",
    processingTime: "Instant",
  },
]

// Bonus tiers
const bonusTiers = [
  { min: 100, max: 999, percentage: 30 },
  { min: 1000, max: 4999, percentage: 50 },
  { min: 5000, max: 9999, percentage: 75 },
  { min: 10000, max: null, percentage: 100 },
]

export default function DepositPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-card")
  const [step, setStep] = useState(1)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [tradingAccounts, setTradingAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
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
            setSelectedAccount(response.data[0].accountId)
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

  // Calculate bonus based on amount
  const calculateBonus = (amount) => {
    const numAmount = Number.parseFloat(amount) || 0
    if (numAmount < 100) return 0

    const tier = bonusTiers.find((tier) => numAmount >= tier.min && (tier.max === null || numAmount <= tier.max))

    return tier ? tier.percentage : 0
  }

  const bonus = calculateBonus(amount)
  const bonusAmount = Number.parseFloat(amount) * (bonus / 100) || 0

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      // Process deposit
      try {
        setIsProcessing(true)
        
        // Make API call to deposit
        await tradingApi.deposit(parseFloat(amount))
        
        // Success notification
        toast({
          title: "Deposit Successful",
          description: `You have successfully deposited ${formatCurrency(amount)}.`,
          variant: "default",
        })
        
        // Reset form
        setAmount("")
        setSelectedPaymentMethod("credit-card")
        setAgreeToTerms(false)
        
        // Show success state or redirect to dashboard
        setStep(3)
      } catch (error) {
        console.error("Error processing deposit:", error)
        toast({
          title: "Deposit Failed",
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Deposit Funds</h1>
            <p className="text-sm text-gray-500">Add funds to your trading account quickly and securely</p>
          </div>

          {/* Deposit Process Steps */}
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
                {step === 1 ? "Enter Details" : step === 2 ? "Payment Method" : "Confirmation"}
              </div>
            </div>
          </div>

          {/* Step 1: Deposit Details */}
          {step === 1 && (
            <Card className="border border-gray-100 shadow-lg overflow-hidden mb-6 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-3">
                    <ArrowDownToLine className="h-5 w-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Deposit Details</CardTitle>
                    <CardDescription className="text-gray-500">Enter your deposit information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {/* Select Account */}
                  <div className="grid gap-2">
                    <Label htmlFor="account" className="text-gray-700">Select Account</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount} disabled={isLoading}>
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

                  {/* Currency Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="currency" className="text-gray-700">Currency</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger id="currency" className="w-full bg-white border-gray-200">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectGroup>
                          <SelectLabel>Select Currency</SelectLabel>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

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
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>Min: 100 {selectedCurrency}</span>
                      <span>Recommended: 1,000+ {selectedCurrency}</span>
                    </div>
                  </div>

                  {/* Bonus Information */}
                  {Number.parseFloat(amount) >= 100 && (
                    <div className="bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-4 rounded-lg border border-[#7C3AED]/20">
                      <div className="flex items-center mb-3">
                        <div className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] text-white p-1.5 rounded-full mr-2">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-800">Deposit Bonus Available</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        You qualify for a <span className="text-[#7C3AED] font-medium">{bonus}% deposit bonus</span> on your deposit of{" "}
                        <span className="font-medium">{formatCurrency(Number.parseFloat(amount))}</span>
                      </p>
                      <div className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-100">
                        <span className="text-sm text-gray-700">Bonus Amount:</span>
                        <span className="text-lg font-medium text-[#7C3AED]">{formatCurrency(bonusAmount)}</span>
                      </div>
                    </div>
                  )}

                  {/* Bonus Tiers */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-3">
                      <Info className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium text-gray-800">Available Bonus Tiers</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {bonusTiers.map((tier, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-sm text-gray-700">
                            {tier.min.toLocaleString()} - {tier.max ? tier.max.toLocaleString() : "∞"} {selectedCurrency}
                          </span>
                          <Badge className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6]">
                            {tier.percentage}%
                          </Badge>
                        </div>
                      ))}
                    </div>
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
                        QuantisFX does not accept third party payments. I confirm that my account name with QuantisFX matches
                        the account holder name on my used payment method.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button
                  className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-8"
                  onClick={handleContinue}
                  disabled={!selectedAccount || !amount || Number.parseFloat(amount) <= 0 || !agreeToTerms}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <Card className="border border-gray-100 shadow-lg overflow-hidden mb-6 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Select Payment Method</CardTitle>
                    <CardDescription className="text-gray-500">Choose how you want to deposit funds</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {/* Deposit Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
                    <div className="flex items-center mb-3">
                      <Info className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium text-gray-800">Deposit Summary</h3>
                    </div>
                    <div className="space-y-3 bg-white p-4 rounded-md border border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account:</span>
                        <span className="text-sm font-medium">
                          {tradingAccounts.find(acc => acc.accountId === selectedAccount)?.platform || ''} {selectedAccount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="text-sm font-medium">{formatCurrency(Number.parseFloat(amount) || 0)}</span>
                      </div>
                      {bonusAmount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Bonus ({bonus}%):</span>
                          <span className="text-sm font-medium text-[#7C3AED]">{formatCurrency(bonusAmount)}</span>
                        </div>
                      )}
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total:</span>
                        <span className="text-lg font-bold">
                          {formatCurrency((Number.parseFloat(amount) || 0) + bonusAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid gap-4">
                    <Label className="text-gray-800 text-base">Payment Method</Label>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                      className="grid gap-3"
                    >
                      {paymentMethods.map((method) => (
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
                      <span className="font-medium text-blue-700">Secure Payment Processing</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      All transactions are secured with SSL encryption. Your financial information is never stored on
                      our servers. We use industry-standard security measures to protect your data.
                    </p>
                  </div>

                  {/* Warning */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium text-amber-700">Important Notice</span>
                    </div>
                    <p className="text-sm text-amber-600">
                      Please note that if you are using a new payment method that was not used before, your deposit
                      might take up to 24 hours to be reviewed and processed. For faster processing, use a previously
                      verified payment method.
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
                  {isProcessing ? "Processing..." : "Complete Deposit"}
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
                    <CardTitle className="text-xl text-gray-800">Deposit Successful</CardTitle>
                    <CardDescription className="text-gray-500">Your deposit has been processed</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
                    <p className="text-center text-green-800 text-lg mb-2">
                      Thank you for your deposit!
                    </p>
                    <p className="text-center text-green-600">
                      Your funds have been added to your account and are ready for trading.
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
                      Make Another Deposit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deposit Methods Information */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base text-gray-800">Why Deposit with QuantisFX?</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Fast and secure payment processing</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Multiple deposit methods available</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Generous deposit bonuses up to 100%</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>24/7 customer support</span>
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
                  If you have any questions or need assistance with your deposit, our support team is here to help
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
