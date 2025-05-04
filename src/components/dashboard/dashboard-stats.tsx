
import React from 'react';
import { Clock, CreditCard, Wallet } from 'lucide-react';

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
      <div className="bg-[#f8f8ff] p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 dashboard-stats-card">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-full bg-[#e1f5fe] flex items-center justify-center mr-1.5">
            <Clock className="h-2 w-2 text-[#03a9f4]" />
          </div>
          <span className="text-[9px] text-gray-600 font-medium">Total Equity</span>
        </div>
        <p className="font-bold text-xs">{formatCurrency(equity)}</p>
      </div>
      
      <div className="bg-[#f8f8ff] p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 dashboard-stats-card">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-full bg-[#ede7f6] flex items-center justify-center mr-1.5">
            <CreditCard className="h-2 w-2 text-[#673ab7]" />
          </div>
          <span className="text-[9px] text-gray-600 font-medium">Total Credit</span>
        </div>
        <p className="font-bold text-xs">{formatCurrency(credit)}</p>
      </div>
      
      <div className="bg-[#f8f8ff] p-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 dashboard-stats-card">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-full bg-[#e3f2fd] flex items-center justify-center mr-1.5">
            <Wallet className="h-2 w-2 text-[#2196f3]" />
          </div>
          <span className="text-[9px] text-gray-600 font-medium">Total Deposit</span>
        </div>
        <p className="font-bold text-xs">{formatCurrency(deposit)}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
