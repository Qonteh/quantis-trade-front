"use client"

import { useState } from "react"
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

  // Calculate bonus based on amount
  const calculateBonus = (amount) => {
    const numAmount = Number.parseFloat(amount) || 0
    if (numAmount < 100) return 0

    const tier = bonusTiers.find((tier) => numAmount >= tier.min && (tier.max === null || numAmount <= tier.max))

    return tier ? tier.percentage : 0
  }

  const bonus = calculateBonus(amount)
  const bonusAmount = Number.parseFloat(amount) * (bonus / 100) || 0

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else {
      // Handle form submission
      console.log("Form submitted", {
        currency: selectedCurrency,
        account: selectedAccount,
        amount,
        paymentMethod: selectedPaymentMethod,
      })
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
            <Card className="border-none shadow-sm overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-4 pb-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                    <ArrowDownToLine className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Deposit Details</CardTitle>
                    <CardDescription>Enter your deposit information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4">
                <div className="grid gap-4">
                  {/* Select Account */}
                  <div className="grid gap-2">
                    <Label htmlFor="account">Select Account</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger id="account" className="w-full">
                        <SelectValue placeholder="Select your trading account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Trading Accounts</SelectLabel>
                          <SelectItem value="account1">QFX7654321 MT5 (USD 0.00 / USD 0.00)</SelectItem>
                          <SelectItem value="account2">QFX7654322 MT5 (EUR 0.00 / EUR 0.00)</SelectItem>
                          <SelectItem value="account3">QFX7654323 MT5 (GBP 0.00 / GBP 0.00)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency Selection */}
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger id="currency" className="w-full">
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
                      />
                    </div>
                  </div>

                  {/* Bonus Information */}
                  {Number.parseFloat(amount) >= 100 && (
                    <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#9D6FFF]/10 p-3 rounded-lg border border-[#7C3AED]/20">
                      <div className="flex items-center mb-2">
                        <CheckCircle2 className="h-5 w-5 text-[#7C3AED] mr-2" />
                        <span className="text-sm font-medium">Deposit Bonus Available</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        You qualify for a {bonus}% deposit bonus on your deposit of{" "}
                        {formatCurrency(Number.parseFloat(amount))}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Bonus Amount:</span>
                        <span className="text-sm font-medium text-[#7C3AED]">{formatCurrency(bonusAmount)}</span>
                      </div>
                    </div>
                  )}

                  {/* Bonus Tiers */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-2">
                      <Info className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-xs font-medium">Available Bonus Tiers</span>
                    </div>
                    <div className="space-y-2">
                      {bonusTiers.map((tier, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            {tier.min} - {tier.max ? tier.max : "∞"} {selectedCurrency}:
                          </span>
                          <Badge className="bg-[#7C3AED] hover:bg-[#6D28D9]">{tier.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
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
                        Equiti does not accept third party payments. I confirm that my account name with Equiti matches
                        the account holder name on my used payment method.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10 p-4 flex justify-end">
                <Button
                  className="bg-[#7C3AED] hover:bg-[#6D28D9]"
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
            <Card className="border-none shadow-sm overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-4 pb-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                    <CreditCard className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Select Payment Method</CardTitle>
                    <CardDescription>Choose how you want to deposit funds</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-4">
                <div className="grid gap-4">
                  {/* Deposit Summary */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Deposit Summary</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Account:</span>
                        <span className="text-xs font-medium">QFX7654321 MT5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Amount:</span>
                        <span className="text-xs font-medium">{formatCurrency(Number.parseFloat(amount) || 0)}</span>
                      </div>
                      {bonusAmount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Bonus ({bonus}%):</span>
                          <span className="text-xs font-medium text-[#7C3AED]">{formatCurrency(bonusAmount)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Total:</span>
                        <span className="text-sm font-bold">
                          {formatCurrency((Number.parseFloat(amount) || 0) + bonusAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid gap-3">
                    <Label>Payment Method</Label>
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
                      <span className="text-xs font-medium">Secure Payment Processing</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      All transactions are secured with SSL encryption. Your financial information is never stored on
                      our servers.
                    </p>
                  </div>

                  {/* Warning */}
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-xs font-medium text-amber-700">Important Notice</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      Please note that if you are using a new payment method that was not used before, your deposit
                      might not be applied immediately into your account and might take up to 24 hours to be reviewed
                      and processed. On some occasions we might request a proof that the card or payment account is
                      under your name.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative z-10 p-4 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]" onClick={handleContinue}>
                  Continue to Payment
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Deposit Methods Information */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Why Deposit with Quantis FX?</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ul className="space-y-2">
                  <li className="flex items-center text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Fast and secure payment processing</span>
                  </li>
                  <li className="flex items-center text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Multiple deposit methods available</span>
                  </li>
                  <li className="flex items-center text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>Generous deposit bonuses</span>
                  </li>
                  <li className="flex items-center text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    <span>24/7 customer support</span>
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
                  If you have any questions or need assistance with your deposit, our support team is here to help.
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
