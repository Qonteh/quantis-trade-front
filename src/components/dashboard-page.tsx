"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowUpRight,
  AlertCircle,
  Info,
  Copy,
  X,
  ExternalLink,
  ArrowDownRight,
  Server,
  Globe,
  Building,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import MarketTicker from "@/components/dashboard/market-ticker"
import VerificationStatusPanel from "@/components/dashboard/verification-status-panel"
import SupportChat from "@/components/dashboard/support-chat"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/UserContext"
import DashboardSidebar from "./dashboard-sidebar"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("live")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showAccountInfo, setShowAccountInfo] = useState(null)
  const infoCardRef = useRef(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()

  // Market data for the ticker
  const marketData = [
    { pair: "EUR/USD", price: "1.0876", change: "+0.15%", isNegative: false },
    { pair: "GBP/USD", price: "1.2534", change: "+0.25%", isNegative: false },
    { pair: "USD/JPY", price: "148.56", change: "-0.12%", isNegative: true },
    { pair: "BTC/USD", price: "68,432.50", change: "+2.34%", isNegative: false },
    { pair: "ETH/USD", price: "3,542.18", change: "+1.89%", isNegative: false },
    { pair: "XAU/USD", price: "2,324.50", change: "-0.22%", isNegative: true },
  ]

  // Hardcoded trading accounts (one live, one demo)
  const liveAccounts = [
    {
      accountId: "MT5-12345678",
      type: "live",
      platform: "MT5",
      balance: 10250.75,
      equity: 10325.5,
      margin: 1200.25,
      freeMargin: 9125.25,
      marginLevel: 860.28,
      credit: 500,
      leverage: "1:100",
      server: "QuantisFX-Live01",
      broker: "QuantisFX Securities Ltd",
      currency: "USD",
      status: "active",
    },
  ]

  const demoAccounts = [
    {
      accountId: "MT5-DEMO12345",
      type: "demo",
      platform: "MT5",
      balance: 50000.0,
      equity: 49875.25,
      margin: 2500.0,
      freeMargin: 47375.25,
      marginLevel: 1995.01,
      credit: 0,
      leverage: "1:500",
      server: "QuantisFX-Demo01",
      broker: "QuantisFX Securities Demo",
      currency: "USD",
      status: "active",
    },
  ]

  // Calculate account statistics
  const accountStats = {
    equity: liveAccounts.reduce((sum, account) => sum + account.equity, 0),
    credit: liveAccounts.reduce((sum, account) => sum + account.credit, 0),
    deposit: liveAccounts.reduce((sum, account) => sum + account.balance, 0),
  }

  // Format currency with 2 decimal places
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  useEffect(() => {
    // Handle window resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Close info card when clicking outside
    function handleClickOutside(event) {
      if (infoCardRef.current && !infoCardRef.current.contains(event.target)) {
        setShowAccountInfo(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Account information has been copied to clipboard",
    })
  }

  const handleCreateAccount = () => {
    navigate("/platform")
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  // Trading Account Panel Component
  const TradingAccountPanel = ({ account, isDemoAccount = false }) => {
    const isInfoVisible = showAccountInfo === account.accountId

    const toggleInfo = (e) => {
      e.stopPropagation()
      setShowAccountInfo(isInfoVisible ? null : account.accountId)
    }

    const copyAccountInfo = () => {
      const info = `
Account ID: ${account.accountId}
Platform: ${account.platform}
Server: ${account.server}
Broker: ${account.broker}
Leverage: ${account.leverage}
Balance: ${formatCurrency(account.balance)}
Equity: ${formatCurrency(account.equity)}
Margin: ${formatCurrency(account.margin)}
Free Margin: ${formatCurrency(account.freeMargin)}
      `.trim()

      handleCopyToClipboard(info)
    }

    return (
      <div className="p-3 border rounded-lg bg-white relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
          <div className="flex items-center mb-2 md:mb-0">
            <div className="mr-2">
              <Badge variant={isDemoAccount ? "outline" : "default"} className={isDemoAccount ? "" : "bg-[#3d2a87]"}>
                <span className="text-[10px]">{isDemoAccount ? "Demo" : "Live"}</span>
              </Badge>
            </div>
            <div>
              <h3 className="text-xs font-medium">{account.accountId}</h3>
              <p className="text-[10px] text-muted-foreground">
                {account.platform} • {account.leverage}
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={toggleInfo}>
                    <Info className="h-3.5 w-3.5 text-[#3d2a87]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">View account details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">Balance</p>
            <p className="text-xs font-medium">{formatCurrency(account.balance)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Equity</p>
            <p className="text-xs font-medium">{formatCurrency(account.equity)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Margin</p>
            <p className="text-xs font-medium">{formatCurrency(account.margin)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Free Margin</p>
            <p className="text-xs font-medium">{formatCurrency(account.freeMargin)}</p>
          </div>
        </div>

        {/* Account Info Card */}
        {isInfoVisible && (
          <div
            ref={infoCardRef}
            className="absolute right-0 top-12 z-10 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 animate-in fade-in slide-in-from-top-5"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold">Account Details</h4>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowAccountInfo(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-start">
                <Server className="h-3.5 w-3.5 text-[#3d2a87] mt-0.5 mr-2" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Server</p>
                  <p className="text-xs">{account.server}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Globe className="h-3.5 w-3.5 text-[#3d2a87] mt-0.5 mr-2" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Platform</p>
                  <p className="text-xs">{account.platform}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Building className="h-3.5 w-3.5 text-[#3d2a87] mt-0.5 mr-2" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Broker</p>
                  <p className="text-xs">{account.broker}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="text-[10px] h-7 w-full" onClick={copyAccountInfo}>
                <Copy className="h-3 w-3 mr-1" />
                Copy Details
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex">
      <DashboardSidebar isMobile={isMobile} />

      <div className="flex flex-col min-h-screen w-full md:ml-64 transition-all duration-300">
        <DashboardHeader marketData={marketData} isMobile={isMobile} />
        <MarketTicker initialData={marketData} />

        <main className="flex-1 p-4 space-y-4 md:p-6 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <DashboardStats
              equity={accountStats.equity}
              credit={accountStats.credit}
              deposit={accountStats.deposit}
              formatCurrency={formatCurrency}
            />

            <div className="grid gap-4 mt-8">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2 border-0 shadow-sm">
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
                    <Tabs defaultValue="live" className="w-full" value={activeTab} onValueChange={handleTabChange}>
                      <TabsList className="mb-2">
                        <TabsTrigger value="live">Live Accounts</TabsTrigger>
                        <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
                      </TabsList>
                      <TabsContent value="live">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-6">
                            <p className="text-sm text-gray-500">Loading accounts...</p>
                          </div>
                        ) : liveAccounts.length > 0 ? (
                          <div className="space-y-4">
                            {liveAccounts.map((account, index) => (
                              <TradingAccountPanel key={account.accountId || index} account={account} />
                            ))}
                            <div className="flex justify-center mt-4">
                              <Button onClick={handleCreateAccount} variant="outline" size="sm">
                                Create Another Live Account
                              </Button>
                            </div>
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
                        ) : demoAccounts.length > 0 ? (
                          <div className="space-y-4">
                            {demoAccounts.map((account, index) => (
                              <TradingAccountPanel
                                key={account.accountId || index}
                                account={account}
                                isDemoAccount={true}
                              />
                            ))}
                            <div className="flex justify-center mt-4">
                              <Button onClick={handleCreateAccount} variant="outline" size="sm">
                                Create Another Demo Account
                              </Button>
                            </div>
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

                
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>Verification Status</CardTitle>
                    <CardDescription>Complete your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VerificationStatusPanel user={user} />
                  </CardContent>
                </Card>

                
              </div>
            </div>

            <div className="mt-8">
              <SupportChat />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
