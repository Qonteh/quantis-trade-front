
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { 
  ExternalLink, Shield, AlertTriangle, Check, Server,
  Loader, RefreshCw, Wifi, WifiOff, Lock, Globe, Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "./dashboard/dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { TradingService } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface ServerStatus {
  server: string;
  status: string;
  uptime: number;
  message: string;
}

interface MTAccount {
  accountId: string;
  password?: string;
  investorPassword?: string;
  server: string;
  platform: string;
  accountType: string;
  leverage: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  type: string;
  isActive: boolean;
  createdAt: string;
}

const PlatformPage: React.FC = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatuses, setServerStatuses] = useState<ServerStatus[]>([]);
  const [mtAccounts, setMtAccounts] = useState<MTAccount[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    platform: "MT4",
    accountType: "demo",
    leverage: "1:1000",
    initialDeposit: 10000
  });
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState<MTAccount | null>(null);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    fetchData();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch server statuses
      const serverResponse = await TradingService.getServerStatus();
      if (serverResponse.data) {
        setServerStatuses(serverResponse.data);
      }
      
      // Fetch MT accounts
      const accountsResponse = await TradingService.getMTAccounts();
      if (accountsResponse.data) {
        setMtAccounts(accountsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching platform data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleCreateAccount = async () => {
    setCreatingAccount(true);
    try {
      const response = await TradingService.createMTAccount({
        platform: newAccountForm.platform,
        accountType: newAccountForm.accountType,
        leverage: newAccountForm.leverage,
        initialDeposit: parseFloat(newAccountForm.initialDeposit.toString())
      });
      
      if (response.data) {
        setNewAccount(response.data);
        toast({
          title: "Account Created",
          description: `Your ${newAccountForm.platform} ${newAccountForm.accountType} account has been created.`,
        });
        
        // Refresh accounts list
        const accountsResponse = await TradingService.getMTAccounts();
        if (accountsResponse.data) {
          setMtAccounts(accountsResponse.data);
        }
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      setCreatingAccount(false);
    }
  };

  const resetNewAccountForm = () => {
    setNewAccountForm({
      platform: "MT4",
      accountType: "demo",
      leverage: "1:1000",
      initialDeposit: 10000
    });
    setNewAccount(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar isMobile={isMobile} />
        
        <div className={`flex-1 ${!isMobile ? 'md:ml-64' : ''}`}>
          {/* Header */}
          <DashboardHeader
            marketData={[
              { pair: "EUR/USD", price: "1.0873", change: "-0.01%" },
              { pair: "GBP/USD", price: "1.2543", change: "-0.02%" },
              { pair: "USD/JPY", price: "153.6569", change: "+0.01%" },
              { pair: "BTC/USD", price: "63,154.43", change: "-0.03%" },
            ]}
            isMobile={isMobile}
          />

          {/* Page Title */}
          <div className="bg-white py-3 px-4 md:px-6 border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium">Trading Platforms</h2>
                <p className="text-xs text-gray-500">Manage your MT4/MT5 trading accounts</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex items-center"
                onClick={fetchData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-3 w-3 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="relative">
                    <div className="h-16 w-16 mx-auto animate-spin border-4 border-[#7C3AED]/20 border-t-[#9D6FFF] rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Server className="h-6 w-6 text-[#7C3AED]" />
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
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <Download className="h-4 w-4 mr-2 text-[#7C3AED]" />
                        Download Trading Platforms
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Access our trading platforms on any device
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm">MetaTrader 4</CardTitle>
                            <CardDescription className="text-xs">
                              Robust trading platform for forex trading
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-9 flex items-center justify-center"
                              >
                                <Globe className="h-3.5 w-3.5 mr-2" />
                                Web Platform
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-9 flex items-center justify-center"
                              >
                                <Download className="h-3.5 w-3.5 mr-2" />
                                Windows
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-9 flex items-center justify-center"
                              >
                                <Download className="h-3.5 w-3.5 mr-2" />
                                iOS
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-9 flex items-center justify-center"
                              >
                                <Download className="h-3.5 w-3.5 mr-2" />
                                Android
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-0 shadow-sm">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm flex items-center">
                              MetaTrader 5
                              <Badge className="ml-2 text-[10px]">Recommended</Badge>
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Advanced multi-asset trading platform
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-9 flex items-center justify-center"
                              >
                                <Globe className="h-3.5 w-3.5 mr-2" />
                                Web Platform
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-9 flex items-center justify-center"
                              >
                                <Download className="h-3.5 w-3.5 mr-2" />
                                Windows
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-9 flex items-center justify-center"
                              >
                                <Download className="h-3.5 w-3.5 mr-2" />
                                iOS
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-9 flex items-center justify-center"
                              >
                                <Download className="h-3.5 w-3.5 mr-2" />
                                Android
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* MT Accounts */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center">
                          <Server className="h-4 w-4 mr-2 text-[#7C3AED]" />
                          My Trading Accounts
                        </CardTitle>
                        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-xs"
                              onClick={resetNewAccountForm}
                            >
                              Create New Account
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Create Trading Account</DialogTitle>
                              <DialogDescription>
                                Set up a new MT4 or MT5 trading account.
                              </DialogDescription>
                            </DialogHeader>
                            
                            {newAccount ? (
                              <div className="py-4">
                                <div className="bg-green-50 border border-green-100 rounded-md p-3 mb-4 flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-green-800">Account Created Successfully!</p>
                                    <p className="text-xs text-green-700 mt-1">
                                      Please save your login credentials. You will need them to access your account.
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3 mb-4">
                                  <div className="grid grid-cols-3 gap-2 items-center">
                                    <p className="text-sm text-gray-500">Account ID:</p>
                                    <p className="text-sm font-medium col-span-2">{newAccount.accountId}</p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 items-center">
                                    <p className="text-sm text-gray-500">Platform:</p>
                                    <p className="text-sm font-medium col-span-2">{newAccount.platform}</p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 items-center">
                                    <p className="text-sm text-gray-500">Server:</p>
                                    <p className="text-sm font-medium col-span-2">{newAccount.server}</p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 items-center">
                                    <p className="text-sm text-gray-500">Password:</p>
                                    <p className="text-sm font-medium col-span-2">{newAccount.password}</p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 items-center">
                                    <p className="text-sm text-gray-500">Investor Password:</p>
                                    <p className="text-sm font-medium col-span-2">{newAccount.investorPassword}</p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 items-center">
                                    <p className="text-sm text-gray-500">Initial Balance:</p>
                                    <p className="text-sm font-medium col-span-2">{formatCurrency(newAccount.balance)}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-amber-50 border border-amber-100 rounded-md p-3">
                                  <p className="text-xs text-amber-800 flex items-start">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                                    Please take a screenshot or note down these credentials. For security reasons, we won't be able to show these details again.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="py-4 space-y-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="platform" className="text-right text-xs">
                                    Platform
                                  </Label>
                                  <Select
                                    value={newAccountForm.platform}
                                    onValueChange={(value) => setNewAccountForm({...newAccountForm, platform: value})}
                                  >
                                    <SelectTrigger className="col-span-3 text-sm">
                                      <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="MT4">MetaTrader 4</SelectItem>
                                      <SelectItem value="MT5">MetaTrader 5</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="accountType" className="text-right text-xs">
                                    Account Type
                                  </Label>
                                  <Select 
                                    value={newAccountForm.accountType}
                                    onValueChange={(value) => setNewAccountForm({...newAccountForm, accountType: value})}
                                  >
                                    <SelectTrigger className="col-span-3 text-sm">
                                      <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="demo">Demo Account</SelectItem>
                                      <SelectItem value="live">Live Account</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="leverage" className="text-right text-xs">
                                    Leverage
                                  </Label>
                                  <Select 
                                    value={newAccountForm.leverage}
                                    onValueChange={(value) => setNewAccountForm({...newAccountForm, leverage: value})}
                                  >
                                    <SelectTrigger className="col-span-3 text-sm">
                                      <SelectValue placeholder="Select leverage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1:100">1:100</SelectItem>
                                      <SelectItem value="1:200">1:200</SelectItem>
                                      <SelectItem value="1:500">1:500</SelectItem>
                                      <SelectItem value="1:1000">1:1000</SelectItem>
                                      <SelectItem value="1:2000">1:2000</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="deposit" className="text-right text-xs">
                                    Initial Deposit
                                  </Label>
                                  <Input
                                    id="deposit"
                                    type="number"
                                    className="col-span-3 text-sm"
                                    value={newAccountForm.initialDeposit}
                                    onChange={(e) => setNewAccountForm({
                                      ...newAccountForm, 
                                      initialDeposit: parseFloat(e.target.value) || 0
                                    })}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              {newAccount ? (
                                <Button onClick={() => setCreateDialogOpen(false)}>
                                  Close
                                </Button>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setCreateDialogOpen(false)}
                                    disabled={creatingAccount}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    type="submit"
                                    disabled={creatingAccount || !newAccountForm.initialDeposit}
                                    onClick={handleCreateAccount}
                                    className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                                  >
                                    {creatingAccount ? (
                                      <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                      </>
                                    ) : "Create Account"}
                                  </Button>
                                </>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <CardDescription className="text-xs">
                        Manage your MetaTrader trading accounts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {mtAccounts.length === 0 ? (
                        <div className="text-center py-8 border border-dashed rounded-md">
                          <Server className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-2">No trading accounts found</p>
                          <p className="text-xs text-gray-400 mb-4">Create your first trading account to get started</p>
                          <Button 
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-xs"
                            onClick={() => setCreateDialogOpen(true)}
                          >
                            Create Account
                          </Button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[120px] text-xs">Account ID</TableHead>
                                <TableHead className="text-xs">Platform</TableHead>
                                <TableHead className="text-xs">Type</TableHead>
                                <TableHead className="text-xs">Server</TableHead>
                                <TableHead className="text-xs text-right">Balance</TableHead>
                                <TableHead className="text-xs"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mtAccounts.map((account) => (
                                <TableRow key={account.accountId}>
                                  <TableCell className="font-medium text-xs">{account.accountId}</TableCell>
                                  <TableCell className="text-xs">{account.platform}</TableCell>
                                  <TableCell className="text-xs">
                                    <Badge variant="outline" className="text-[10px]">
                                      {account.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-xs">{account.server}</TableCell>
                                  <TableCell className="text-xs text-right">{formatCurrency(account.balance)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="h-7 text-[10px]"
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
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
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-[#7C3AED]" />
                        Server Status
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Real-time status of our trading servers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Tabs defaultValue="mt4">
                          <TabsList className="grid grid-cols-2 w-full">
                            <TabsTrigger value="mt4">MT4 Servers</TabsTrigger>
                            <TabsTrigger value="mt5">MT5 Servers</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="mt4" className="mt-4 space-y-3">
                            {serverStatuses
                              .filter(server => server.server.includes('MT4') || server.server.toLowerCase().includes('mt4'))
                              .map((server, i) => (
                                <div key={i} className="border rounded-md p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                      <div className="mr-2">
                                        {server.status === 'online' ? (
                                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                        ) : (
                                          <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{server.server}</p>
                                        <p className="text-xs text-gray-500">{server.message}</p>
                                      </div>
                                    </div>
                                    <Badge 
                                      className={server.status === 'online' 
                                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                        : "bg-red-100 text-red-800 hover:bg-red-100"}
                                    >
                                      {server.status === 'online' ? (
                                        <Wifi className="h-3 w-3 mr-1" />
                                      ) : (
                                        <WifiOff className="h-3 w-3 mr-1" />
                                      )}
                                      {server.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Uptime</span>
                                      <span>{server.uptime}%</span>
                                    </div>
                                    <Progress value={server.uptime} className="h-1" />
                                  </div>
                                </div>
                              ))}
                          </TabsContent>
                          
                          <TabsContent value="mt5" className="mt-4 space-y-3">
                            {serverStatuses
                              .filter(server => server.server.includes('MT5') || server.server.toLowerCase().includes('mt5'))
                              .map((server, i) => (
                                <div key={i} className="border rounded-md p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                      <div className="mr-2">
                                        {server.status === 'online' ? (
                                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                        ) : (
                                          <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{server.server}</p>
                                        <p className="text-xs text-gray-500">{server.message}</p>
                                      </div>
                                    </div>
                                    <Badge 
                                      className={server.status === 'online' 
                                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                        : "bg-red-100 text-red-800 hover:bg-red-100"}
                                    >
                                      {server.status === 'online' ? (
                                        <Wifi className="h-3 w-3 mr-1" />
                                      ) : (
                                        <WifiOff className="h-3 w-3 mr-1" />
                                      )}
                                      {server.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Uptime</span>
                                      <span>{server.uptime}%</span>
                                    </div>
                                    <Progress value={server.uptime} className="h-1" />
                                  </div>
                                </div>
                              ))}
                          </TabsContent>
                        </Tabs>

                        {/* Connection Info */}
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-6">
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Lock className="h-3.5 w-3.5 mr-1.5 text-[#7C3AED]" />
                            Connection Information
                          </h3>
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 text-xs">
                              <span className="text-gray-500">MT4 Demo:</span>
                              <span className="col-span-2 font-medium">{import.meta.env.VITE_MT4_DEMO_SERVER}</span>
                            </div>
                            <div className="grid grid-cols-3 text-xs">
                              <span className="text-gray-500">MT4 Live:</span>
                              <span className="col-span-2 font-medium">{import.meta.env.VITE_MT4_LIVE_SERVER}</span>
                            </div>
                            <div className="grid grid-cols-3 text-xs">
                              <span className="text-gray-500">MT5 Demo:</span>
                              <span className="col-span-2 font-medium">{import.meta.env.VITE_MT5_DEMO_SERVER}</span>
                            </div>
                            <div className="grid grid-cols-3 text-xs">
                              <span className="text-gray-500">MT5 Live:</span>
                              <span className="col-span-2 font-medium">{import.meta.env.VITE_MT5_LIVE_SERVER}</span>
                            </div>
                            <div className="grid grid-cols-3 text-xs">
                              <span className="text-gray-500">Server Port:</span>
                              <span className="col-span-2 font-medium">{import.meta.env.VITE_MT4_SERVER_PORT || "443"}</span>
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
      </div>
    </div>
  );
};

export default PlatformPage;
