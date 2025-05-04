
import React from 'react';
import { Bell, Search } from 'lucide-react';

interface MarketDataItem {
  pair: string;
  price: string;
  change: string;
}

interface DashboardHeaderProps {
  marketData: MarketDataItem[];
  isMobile: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ marketData, isMobile }) => {
  return (
    <header className="bg-[#2D1B69] py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex items-center mb-2 md:mb-0">
            {isMobile && (
              <div className="flex items-baseline">
                <span className="text-[#9D6FFF] font-bold text-lg">Q</span>
                <span className="text-white font-bold text-lg">uantis</span>
                <span className="text-[#9D6FFF] font-bold text-xs translate-y-[-4px] ml-[1px]">
                  FX
                </span>
              </div>
            )}
            <div className="flex ml-auto md:ml-0">
              <span className="text-white text-sm font-medium">Dashboard</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-2 text-[10px] font-medium text-green-800 bg-green-200 rounded">Live</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 overflow-auto pb-1 md:pb-0 whitespace-nowrap">
            {marketData.map((item, index) => (
              <div key={index} className="text-[10px]">
                <div className="flex items-center">
                  <span className="text-white mr-1">{item.pair}</span>
                  <span className={item.change.includes('-') ? 'text-red-400' : 'text-green-400'}>
                    {item.price}
                  </span>
                  <span className={`ml-1 ${item.change.includes('-') ? 'text-red-400' : 'text-green-400'}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-40">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full h-7 px-3 py-1 pl-7 text-xs text-white bg-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
              />
              <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-white/70" />
            </div>
            
            <button className="relative">
              <Bell className="h-5 w-5 text-white/80" />
              <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-400 ring-1 ring-[#2D1B69]"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
