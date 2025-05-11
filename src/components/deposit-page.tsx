"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  Smartphone,
  ArrowLeft,
  Copy,
  Clock,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import DashboardSidebar from "./dashboard-sidebar"

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

// Hardcoded trading accounts
const hardcodedAccounts = [
  {
    accountId: "MT5-12345678",
    platform: "MT5",
    currency: "USD",
    balance: 10250.75,
    type: "live",
    leverage: "1:100",
    server: "QuantisFX-Live01",
  },
  {
    accountId: "MT5-DEMO12345",
    platform: "MT5",
    currency: "USD",
    balance: 50000.0,
    type: "demo",
    leverage: "1:500",
    server: "QuantisFX-Demo01",
  },
  {
    accountId: "MT4-87654321",
    platform: "MT4",
    currency: "EUR",
    balance: 5430.25,
    type: "live",
    leverage: "1:200",
    server: "QuantisFX-Live02",
  },
]

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
  { code: "TZS", name: "Tanzanian Shilling" },
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
    id: "mobile-money",
    name: "Mobile Money",
    icon: Smartphone,
    description: "Pay using mobile money services",
    fee: "1%",
    processingTime: "5-30 minutes",
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

// Tanzania Mobile Money Providers
const mobileMoneyProviders = [
  {
    id: "vodacom",
    name: "Vodacom M-Pesa",
    logo: "/placeholder.svg?height=60&width=60&text=M-Pesa",
    color: "#E60000",
    accountNumber: "0755123456",
    ussdCode: "*150*00#",
    instructions: "Send money to the number above and enter the transaction ID below",
  },
  {
    id: "tigo",
    name: "Tigo Pesa",
    logo: "/placeholder.svg?height=60&width=60&text=Tigo",
    color: "#0066B3",
    accountNumber: "0652123456",
    ussdCode: "*150*01#",
    instructions: "Send money to the number above and enter the transaction ID below",
  },
  {
    id: "airtel",
    name: "Airtel Money",
    logo: "/placeholder.svg?height=60&width=60&text=Airtel",
    color: "#FF0000",
    accountNumber: "0784123456",
    ussdCode: "*150*60#",
    instructions: "Send money to the number above and enter the transaction ID below",
  },
  {
    id: "halotel",
    name: "Halotel Money",
    logo: "/placeholder.svg?height=60&width=60&text=Halotel",
    color: "#8CC63F",
    accountNumber: "0622123456",
    ussdCode: "*150*88#",
    instructions: "Send money to the number above and enter the transaction ID below",
  },
  {
    id: "ttcl",
    name: "TTCL Pesa",
    logo: "/placeholder.svg?height=60&width=60&text=TTCL",
    color: "#00A651",
    accountNumber: "0732123456",
    ussdCode: "*150*71#",
    instructions: "Send money to the number above and enter the transaction ID below",
  },
]

// Bank transfer options
const bankTransferOptions = [
  {
    id: "local-bank",
    name: "Local Bank Transfer",
    description: "Transfer from your local bank account",
    accountName: "QuantisFX Ltd",
    accountNumber: "1234567890",
    bankName: "Standard Chartered Bank",
    swiftCode: "SCBLTZTZ",
    instructions: "Include your account ID as reference",
  },
  {
    id: "international-wire",
    name: "International Wire Transfer",
    description: "Transfer from international bank account",
    accountName: "QuantisFX Global Ltd",
    accountNumber: "GB29NWBK60161331926819",
    bankName: "Barclays Bank",
    swiftCode: "BARCGB22",
    instructions: "Include your account ID as reference",
  },
]

// Crypto options
const cryptoOptions = [
  {
    id: "bitcoin",
    name: "Bitcoin (BTC)",
    address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
    qrCode: "/placeholder.svg?height=150&width=150&text=BTC-QR",
  },
  {
    id: "ethereum",
    name: "Ethereum (ETH)",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    qrCode: "/placeholder.svg?height=150&width=150&text=ETH-QR",
  },
  {
    id: "usdt",
    name: "Tether (USDT)",
    address: "TKrV3XpMgMEMMJGQi3xAjptmEVhUTnEHGH",
    qrCode: "/placeholder.svg?height=150&width=150&text=USDT-QR",
  },
]

// E-wallet options
const eWalletOptions = [
  {
    id: "paypal",
    name: "PayPal",
    email: "payments@quantisfx.com",
    instructions: "Send payment to the email above and include your account ID in the notes",
  },
  {
    id: "skrill",
    name: "Skrill",
    email: "skrill@quantisfx.com",
    instructions: "Send payment to the email above and include your account ID in the notes",
  },
  {
    id: "neteller",
    name: "Neteller",
    email: "neteller@quantisfx.com",
    instructions: "Send payment to the email above and include your account ID in the notes",
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
  const [selectedAccount, setSelectedAccount] = useState(hardcodedAccounts[0].accountId)
  const [amount, setAmount] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-card")
  const [step, setStep] = useState(1)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedMobileProvider, setSelectedMobileProvider] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [selectedBankOption, setSelectedBankOption] = useState("local-bank")
  const [selectedCryptoOption, setSelectedCryptoOption] = useState("bitcoin")
  const [selectedEWalletOption, setSelectedEWalletOption] = useState("paypal")
  const [paymentReference, setPaymentReference] = useState("")
  const [uploadedReceipt, setUploadedReceipt] = useState(null)
  const [depositProgress, setDepositProgress] = useState(0)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Simulate deposit progress for crypto and mobile money
  useEffect(() => {
    let interval
    if (
      step === 3 &&
      (selectedPaymentMethod === "crypto" || selectedPaymentMethod === "mobile-money") &&
      depositProgress < 100
    ) {
      interval = setInterval(() => {
        setDepositProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 100 ? 100 : newProgress
        })
      }, 2000)
    }

    return () => clearInterval(interval)
  }, [step, selectedPaymentMethod, depositProgress])

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
      // For mobile money and crypto, go to waiting screen
      if (selectedPaymentMethod === "mobile-money" || selectedPaymentMethod === "crypto") {
        setStep(3)
        setDepositProgress(10)
        return
      }

      // Process deposit
      try {
        setIsProcessing(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

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
        setStep(4)
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
    } else if (step === 3) {
      // Process deposit after waiting
      setStep(4)
    } else {
      // Reset form and go back to step 1
      setStep(1)
      setSelectedPaymentMethod("credit-card")
      setSelectedMobileProvider("")
      setTransactionId("")
      setAmount("")
      setAgreeToTerms(false)
      setDepositProgress(0)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 2,
    }).format(value)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedReceipt(file)
      toast({
        title: "Receipt uploaded",
        description: `File "${file.name}" has been uploaded.`,
      })
    }
  }

  return (
    <div className="flex">
      <DashboardSidebar isMobile={isMobile} />

      <div className="flex flex-col min-h-screen w-full md:ml-64 transition-all duration-300 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-5 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-3 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9D6FFF] text-white">
                <ArrowDownToLine className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1 bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] bg-clip-text text-transparent">
                Deposit Funds
              </h1>
              <p className="text-xs text-gray-500">Add funds to your trading account quickly and securely</p>
            </div>

            {/* Deposit Process Steps */}
            <div className="mb-6">
              <div className="relative flex items-center justify-between mb-1">
                <div className="absolute left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    step >= 1
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] text-white shadow-md shadow-purple-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    step >= 2
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] text-white shadow-md shadow-purple-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    step >= 3
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] text-white shadow-md shadow-purple-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    step >= 4
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] text-white shadow-md shadow-purple-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  4
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 px-1">
                <span>Details</span>
                <span>Payment</span>
                <span>Process</span>
                <span>Complete</span>
              </div>
            </div>

            {/* Step 1: Deposit Details */}
            {step === 1 && (
              <Card className="border-none shadow-lg overflow-hidden mb-5 bg-white">
                <CardHeader className="p-4 border-b bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#7C3AED]/20 to-[#9D6FFF]/20 flex items-center justify-center mr-3">
                      <ArrowDownToLine className="h-5 w-5 text-[#7C3AED]" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-gray-800">Deposit Details</CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Enter your deposit information
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4">
                    {/* Select Account */}
                    <div className="grid gap-1.5">
                      <Label htmlFor="account" className="text-gray-700 text-xs font-medium">
                        Select Account
                      </Label>
                      <Select value={selectedAccount} onValueChange={setSelectedAccount} disabled={isLoading}>
                        <SelectTrigger id="account" className="w-full bg-white border-gray-200 h-10 rounded-lg text-xs">
                          <SelectValue
                            placeholder={isLoading ? "Loading accounts..." : "Select your trading account"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="text-xs">Trading Accounts</SelectLabel>
                            {hardcodedAccounts.map((account) => (
                              <SelectItem key={account.accountId} value={account.accountId} className="text-xs">
                                {account.platform} {account.accountId} ({account.currency} {account.balance?.toFixed(2)}
                                ) - {account.type.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {selectedAccount && (
                        <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-100">
                          <div className="grid grid-cols-3 gap-2 text-[10px]">
                            <div>
                              <span className="text-gray-500">Platform:</span>
                              <p className="font-medium">
                                {hardcodedAccounts.find((a) => a.accountId === selectedAccount)?.platform}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <p className="font-medium uppercase">
                                {hardcodedAccounts.find((a) => a.accountId === selectedAccount)?.type}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Balance:</span>
                              <p className="font-medium">
                                {hardcodedAccounts.find((a) => a.accountId === selectedAccount)?.currency}{" "}
                                {hardcodedAccounts.find((a) => a.accountId === selectedAccount)?.balance.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Currency Selection */}
                    <div className="grid gap-1.5">
                      <Label htmlFor="currency" className="text-gray-700 text-xs font-medium">
                        Currency
                      </Label>
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger
                          id="currency"
                          className="w-full bg-white border-gray-200 h-10 rounded-lg text-xs"
                        >
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectGroup>
                            <SelectLabel className="text-xs">Select Currency</SelectLabel>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code} className="text-xs">
                                {currency.code} - {currency.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount */}
                    <div className="grid gap-1.5">
                      <Label htmlFor="amount" className="text-gray-700 text-xs font-medium">
                        Amount
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                        </div>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          className="pl-9 bg-white border-gray-200 h-10 rounded-lg text-sm"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 flex justify-between">
                        <span>Min: 100 {selectedCurrency}</span>
                        <span>Recommended: 1,000+ {selectedCurrency}</span>
                      </div>
                    </div>

                    {/* Bonus Information */}
                    {Number.parseFloat(amount) >= 100 && (
                      <div className="bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-3 rounded-lg border border-[#7C3AED]/20">
                        <div className="flex items-center mb-2">
                          <div className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] text-white p-1.5 rounded-full mr-2">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-gray-800 text-xs">Deposit Bonus Available</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mb-3">
                          You qualify for a <span className="text-[#7C3AED] font-medium">{bonus}% deposit bonus</span>{" "}
                          on your deposit of{" "}
                          <span className="font-medium">{formatCurrency(Number.parseFloat(amount))}</span>
                        </p>
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <span className="text-xs text-gray-700">Bonus Amount:</span>
                          <span className="text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] bg-clip-text text-transparent">
                            {formatCurrency(bonusAmount)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bonus Tiers */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 text-blue-500 mr-1.5" />
                        <span className="font-medium text-gray-800 text-xs">Available Bonus Tiers</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {bonusTiers.map((tier, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded-lg border ${
                              Number.parseFloat(amount) >= tier.min &&
                              (tier.max === null || Number.parseFloat(amount) <= tier.max)
                                ? "bg-gradient-to-r from-[#7C3AED]/10 to-[#9D6FFF]/10 border-[#7C3AED]/30"
                                : "bg-gray-50 border-gray-100"
                            }`}
                          >
                            <span className="text-[10px] text-gray-700">
                              {tier.min.toLocaleString()} - {tier.max ? tier.max.toLocaleString() : "∞"}{" "}
                              {selectedCurrency}
                            </span>
                            <Badge className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-[10px] h-5">
                              {tier.percentage}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                        className="mt-0.5 data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED] h-3.5 w-3.5"
                      />
                      <div className="grid gap-1 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-xs font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Accept terms and conditions
                        </label>
                        <p className="text-[10px] text-gray-500 mt-1">
                          QuantisFX does not accept third party payments. I confirm that my account name with QuantisFX
                          matches the account holder name on my used payment method.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 border-t border-gray-100 flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-6 h-9 rounded-lg shadow-md shadow-purple-200 transition-all hover:shadow-lg text-xs"
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
              <Card className="border-none shadow-lg overflow-hidden mb-5 bg-white">
                <CardHeader className="p-4 border-b bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#7C3AED]/20 to-[#9D6FFF]/20 flex items-center justify-center mr-3">
                      <CreditCard className="h-5 w-5 text-[#7C3AED]" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-gray-800">Select Payment Method</CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Choose how you want to deposit funds
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4">
                    {/* Deposit Summary */}
                    <div className="bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-3 rounded-lg border border-[#7C3AED]/20 mb-1">
                      <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 text-[#7C3AED] mr-1.5" />
                        <h3 className="font-medium text-gray-800 text-xs">Deposit Summary</h3>
                      </div>
                      <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-gray-600">Account:</span>
                          <span className="text-[11px] font-medium">
                            {hardcodedAccounts.find((acc) => acc.accountId === selectedAccount)?.platform || ""}{" "}
                            {selectedAccount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-gray-600">Amount:</span>
                          <span className="text-[11px] font-medium">
                            {formatCurrency(Number.parseFloat(amount) || 0)}
                          </span>
                        </div>
                        {bonusAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-600">Bonus ({bonus}%):</span>
                            <span className="text-[11px] font-medium text-[#7C3AED]">
                              {formatCurrency(bonusAmount)}
                            </span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">Total:</span>
                          <span className="text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] bg-clip-text text-transparent">
                            {formatCurrency((Number.parseFloat(amount) || 0) + bonusAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="grid gap-3">
                      <Label className="text-gray-800 text-xs font-medium">Payment Method</Label>
                      <RadioGroup
                        value={selectedPaymentMethod}
                        onValueChange={setSelectedPaymentMethod}
                        className="grid gap-2"
                      >
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                            <Label
                              htmlFor={method.id}
                              className="flex flex-1 items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-3 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-[#7C3AED] peer-data-[state=checked]:bg-[#7C3AED]/5 [&:has([data-state=checked])]:border-[#7C3AED] [&:has([data-state=checked])]:bg-[#7C3AED]/5 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7C3AED]/10 to-[#9D6FFF]/10 flex items-center justify-center">
                                  <method.icon className="h-4.5 w-4.5 text-[#7C3AED]" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800 text-xs">{method.name}</div>
                                  <div className="text-[10px] text-gray-500">{method.description}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-gray-700 text-[11px]">Fee: {method.fee}</div>
                                <div className="text-[10px] text-gray-500">{method.processingTime}</div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Mobile Money Providers (if selected) */}
                    {selectedPaymentMethod === "mobile-money" && (
                      <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-medium text-gray-800 mb-3">Select Mobile Money Provider</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {mobileMoneyProviders.map((provider) => (
                            <div
                              key={provider.id}
                              onClick={() => setSelectedMobileProvider(provider.id)}
                              className={`cursor-pointer p-2 rounded-lg border-2 transition-all ${
                                selectedMobileProvider === provider.id
                                  ? "border-[#7C3AED] bg-[#7C3AED]/5"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex flex-col items-center text-center">
                                <div
                                  className="w-12 h-12 mb-2 rounded-lg p-1.5 flex items-center justify-center"
                                  style={{ backgroundColor: `${provider.color}20` }}
                                >
                                  <img
                                    src={provider.logo || "/placeholder.svg"}
                                    alt={provider.name}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                                <span className="text-[10px] font-medium">{provider.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {selectedMobileProvider && (
                          <div className="mt-4 bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-3 rounded-lg border border-[#7C3AED]/20">
                            <h4 className="font-medium mb-2 text-xs">Payment Instructions</h4>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 mb-3">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] text-gray-600">Account Number:</span>
                                <div className="flex items-center">
                                  <span className="text-[11px] font-medium mr-1.5">
                                    {mobileMoneyProviders.find((p) => p.id === selectedMobileProvider)?.accountNumber}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      copyToClipboard(
                                        mobileMoneyProviders.find((p) => p.id === selectedMobileProvider)
                                          ?.accountNumber,
                                      )
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] text-gray-600">USSD Code:</span>
                                <span className="text-[11px] font-medium">
                                  {mobileMoneyProviders.find((p) => p.id === selectedMobileProvider)?.ussdCode}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-600 mt-1.5 pt-1.5 border-t border-gray-100">
                                {mobileMoneyProviders.find((p) => p.id === selectedMobileProvider)?.instructions}
                              </p>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="transaction-id" className="text-xs">
                                Transaction ID
                              </Label>
                              <Input
                                id="transaction-id"
                                placeholder="Enter transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="bg-white h-9 text-xs"
                              />
                              <div className="mt-1">
                                <Label htmlFor="receipt" className="mb-1 block text-xs">
                                  Upload Receipt (Optional)
                                </Label>
                                <Input
                                  id="receipt"
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handleFileUpload}
                                  className="bg-white h-9 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bank Transfer Options (if selected) */}
                    {selectedPaymentMethod === "bank-transfer" && (
                      <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-medium text-gray-800 mb-3">Bank Transfer Options</h3>

                        <Tabs defaultValue="local-bank" onValueChange={setSelectedBankOption}>
                          <TabsList className="grid w-full grid-cols-2 mb-3 h-8">
                            <TabsTrigger value="local-bank" className="text-[10px]">
                              Local Bank Transfer
                            </TabsTrigger>
                            <TabsTrigger value="international-wire" className="text-[10px]">
                              International Wire
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent
                            value="local-bank"
                            className="bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-3 rounded-lg border border-[#7C3AED]/20"
                          >
                            <div className="bg-white p-3 rounded-lg border border-gray-100">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-[11px] text-gray-600">Bank Name:</span>
                                  <span className="text-[11px] font-medium">{bankTransferOptions[0].bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] text-gray-600">Account Name:</span>
                                  <span className="text-[11px] font-medium">{bankTransferOptions[0].accountName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] text-gray-600">Account Number:</span>
                                  <div className="flex items-center">
                                    <span className="text-[11px] font-medium mr-1.5">
                                      {bankTransferOptions[0].accountNumber}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => copyToClipboard(bankTransferOptions[0].accountNumber)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] text-gray-600">Swift Code:</span>
                                  <span className="text-[11px] font-medium">{bankTransferOptions[0].swiftCode}</span>
                                </div>
                                <Separator className="my-1.5" />
                                <div className="pt-1">
                                  <p className="text-[10px] text-gray-600">
                                    <span className="font-medium">Important:</span>{" "}
                                    {bankTransferOptions[0].instructions}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 grid gap-2">
                              <Label htmlFor="payment-reference" className="text-xs">
                                Payment Reference
                              </Label>
                              <Input
                                id="payment-reference"
                                placeholder="Enter payment reference"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                className="bg-white h-9 text-xs"
                              />
                              <div className="mt-1">
                                <Label htmlFor="bank-receipt" className="mb-1 block text-xs">
                                  Upload Receipt (Optional)
                                </Label>
                                <Input
                                  id="bank-receipt"
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handleFileUpload}
                                  className="bg-white h-9 text-xs"
                                />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent
                            value="international-wire"
                            className="bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-3 rounded-lg border border-[#7C3AED]/20"
                          >
                            <div className="bg-white p-3 rounded-lg border border-gray-100">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-[11px] text-gray-600">Bank Name:</span>
                                  <span className="text-[11px] font-medium">{bankTransferOptions[1].bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] text-gray-600">Account Name:</span>
                                  <span className="text-[11px] font-medium">{bankTransferOptions[1].accountName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] text-gray-600">IBAN:</span>
                                  <div className="flex items-center">
                                    <span className="text-[11px] font-medium mr-1.5">
                                      {bankTransferOptions[1].accountNumber}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => copyToClipboard(bankTransferOptions[1].accountNumber)}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] text-gray-600">Swift Code:</span>
                                  <span className="text-[11px] font-medium">{bankTransferOptions[1].swiftCode}</span>
                                </div>
                                <Separator className="my-1.5" />
                                <div className="pt-1">
                                  <p className="text-[10px] text-gray-600">
                                    <span className="font-medium">Important:</span>{" "}
                                    {bankTransferOptions[1].instructions}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 grid gap-2">
                              <Label htmlFor="international-reference" className="text-xs">
                                Payment Reference
                              </Label>
                              <Input
                                id="international-reference"
                                placeholder="Enter payment reference"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                className="bg-white h-9 text-xs"
                              />
                              <div className="mt-1">
                                <Label htmlFor="international-receipt" className="mb-1 block text-xs">
                                  Upload Receipt (Optional)
                                </Label>
                                <Input
                                  id="international-receipt"
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handleFileUpload}
                                  className="bg-white h-9 text-xs"
                                />
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}

                    {/* Crypto Options (if selected) */}
                    {selectedPaymentMethod === "crypto" && (
                      <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-medium text-gray-800 mb-3">Select Cryptocurrency</h3>

                        <Tabs defaultValue="bitcoin" onValueChange={setSelectedCryptoOption}>
                          <TabsList className="grid w-full grid-cols-3 mb-3 h-8">
                            <TabsTrigger value="bitcoin" className="text-[10px]">
                              Bitcoin
                            </TabsTrigger>
                            <TabsTrigger value="ethereum" className="text-[10px]">
                              Ethereum
                            </TabsTrigger>
                            <TabsTrigger value="usdt" className="text-[10px]">
                              USDT
                            </TabsTrigger>
                          </TabsList>

                          {cryptoOptions.map((option) => (
                            <TabsContent
                              key={option.id}
                              value={option.id}
                              className="bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-3 rounded-lg border border-[#7C3AED]/20"
                            >
                              <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="bg-white p-2 rounded-lg border border-gray-100 flex items-center justify-center">
                                  <img
                                    src={option.qrCode || "/placeholder.svg"}
                                    alt={`${option.name} QR Code`}
                                    className="w-28 h-28 object-contain"
                                  />
                                </div>

                                <div className="flex-1 space-y-3">
                                  <div>
                                    <Label className="text-[11px] text-gray-600 mb-1 block">
                                      {option.name} Address:
                                    </Label>
                                    <div className="flex items-center bg-white p-2 rounded-lg border border-gray-200">
                                      <span className="text-[10px] font-mono text-gray-800 truncate mr-1.5">
                                        {option.address}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 ml-auto flex-shrink-0"
                                        onClick={() => copyToClipboard(option.address)}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                                    <div className="flex items-start">
                                      <AlertCircle className="h-3.5 w-3.5 text-amber-500 mr-1.5 mt-0.5" />
                                      <div>
                                        <p className="text-[11px] text-amber-700 font-medium">Important</p>
                                        <p className="text-[10px] text-amber-600">
                                          Send only {option.name} to this address. Sending any other cryptocurrency may
                                          result in permanent loss.
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="crypto-tx-id" className="text-xs">
                                      Transaction ID (Optional)
                                    </Label>
                                    <Input
                                      id="crypto-tx-id"
                                      placeholder="Enter transaction ID"
                                      value={transactionId}
                                      onChange={(e) => setTransactionId(e.target.value)}
                                      className="bg-white h-9 text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    )}

                    {/* E-Wallet Options (if selected) */}
                    {selectedPaymentMethod === "e-wallet" && (
                      <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-xs font-medium text-gray-800 mb-3">Select E-Wallet</h3>

                        <Tabs defaultValue="paypal" onValueChange={setSelectedEWalletOption}>
                          <TabsList className="grid w-full grid-cols-3 mb-3 h-8">
                            <TabsTrigger value="paypal" className="text-[10px]">
                              PayPal
                            </TabsTrigger>
                            <TabsTrigger value="skrill" className="text-[10px]">
                              Skrill
                            </TabsTrigger>
                            <TabsTrigger value="neteller" className="text-[10px]">
                              Neteller
                            </TabsTrigger>
                          </TabsList>

                          {eWalletOptions.map((option) => (
                            <TabsContent
                              key={option.id}
                              value={option.id}
                              className="bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 p-3 rounded-lg border border-[#7C3AED]/20"
                            >
                              <div className="bg-white p-3 rounded-lg border border-gray-100 mb-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-[11px] text-gray-600">E-Wallet:</span>
                                    <span className="text-[11px] font-medium">{option.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[11px] text-gray-600">Email:</span>
                                    <div className="flex items-center">
                                      <span className="text-[11px] font-medium mr-1.5">{option.email}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => copyToClipboard(option.email)}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <Separator className="my-1.5" />
                                  <div className="pt-1">
                                    <p className="text-[10px] text-gray-600">
                                      <span className="font-medium">Instructions:</span> {option.instructions}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="ewallet-reference" className="text-xs">
                                  Transaction ID / Reference
                                </Label>
                                <Input
                                  id="ewallet-reference"
                                  placeholder="Enter transaction ID or reference"
                                  value={transactionId}
                                  onChange={(e) => setTransactionId(e.target.value)}
                                  className="bg-white h-9 text-xs"
                                />
                                <div className="mt-1">
                                  <Label htmlFor="ewallet-receipt" className="mb-1 block text-xs">
                                    Upload Receipt (Optional)
                                  </Label>
                                  <Input
                                    id="ewallet-receipt"
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileUpload}
                                    className="bg-white h-9 text-xs"
                                  />
                                </div>
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    )}

                    {/* Security Notice */}
                    <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 mt-1">
                      <div className="flex items-center mb-1">
                        <Shield className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                        <span className="font-medium text-blue-700 text-[11px]">Secure Payment Processing</span>
                      </div>
                      <p className="text-[10px] text-blue-600">
                        All transactions are secured with SSL encryption. Your financial information is never stored on
                        our servers. We use industry-standard security measures to protect your data.
                      </p>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                      <div className="flex items-center mb-1">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                        <span className="font-medium text-amber-700 text-[11px]">Important Notice</span>
                      </div>
                      <p className="text-[10px] text-amber-600">
                        Please note that if you are using a new payment method that was not used before, your deposit
                        might take up to 24 hours to be reviewed and processed. For faster processing, use a previously
                        verified payment method.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5 border-t border-gray-100 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-lg text-xs h-9">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                    Back
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-6 h-9 rounded-lg shadow-md shadow-purple-200 transition-all hover:shadow-lg text-xs"
                    onClick={handleContinue}
                    disabled={
                      isProcessing ||
                      (selectedPaymentMethod === "mobile-money" && !selectedMobileProvider) ||
                      (selectedPaymentMethod === "mobile-money" && !transactionId)
                    }
                  >
                    {isProcessing ? "Processing..." : "Continue"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 3: Processing */}
            {step === 3 && (
              <Card className="border-none shadow-lg overflow-hidden mb-5 bg-white">
                <CardHeader className="p-4 border-b bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#7C3AED]/20 to-[#9D6FFF]/20 flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-[#7C3AED]" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-gray-800">Processing Your Deposit</CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Please wait while we process your payment
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4">
                    <div className="text-center py-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#7C3AED]/10 to-[#9D6FFF]/10 flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-10 w-10 text-[#7C3AED] animate-pulse" />
                      </div>
                      <h3 className="text-base font-medium text-gray-800 mb-1.5">
                        {depositProgress < 100 ? "Processing Your Payment" : "Payment Received"}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
                        {depositProgress < 100
                          ? `We're waiting to confirm your ${
                              selectedPaymentMethod === "mobile-money"
                                ? "mobile money transfer"
                                : "cryptocurrency payment"
                            }. This usually takes a few minutes.`
                          : "Your payment has been confirmed and is being processed."}
                      </p>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span>Progress</span>
                          <span>{Math.round(depositProgress)}%</span>
                        </div>
                        <Progress value={depositProgress} className="h-2 bg-gray-100" />
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-left mb-4">
                        <div className="flex items-start">
                          <Info className="h-4 w-4 text-blue-500 mr-1.5 mt-0.5" />
                          <div>
                            <p className="text-[11px] text-blue-700 font-medium">What's happening?</p>
                            <p className="text-[10px] text-blue-600">
                              {selectedPaymentMethod === "mobile-money"
                                ? "We're verifying your mobile money transfer with our payment provider. This typically takes 5-30 minutes."
                                : "We're waiting for blockchain confirmations for your transaction. This typically takes 10-60 minutes depending on network congestion."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {depositProgress >= 100 && (
                        <Button
                          className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white px-6 h-9 rounded-lg shadow-md shadow-purple-200 transition-all hover:shadow-lg text-xs"
                          onClick={handleContinue}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <Card className="border-none shadow-lg overflow-hidden mb-5 bg-white">
                <CardHeader className="p-4 border-b bg-gradient-to-r from-[#7C3AED]/5 to-[#9D6FFF]/5">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-gray-800">Deposit Successful</CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        Your deposit has been processed
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-3">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-3 border-4 border-green-100">
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <p className="text-center text-green-800 text-sm font-medium mb-1.5">
                          Thank you for your deposit!
                        </p>
                        <p className="text-center text-green-600 text-xs mb-3">
                          Your funds have been added to your account and are ready for trading.
                        </p>
                        <div className="bg-white p-3 rounded-lg border border-green-100 max-w-sm mx-auto">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[11px] text-gray-600">Amount Deposited:</span>
                            <span className="text-xs font-bold">{formatCurrency(Number.parseFloat(amount) || 0)}</span>
                          </div>
                          {bonusAmount > 0 && (
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[11px] text-gray-600">Bonus ({bonus}%):</span>
                              <span className="text-xs font-medium text-[#7C3AED]">{formatCurrency(bonusAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
                            <span className="text-[11px] font-medium">Total Added:</span>
                            <span className="text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] bg-clip-text text-transparent">
                              {formatCurrency((Number.parseFloat(amount) || 0) + bonusAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gradient-to-r from-[#7C3AED] to-[#9D6FFF] hover:from-[#6D28D9] hover:to-[#8B5CF6] text-white h-9 rounded-lg shadow-md shadow-purple-200 transition-all hover:shadow-lg text-xs"
                      >
                        Go to Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleContinue()}
                        className="h-9 rounded-lg border-gray-200 hover:bg-gray-50 text-xs"
                      >
                        Make Another Deposit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deposit Methods Information */}
            <div className="grid md:grid-cols-2 gap-3 mb-5">
              <Card className="border-none shadow-sm">
                <CardHeader className="p-3 pb-1.5">
                  <CardTitle className="text-xs text-gray-800">Why Deposit with QuantisFX?</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <ul className="space-y-1.5">
                    <li className="flex items-center text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                      <span>Fast and secure payment processing</span>
                    </li>
                    <li className="flex items-center text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                      <span>Multiple deposit methods including mobile money</span>
                    </li>
                    <li className="flex items-center text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                      <span>Generous deposit bonuses up to 100%</span>
                    </li>
                    <li className="flex items-center text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader className="p-3 pb-1.5">
                  <CardTitle className="text-xs text-gray-800">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-[11px] text-gray-500 mb-2">
                    If you have any questions or need assistance with your deposit, our support team is here to help
                    24/7.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full text-[10px] h-8 rounded-lg">
                      <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                      Live Chat
                    </Button>
                    <Button variant="outline" className="w-full text-[10px] h-8 rounded-lg">
                      <Info className="h-3.5 w-3.5 mr-1.5" />
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
