
import React from 'react';
import { Clock, CreditCard, Wallet, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  equity: number;
  credit: number;
  deposit: number;
  formatCurrency: (amount: number) => string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  equity, 
  credit, 
  deposit,
  formatCurrency
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-3">
      <div className="bg-white p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 dashboard-stats-card border border-gray-100">
        <div className="flex items-center mb-1">
          <div className="w-5 h-5 rounded-full bg-[#e1f5fe] flex items-center justify-center mr-1.5">
            <TrendingUp className="h-2.5 w-2.5 text-[#03a9f4]" />
          </div>
          <span className="text-[10px] text-gray-600 font-medium">Total Equity</span>
        </div>
        <p className="font-bold text-xs">{formatCurrency(equity)}</p>
      </div>
      
      <div className="bg-white p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 dashboard-stats-card border border-gray-100">
        <div className="flex items-center mb-1">
          <div className="w-5 h-5 rounded-full bg-[#ede7f6] flex items-center justify-center mr-1.5">
            <CreditCard className="h-2.5 w-2.5 text-[#673ab7]" />
          </div>
          <span className="text-[10px] text-gray-600 font-medium">Total Credit</span>
        </div>
        <p className="font-bold text-xs">{formatCurrency(credit)}</p>
      </div>
      
      <div className="bg-white p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 dashboard-stats-card border border-gray-100">
        <div className="flex items-center mb-1">
          <div className="w-5 h-5 rounded-full bg-[#e3f2fd] flex items-center justify-center mr-1.5">
            <Wallet className="h-2.5 w-2.5 text-[#2196f3]" />
          </div>
          <span className="text-[10px] text-gray-600 font-medium">Total Deposit</span>
        </div>
        <p className="font-bold text-xs">{formatCurrency(deposit)}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
