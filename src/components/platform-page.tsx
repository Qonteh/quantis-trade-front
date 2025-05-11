"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/UserContext"
import { ExternalLink, Shield, Server, RefreshCw, Wifi, WifiOff, Lock, Globe, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TradingService } from "@/services/api"
import { Progress } from "@/components/ui/progress"

interface ServerStatus {
  server: string
  status: string
  uptime: number
  message: string
}

interface MTAccount {
  accountId: string
  password?: string
  investorPassword?: string
  server: string
  platform: string
  accountType: string
  leverage: string
  balance: number
  equity: number
  margin: number
  freeMargin: number
  type: string
  isActive: boolean
  createdAt: string
}

const PlatformPage: React.FC = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [serverStatuses, setServerStatuses] = useState<ServerStatus[]>([])
  const [mtAccounts, setMtAccounts] = useState<MTAccount[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch server statuses
      const serverResponse = await TradingService.getServerStatus()
      if (serverResponse.data) {
        setServerStatuses(serverResponse.data)
      }

      // Fetch MT accounts
      const accountsResponse = await TradingService.getMTAccounts()
      if (accountsResponse.data) {
        setMtAccounts(accountsResponse.data)
      }
    } catch (error) {
      console.error("Error fetching platform data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Simplified Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.jpg" alt="Logo" className="h-12 w-auto" />
            <span className="ml-3 text-sm font-medium text-gray-800">Trading Platforms</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs flex items-center text-gray-600 hover:text-gray-900"
            onClick={fetchData}
            disabled={isLoading}
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="mb-5">
          <h1 className="text-base font-medium text-gray-800">Trading Platforms</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your MT4/MT5 trading accounts</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 mx-auto animate-spin border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Server className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-600">Loading platform data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main Platform Content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Platform Downloads */}
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                    <Download className="h-3.5 w-3.5 mr-2 text-purple-600" />
                    Download Trading Platforms
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Access our trading platforms on any device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <Card className="border border-gray-100 shadow-sm">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-800">MetaTrader 4</CardTitle>
                        <CardDescription className="text-[10px] text-gray-500">
                          Robust trading platform for forex trading
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-8 flex items-center justify-center border-gray-200"
                          >
                            <Globe className="h-3 w-3 mr-1.5" />
                            Web Platform
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-8 flex items-center justify-center border-gray-200"
                          >
                            <Download className="h-3 w-3 mr-1.5" />
                            Windows
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-8 flex items-center justify-center border-gray-200"
                          >
                            <Download className="h-3 w-3 mr-1.5" />
                            iOS
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-8 flex items-center justify-center border-gray-200"
                          >
                            <Download className="h-3 w-3 mr-1.5" />
                            Android
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border border-gray-100 shadow-sm">
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-xs font-medium text-gray-800 flex items-center">
                          MetaTrader 5
                          <Badge className="ml-2 text-[9px] bg-purple-100 text-purple-800 hover:bg-purple-100">
                            Recommended
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-[10px] text-gray-500">
                          Advanced multi-asset trading platform
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-8 flex items-center justify-center border-gray-200"
                          >
                            <Globe className="h-3 w-3 mr-1.5" />
                            Web Platform
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-8 flex items-center justify-center border-gray-200"
                          >
                            <Download className="h-3 w-3 mr-1.5" />
                            Windows
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-8 flex items-center justify-center border-gray-200"
                          >
                            <Download className="h-3 w-3 mr-1.5" />
                            iOS
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-8 flex items-center justify-center border-gray-200"
                          >
                            <Download className="h-3 w-3 mr-1.5" />
                            Android
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* MT Accounts */}
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                    <Server className="h-3.5 w-3.5 mr-2 text-purple-600" />
                    My Trading Accounts
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Manage your MetaTrader trading accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mtAccounts.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-200 rounded-md">
                      <Server className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">No trading accounts found</p>
                      <p className="text-xs text-gray-400 mb-4">Contact support to create a trading account</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px] text-[10px] text-gray-500">Account ID</TableHead>
                            <TableHead className="text-[10px] text-gray-500">Platform</TableHead>
                            <TableHead className="text-[10px] text-gray-500">Type</TableHead>
                            <TableHead className="text-[10px] text-gray-500">Server</TableHead>
                            <TableHead className="text-[10px] text-gray-500 text-right">Balance</TableHead>
                            <TableHead className="text-[10px] text-gray-500"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mtAccounts.map((account) => (
                            <TableRow key={account.accountId}>
                              <TableCell className="font-medium text-xs">{account.accountId}</TableCell>
                              <TableCell className="text-xs">{account.platform}</TableCell>
                              <TableCell className="text-xs">
                                <Badge variant="outline" className="text-[9px] border-purple-200 text-purple-700">
                                  {account.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs">{account.server}</TableCell>
                              <TableCell className="text-xs text-right">{formatCurrency(account.balance)}</TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="outline" className="h-7 text-[10px] border-gray-200">
                                  <ExternalLink className="h-3 w-3 mr-1.5" />
                                  Open Platform
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Server Status */}
            <div>
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                    <Shield className="h-3.5 w-3.5 mr-2 text-purple-600" />
                    Server Status
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Real-time status of our trading servers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Tabs defaultValue="mt4">
                      <TabsList className="grid grid-cols-2 w-full h-8 bg-gray-100 p-0.5">
                        <TabsTrigger
                          value="mt4"
                          className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                        >
                          MT4 Servers
                        </TabsTrigger>
                        <TabsTrigger
                          value="mt5"
                          className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                        >
                          MT5 Servers
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="mt4" className="mt-4 space-y-3">
                        {serverStatuses
                          .filter(
                            (server) => server.server.includes("MT4") || server.server.toLowerCase().includes("mt4"),
                          )
                          .map((server, i) => (
                            <div key={i} className="border border-gray-100 rounded-md p-2.5 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {server.status === "online" ? (
                                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                    ) : (
                                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-800">{server.server}</p>
                                    <p className="text-[10px] text-gray-500">{server.message}</p>
                                  </div>
                                </div>
                                <Badge
                                  className={
                                    server.status === "online"
                                      ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200 text-[9px]"
                                      : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200 text-[9px]"
                                  }
                                >
                                  {server.status === "online" ? (
                                    <Wifi className="h-2.5 w-2.5 mr-1" />
                                  ) : (
                                    <WifiOff className="h-2.5 w-2.5 mr-1" />
                                  )}
                                  {server.status.toUpperCase()}
                                </Badge>
                              </div>

                              <div className="mt-2">
                                <div className="flex justify-between text-[10px] mb-1">
                                  <span className="text-gray-500">Uptime</span>
                                  <span className="font-medium">{server.uptime}%</span>
                                </div>
                                <Progress
                                  value={server.uptime}
                                  className="h-1"
                                  indicatorClassName={server.uptime > 95 ? "bg-green-500" : "bg-amber-500"}
                                />
                              </div>
                            </div>
                          ))}
                      </TabsContent>

                      <TabsContent value="mt5" className="mt-4 space-y-3">
                        {serverStatuses
                          .filter(
                            (server) => server.server.includes("MT5") || server.server.toLowerCase().includes("mt5"),
                          )
                          .map((server, i) => (
                            <div key={i} className="border border-gray-100 rounded-md p-2.5 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {server.status === "online" ? (
                                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                    ) : (
                                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-800">{server.server}</p>
                                    <p className="text-[10px] text-gray-500">{server.message}</p>
                                  </div>
                                </div>
                                <Badge
                                  className={
                                    server.status === "online"
                                      ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200 text-[9px]"
                                      : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200 text-[9px]"
                                  }
                                >
                                  {server.status === "online" ? (
                                    <Wifi className="h-2.5 w-2.5 mr-1" />
                                  ) : (
                                    <WifiOff className="h-2.5 w-2.5 mr-1" />
                                  )}
                                  {server.status.toUpperCase()}
                                </Badge>
                              </div>

                              <div className="mt-2">
                                <div className="flex justify-between text-[10px] mb-1">
                                  <span className="text-gray-500">Uptime</span>
                                  <span className="font-medium">{server.uptime}%</span>
                                </div>
                                <Progress
                                  value={server.uptime}
                                  className="h-1"
                                  indicatorClassName={server.uptime > 95 ? "bg-green-500" : "bg-amber-500"}
                                />
                              </div>
                            </div>
                          ))}
                      </TabsContent>
                    </Tabs>

                    {/* Connection Info */}
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-4">
                      <h3 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                        <Lock className="h-3 w-3 mr-1.5 text-purple-600" />
                        Connection Information
                      </h3>
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-3 text-[10px]">
                          <span className="text-gray-500">MT4 Demo:</span>
                          <span className="col-span-2 font-medium">{import.meta.env.VITE_MT4_DEMO_SERVER}</span>
                        </div>
                        <div className="grid grid-cols-3 text-[10px]">
                          <span className="text-gray-500">MT4 Live:</span>
                          <span className="col-span-2 font-medium">{import.meta.env.VITE_MT4_LIVE_SERVER}</span>
                        </div>
                        <div className="grid grid-cols-3 text-[10px]">
                          <span className="text-gray-500">MT5 Demo:</span>
                          <span className="col-span-2 font-medium">{import.meta.env.VITE_MT5_DEMO_SERVER}</span>
                        </div>
                        <div className="grid grid-cols-3 text-[10px]">
                          <span className="text-gray-500">MT5 Live:</span>
                          <span className="col-span-2 font-medium">{import.meta.env.VITE_MT5_LIVE_SERVER}</span>
                        </div>
                        <div className="grid grid-cols-3 text-[10px]">
                          <span className="text-gray-500">Server Port:</span>
                          <span className="col-span-2 font-medium">
                            {import.meta.env.VITE_MT4_SERVER_PORT || "443"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default PlatformPage
