
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import DashboardSidebar from "./dashboard-sidebar"
import Navigation from "./Navigation"

export default function WithdrawPage() {
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>("")
  const [selectedAccount, setSelectedAccount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [cryptoAddress, setCryptoAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // Available trading accounts (in a real app, this would come from an API)
  const tradingAccounts = [
    { id: "1", name: "Standard Account", balance: 5000, currency: "USD" },
    { id: "2", name: "ECN Account", balance: 2500, currency: "USD" },
  ]
  
  // Format currency helper function
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount);
  }

  // Format number with commas
  const formatNumber = (amount: number | string | 0) => {
    // Convert to string first if it's a number, or use "0" if it's 0
    const amountFormatted = (amount === 0 ? "0" : amount.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return amountFormatted;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    
    // Basic validation
    if (!withdrawAmount || parseFloat(withdrawAmount.toString()) <= 0) {
      setError("Please enter a valid withdrawal amount")
      return
    }
    
    if (!selectedAccount) {
      setError("Please select an account")
      return
    }
    
    if (!withdrawMethod) {
      setError("Please select a withdrawal method")
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
    }
    
    // Check if withdrawal amount exceeds account balance
    const account = tradingAccounts.find(acc => acc.id === selectedAccount)
    if (account && parseFloat(withdrawAmount.toString()) > account.balance) {
      setError(`Insufficient funds. Your available balance is ${formatCurrency(account.balance)}`)
      return
    }
    
    try {
      setIsLoading(true)
      
      // In a real app, this would call an API endpoint
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message and toast
      setSuccessMessage(`Your withdrawal request for ${formatCurrency(withdrawAmount)} has been submitted successfully. It will be processed within 1-3 business days.`)
      toast({
        title: "Withdrawal request submitted",
        description: `Your request for ${formatCurrency(withdrawAmount)} is being processed.`,
        variant: "default",
      })
      
      // Reset form
      setWithdrawAmount("")
      setSelectedAccount("")
      setWithdrawMethod("")
      setBankName("")
      setAccountNumber("")
      setAccountName("")
      setSwiftCode("")
      setCryptoAddress("")
      
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
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="flex flex-1">
        <DashboardSidebar isMobile={isMobile} />
        
        <main className="flex-1 p-4 md:ml-64 transition-all duration-300">
          <div className="max-w-3xl mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Withdraw Funds</h1>
            
            {successMessage ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="text-green-600 w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Withdrawal Request Submitted</h2>
                  <p className="text-gray-600 mb-6">{successMessage}</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate("/dashboard")} variant="outline">
                      Back to Dashboard
                    </Button>
                    <Button onClick={() => setSuccessMessage("")}>
                      New Withdrawal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Request a Withdrawal</CardTitle>
                  <CardDescription>
                    Withdraw funds from your trading account to your bank account or crypto wallet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="account">Select Account</Label>
                        <Select
                          value={selectedAccount}
                          onValueChange={setSelectedAccount}
                        >
                          <SelectTrigger id="account">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {tradingAccounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name} - {formatCurrency(account.balance)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="amount">Withdrawal Amount (USD)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">$</span>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="pl-8"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="method">Withdrawal Method</Label>
                        <Select
                          value={withdrawMethod}
                          onValueChange={setWithdrawMethod}
                        >
                          <SelectTrigger id="method">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="crypto">Cryptocurrency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {withdrawMethod === "bank" && (
                        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                          <h3 className="font-medium">Bank Details</h3>
                          
                          <div>
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input
                              id="bankName"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="accountName">Account Holder Name</Label>
                            <Input
                              id="accountName"
                              value={accountName}
                              onChange={(e) => setAccountName(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input
                              id="accountNumber"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                            <Input
                              id="swiftCode"
                              value={swiftCode}
                              onChange={(e) => setSwiftCode(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                      
                      {withdrawMethod === "crypto" && (
                        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                          <h3 className="font-medium">Cryptocurrency Details</h3>
                          
                          <div>
                            <Label htmlFor="cryptoAddress">Wallet Address</Label>
                            <Input
                              id="cryptoAddress"
                              value={cryptoAddress}
                              onChange={(e) => setCryptoAddress(e.target.value)}
                            />
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            <p>Please double-check your wallet address before submitting.</p>
                            <p>We support BTC, ETH, USDT (ERC-20), and USDC withdrawals.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Processing..." : "Submit Withdrawal Request"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex-col border-t px-6 py-4">
                  <div className="text-sm text-gray-500 space-y-2">
                    <p>
                      <strong>Processing time:</strong> Withdrawals are typically processed within 1-3 business days.
                    </p>
                    <p>
                      <strong>Minimum withdrawal:</strong> $100 USD
                    </p>
                    <p>
                      <strong>Need help?</strong> Contact our support team at support@quantisfx.com
                    </p>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
