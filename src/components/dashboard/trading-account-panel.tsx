
import React, { useState } from 'react';
import { ExternalLink, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccountActionsMenu from './account-actions-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

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
  const [transferAmount, setTransferAmount] = useState('');
  const [platform, setPlatform] = useState('MT5');
  const { toast } = useToast();
  
  const handleOpenPlatform = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      window.open('/platform', '_self');
    }, 1000);
  };
  
  const handleTransfer = () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid transfer amount"
      });
      return;
    }

    // Simulate transfer process
    toast({
      title: "Transfer initiated",
      description: `${formatCurrency(parseFloat(transferAmount))} will be transferred to your ${platform} account shortly.`,
    });
    
    setTransferAmount('');
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
              <span>#{account.accountId}</span>
              <span className="mx-1">•</span>
              <span>{account.type}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-1 rounded-full bg-green-400"></div>
            <span className="text-xs font-medium text-green-700">Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-[10px] text-gray-500 mb-0.5">Leverage</p>
            <p className="font-medium text-xs">{account.leverage}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-[10px] text-gray-500 mb-0.5">Equity</p>
            <p className="font-medium text-xs">{formatCurrency(account.equity)}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-[10px] text-gray-500 mb-0.5">Balance</p>
            <p className="font-medium text-xs">{formatCurrency(account.balance)}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-[10px] text-gray-500 mb-0.5">Margin</p>
            <p className="font-medium text-xs">{formatCurrency(account.margin)}</p>
          </div>
        </div>
        
        {/* Transfer Section */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium">Transfer to Trading Platform</h4>
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
                />
              </div>
            </div>
            <div className="w-24">
              <div className="mb-1">
                <Label htmlFor="platform" className="text-[10px] text-gray-500">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform" className="w-full h-8 text-xs">
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
                className="h-8 px-3 text-xs bg-[#7C3AED]" 
                onClick={handleTransfer}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Transfer
              </Button>
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
                />
                {account.server}
              </span>
            </span>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md text-[10px] space-y-1 animate-fade-in">
            <div className="flex justify-between">
              <span className="text-gray-500">Platform:</span>
              <span>{account.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Currency:</span>
              <span>{account.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Open Date:</span>
              <span>{account.openDate}</span>
            </div>
          </div>
        )}
        
        <div className="pt-2 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center text-xs h-8"
            onClick={handleOpenPlatform}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Platform
              </>
            )}
          </Button>
          
          <AccountActionsMenu accountId={account.accountId} />
        </div>
      </div>
    </div>
  );
};

export default TradingAccountPanel;
