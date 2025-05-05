
import React, { useState, useEffect } from 'react';
import { ExternalLink, Info, ArrowRight, Loader, RefreshCw, TrendingUp, TrendingDown, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccountActionsMenu from './account-actions-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { TradingService } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { useMTServer, MTAccountDetails } from '@/hooks/use-mt-server';
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TradingAccount {
  accountId: string;
  type: string;
  leverage: string;
  equity: number;
  balance: number;
  margin: number;
  platform: string;
  currency: string;
  openDate: string;
  server: string;
  isActive: boolean;
}

interface TradingAccountPanelProps {
  account: TradingAccount;
  formatCurrency: (amount: number) => string;
  isDemoAccount?: boolean;
}

const TradingAccountPanel: React.FC<TradingAccountPanelProps> = ({ 
  account, 
  formatCurrency,
  isDemoAccount = false 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [platform, setPlatform] = useState('MT5');
  const [mtAccount, setMtAccount] = useState<MTAccountDetails | null>(null);
  const [isFetchingMtAccount, setIsFetchingMtAccount] = useState(true);
  
  const { toast } = useToast();
  const { 
    getMT4AccountDetails, 
    getMT5AccountDetails, 
    transferToMT4, 
    transferToMT5, 
    isLoading: mtLoading,
    serverStatus
  } = useMTServer();
  
  useEffect(() => {
    const fetchMtAccountDetails = async () => {
      setIsFetchingMtAccount(true);
      try {
        // Determine if we should fetch MT4 or MT5 data based on account platform
        if (account.platform.includes('5')) {
          const mtData = await getMT5AccountDetails(account.accountId);
          if (mtData) {
            setMtAccount(mtData);
          }
        } else {
          const mtData = await getMT4AccountDetails(account.accountId);
          if (mtData) {
            setMtAccount(mtData);
          }
        }
      } catch (error) {
        console.error("Error fetching MT account data:", error);
        toast({
          variant: "destructive",
          title: "Failed to fetch platform data",
          description: "Could not connect to trading server. Please try again later."
        });
      } finally {
        setIsFetchingMtAccount(false);
      }
    };

    fetchMtAccountDetails();
  }, [account.accountId, account.platform]);
  
  // Use real MT account data if available, otherwise fall back to provided account
  const displayAccount = mtAccount || account;

  const handleOpenPlatform = () => {
    setIsLoading(true);
    
    // In a real app, you would launch the MT4/MT5 web terminal or redirect to it
    setTimeout(() => {
      setIsLoading(false);
      
      // Open the trading platform in a new tab - in a real implementation, this would be a direct URL to the MT terminal
      const platformUrl = platform === 'MT5' 
        ? `https://terminal.${account.server.toLowerCase().replace(' ', '-')}.com/trade?account=${account.accountId}` 
        : `https://webtrader.${account.server.toLowerCase().replace(' ', '-')}.com?login=${account.accountId}`;
      
      window.open(platformUrl, '_blank');
    }, 1000);
  };
  
  const handleTransfer = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid transfer amount"
      });
      return;
    }
    
    setIsTransferring(true);

    try {
      let success = false;
      const amount = parseFloat(transferAmount);
      
      // Call the appropriate MT service based on selected platform
      if (platform === 'MT4') {
        success = await transferToMT4(account.accountId, amount);
      } else {
        success = await transferToMT5(account.accountId, amount);
      }

      if (success) {
        // If successful, update our records via the trading service
        await TradingService.transferToPlatform(amount, platform, isDemoAccount ? 'demo' : 'live');
        
        setTransferAmount('');
      }
    } catch (error) {
      console.error("Transfer error:", error);
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: "There was an error processing your transfer. Please try again."
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const getProfitLossDisplay = () => {
    if (!mtAccount) return null;
    
    const isPositive = mtAccount.equity > mtAccount.balance;
    const difference = Math.abs(mtAccount.equity - mtAccount.balance);
    const percentage = mtAccount.balance ? ((difference / mtAccount.balance) * 100).toFixed(2) : '0.00';
    
    return (
      <Badge variant="outline" className={`
        ${isPositive 
          ? 'border-green-500 text-green-600 bg-green-50' 
          : mtAccount.equity < mtAccount.balance
            ? 'border-red-500 text-red-600 bg-red-50'
            : 'border-gray-300 text-gray-600 bg-gray-50'
        }
      `}>
        <span className="flex items-center text-xs">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : mtAccount.equity < mtAccount.balance ? (
            <TrendingDown className="h-3 w-3 mr-1" />
          ) : null}
          {isPositive ? '+' : mtAccount.equity < mtAccount.balance ? '-' : ''}{formatCurrency(difference)} ({percentage}%)
        </span>
      </Badge>
    );
  };
  
  const handleRefresh = async () => {
    setIsFetchingMtAccount(true);
    try {
      if (account.platform.includes('5')) {
        const mtData = await getMT5AccountDetails(account.accountId);
        if (mtData) {
          setMtAccount(mtData);
        }
      } else {
        const mtData = await getMT4AccountDetails(account.accountId);
        if (mtData) {
          setMtAccount(mtData);
        }
      }

      toast({
        title: "Account refreshed",
        description: "Your trading account data has been updated."
      });
    } catch (error) {
      console.error("Error refreshing account data:", error);
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Could not update trading account data."
      });
    } finally {
      setIsFetchingMtAccount(false);
    }
  };
  
  return (
    <div className="bg-white rounded-md border shadow-sm p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm">
              {isDemoAccount ? "Demo Trading Account" : "Live Trading Account"}
            </h3>
            <div className="flex items-center text-xs text-gray-600">
              <span>#{displayAccount.accountId}</span>
              <span className="mx-1">•</span>
              <span>{displayAccount.type}</span>
              {mtAccount && getProfitLossDisplay()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleRefresh}
              disabled={isFetchingMtAccount}
            >
              {isFetchingMtAccount ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 mr-1 rounded-full ${mtAccount?.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className={`text-xs font-medium ${mtAccount?.isActive ? 'text-green-700' : 'text-red-700'}`}>
                      {mtAccount?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mtAccount?.isActive 
                    ? 'Your account is active and connected to the trading server' 
                    : 'Your account is inactive or disconnected from the trading server'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-[10px] text-gray-500 mb-0.5">Leverage</p>
            {isFetchingMtAccount ? (
              <Skeleton className="h-4 w-12" />
            ) : (
              <p className="font-medium text-xs">1:2000</p>
            )}
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-[10px] text-gray-500 mb-0.5">Equity</p>
            {isFetchingMtAccount ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <p className="font-medium text-xs">{formatCurrency(displayAccount.equity)}</p>
            )}
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-[10px] text-gray-500 mb-0.5">Balance</p>
            {isFetchingMtAccount ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <p className="font-medium text-xs">{formatCurrency(displayAccount.balance)}</p>
            )}
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-[10px] text-gray-500 mb-0.5">Margin</p>
            {isFetchingMtAccount ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <p className="font-medium text-xs">{formatCurrency(displayAccount.margin)}</p>
            )}
          </div>
        </div>
        
        {/* MT4/MT5 Platform Integration Section */}
        <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#8B5CF6]/5 p-3 rounded-md border border-[#7C3AED]/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-[#7C3AED]">Transfer to Trading Platform</h4>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="mb-1">
                <Label htmlFor="transferAmount" className="text-[10px] text-gray-500">Amount</Label>
                <Input 
                  id="transferAmount" 
                  type="number" 
                  placeholder="0.00" 
                  className="h-8 text-xs" 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  disabled={isTransferring}
                />
              </div>
            </div>
            <div className="w-24">
              <div className="mb-1">
                <Label htmlFor="platform" className="text-[10px] text-gray-500">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform" className="w-full h-8 text-xs" disabled={isTransferring}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MT4">MT4</SelectItem>
                    <SelectItem value="MT5">MT5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                className="h-8 px-3 text-xs bg-[#7C3AED] hover:bg-[#6D28D9]" 
                onClick={handleTransfer}
                disabled={isTransferring}
              >
                {isTransferring ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Transfer
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Server Status Indicator */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1 text-[#7C3AED]" />
              <span>Secure Transfer</span>
            </div>
            <div className="flex items-center">
              {mtLoading.serverStatus ? (
                <Loader className="h-3 w-3 mr-1 animate-spin text-amber-500" />
              ) : (
                platform === 'MT4' ? (
                  serverStatus.mt4 ? (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                      <span className="text-green-600">MT4 Server Online</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">MT4 Server Offline</span>
                    </div>
                  )
                ) : (
                  serverStatus.mt5 ? (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                      <span className="text-green-600">MT5 Server Online</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">MT5 Server Offline</span>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs pt-1">
          <div className="space-x-2">
            <span className="text-gray-500 flex items-center">
              <span className="text-gray-700 flex items-center">
                <Info 
                  className="h-3 w-3 mr-1 cursor-pointer text-blue-500" 
                  onClick={() => setShowDetails(!showDetails)} 
                  aria-label="Show account details"
                />
                {displayAccount.server}
              </span>
            </span>
          </div>
        </div>
        
        {/* Enhanced Account Details Panel */}
        {showDetails && (
          <div className="mt-2 p-3 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-md text-xs space-y-2 animate-fade-in border border-gray-200">
            <h5 className="font-medium text-xs text-gray-700 border-b border-gray-200 pb-1 mb-2 flex items-center justify-between">
              <span>Trading Account Details</span>
              {isFetchingMtAccount && <Loader className="h-3 w-3 animate-spin text-gray-400" />}
            </h5>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform:</span>
                  {isFetchingMtAccount ? (
                    <Skeleton className="h-3 w-12" />
                  ) : (
                    <span className="font-medium">{displayAccount.platform}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type:</span>
                  {isFetchingMtAccount ? (
                    <Skeleton className="h-3 w-16" />
                  ) : (
                    <span className="font-medium">{displayAccount.type}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Currency:</span>
                  {isFetchingMtAccount ? (
                    <Skeleton className="h-3 w-8" />
                  ) : (
                    <span className="font-medium">{displayAccount.currency}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Open Date:</span>
                  {isFetchingMtAccount ? (
                    <Skeleton className="h-3 w-20" />
                  ) : (
                    <span className="font-medium">{displayAccount.openDate}</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Leverage:</span>
                  {isFetchingMtAccount ? (
                    <Skeleton className="h-3 w-12" />
                  ) : (
                    <span className="font-medium">1:2000</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Server:</span>
                  {isFetchingMtAccount ? (
                    <Skeleton className="h-3 w-24" />
                  ) : (
                    <span className="font-medium">{displayAccount.server}</span>
                  )}
                </div>
                {mtAccount && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Free Margin:</span>
                      {isFetchingMtAccount ? (
                        <Skeleton className="h-3 w-16" />
                      ) : (
                        <span className="font-medium">{formatCurrency(mtAccount.freeMargin || 0)}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Margin Level:</span>
                      {isFetchingMtAccount ? (
                        <Skeleton className="h-3 w-16" />
                      ) : (
                        <span className="font-medium">{mtAccount.marginLevel || 0}%</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {mtAccount && (
              <div className="pt-1 border-t border-gray-200 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Open Positions:</span>
                    {isFetchingMtAccount ? (
                      <Skeleton className="h-3 w-8" />
                    ) : (
                      <Badge variant="outline" className="text-[10px]">{mtAccount.openPositions || 0}</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Pending Orders:</span>
                    {isFetchingMtAccount ? (
                      <Skeleton className="h-3 w-8" />
                    ) : (
                      <Badge variant="outline" className="text-[10px]">{mtAccount.pendingOrders || 0}</Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="pt-2 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center text-xs h-8 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
            onClick={handleOpenPlatform}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-[#7C3AED]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="h-3 w-3 mr-1" />
                Open {platform} Platform
              </>
            )}
          </Button>
          
          <AccountActionsMenu accountId={displayAccount.accountId} />
        </div>
      </div>
    </div>
  );
};

export default TradingAccountPanel;
