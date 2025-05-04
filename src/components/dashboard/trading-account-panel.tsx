
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        
        <div className="flex justify-between text-xs pt-1">
          <div className="space-x-2">
            <span className="text-gray-500">Server: 
              <span className="text-gray-700 ml-1">{account.server}</span>
            </span>
          </div>
        </div>
        
        <div className="pt-2 flex items-center justify-between">
          <Button variant="outline" size="sm" className="flex items-center text-xs h-8">
            <ExternalLink className="h-3 w-3 mr-1" />
            Open Platform
          </Button>
          
          <Button size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs h-8">
            Account Actions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradingAccountPanel;
