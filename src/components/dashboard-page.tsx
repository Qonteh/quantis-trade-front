
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { MarketTicker } from "@/components/dashboard/market-ticker"
import { TradingAccountPanel } from "@/components/dashboard/trading-account-panel"
import { VerificationStatusPanel } from "@/components/dashboard/verification-status-panel"
import { AccountActionsMenu } from "@/components/dashboard/account-actions-menu"
import { SupportChat } from "@/components/dashboard/support-chat"
import { tradingApi } from "@/services/api"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [tradingAccounts, setTradingAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTradingAccounts = async () => {
      try {
        setIsLoading(true)
        const response = await tradingApi.getMTAccounts()
        if (response && response.data) {
          setTradingAccounts(response.data)
        }
      } catch (error) {
        console.error("Error fetching trading accounts:", error)
        toast({
          title: "Failed to load trading accounts",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTradingAccounts()
  }, [toast])

  const handleCreateAccount = () => {
    navigate("/platform")
  }

  const handleDepositFunds = () => {
    navigate("/deposit")
  }

  const handleWithdrawFunds = () => {
    navigate("/withdraw")
  }

  const handleTransferFunds = () => {
    navigate("/transfer")
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <MarketTicker />

      <main className="flex-1 p-4 space-y-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <DashboardStats />

          <div className="grid gap-4 mt-8">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Trading Accounts</CardTitle>
                    <Button onClick={handleCreateAccount} variant="outline" size="sm">
                      Create Account
                    </Button>
                  </div>
                  <CardDescription>Manage your trading accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="live" className="w-full">
                    <TabsList className="mb-2">
                      <TabsTrigger value="live">Live Accounts</TabsTrigger>
                      <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="live">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <p className="text-sm text-gray-500">Loading accounts...</p>
                        </div>
                      ) : tradingAccounts && tradingAccounts.filter(acc => acc.type === "live").length > 0 ? (
                        <div className="space-y-4">
                          {tradingAccounts
                            .filter(account => account.type === "live")
                            .map((account, index) => (
                              <TradingAccountPanel key={account.accountId || index} account={account} />
                            ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-500 mb-2">No live trading accounts found</p>
                          <Button onClick={handleCreateAccount} variant="outline" size="sm">
                            Create Live Account
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="demo">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <p className="text-sm text-gray-500">Loading accounts...</p>
                        </div>
                      ) : tradingAccounts && tradingAccounts.filter(acc => acc.type === "demo").length > 0 ? (
                        <div className="space-y-4">
                          {tradingAccounts
                            .filter(account => account.type === "demo")
                            .map((account, index) => (
                              <TradingAccountPanel key={account.accountId || index} account={account} />
                            ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-500 mb-2">No demo trading accounts found</p>
                          <Button onClick={handleCreateAccount} variant="outline" size="sm">
                            Create Demo Account
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your funds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={handleDepositFunds} variant="outline" className="w-full justify-start">
                    <span className="mr-2">⬆️</span> Deposit Funds
                  </Button>
                  <Button onClick={handleWithdrawFunds} variant="outline" className="w-full justify-start">
                    <span className="mr-2">⬇️</span> Withdraw Funds
                  </Button>
                  <Button onClick={handleTransferFunds} variant="outline" className="w-full justify-start">
                    <span className="mr-2">↔️</span> Transfer Funds
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Verification Status</CardTitle>
                  <CardDescription>Complete your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 bg-green-400 text-white p-0.5 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Email Verification</h3>
                      <p className="text-xs text-gray-500">Your email has been verified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 bg-yellow-400 text-white p-0.5 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Identity Verification</h3>
                      <p className="text-xs text-gray-500">Upload ID documents</p>
                      <Button size="sm" variant="link" className="h-auto p-0 text-xs" onClick={() => navigate("/verification")}>
                        Complete verification
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 bg-gray-200 text-white p-0.5 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Address Verification</h3>
                      <p className="text-xs text-gray-500">Upload proof of address</p>
                      <Button size="sm" variant="link" className="h-auto p-0 text-xs" onClick={() => navigate("/verification")}>
                        Complete verification
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Market Overview</CardTitle>
                  <CardDescription>Latest market updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Market Update</AlertTitle>
                    <AlertDescription>
                      Major indices are showing volatility due to recent economic data.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">EUR/USD</span>
                        <Badge variant="outline">Forex</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-500">1.0876</span>
                        <span className="text-green-500 text-xs">+0.15%</span>
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Gold</span>
                        <Badge variant="outline">Commodity</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-red-500">2,324.50</span>
                        <span className="text-red-500 text-xs">-0.22%</span>
                        <ArrowUpRight className="h-3 w-3 text-red-500 rotate-90" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">AAPL</span>
                        <Badge variant="outline">Stock</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-500">187.84</span>
                        <span className="text-green-500 text-xs">+1.45%</span>
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="ml-auto" onClick={() => navigate("/trade")}>
                    View Trading Platform
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="mt-8">
            <SupportChat />
          </div>
        </div>
      </main>
    </div>
  )
}
