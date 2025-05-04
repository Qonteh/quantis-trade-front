
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
    <div className="grid grid-cols-3 gap-2 mt-4">
      <div className="bg-[#f8f8ff] p-3 rounded-lg">
        <div className="flex items-center mb-1">
          <div className="w-5 h-5 rounded-full bg-[#e1f5fe] flex items-center justify-center mr-1.5">
            <Clock className="h-2.5 w-2.5 text-[#03a9f4]" />
          </div>
          <span className="text-[10px] text-gray-600">Total Equity</span>
        </div>
        <p className="font-bold text-sm">{formatCurrency(equity)}</p>
      </div>
      
      <div className="bg-[#f8f8ff] p-3 rounded-lg">
        <div className="flex items-center mb-1">
          <div className="w-5 h-5 rounded-full bg-[#ede7f6] flex items-center justify-center mr-1.5">
            <CreditCard className="h-2.5 w-2.5 text-[#673ab7]" />
          </div>
          <span className="text-[10px] text-gray-600">Total Credit</span>
        </div>
        <p className="font-bold text-sm">{formatCurrency(credit)}</p>
      </div>
      
      <div className="bg-[#f8f8ff] p-3 rounded-lg">
        <div className="flex items-center mb-1">
          <div className="w-5 h-5 rounded-full bg-[#e3f2fd] flex items-center justify-center mr-1.5">
            <Wallet className="h-2.5 w-2.5 text-[#2196f3]" />
          </div>
          <span className="text-[10px] text-gray-600">Total Deposit</span>
        </div>
        <p className="font-bold text-sm">{formatCurrency(deposit)}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
