
import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import MarketTicker from './market-ticker';
import AccountDetails from './account-details';
import { useAuth } from '@/context/UserContext';

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
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  
  const toggleAccountDetails = () => {
    setShowAccountDetails(!showAccountDetails);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showAccountDetails) setShowAccountDetails(false);
  };
  
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
          
          <MarketTicker initialData={marketData} />
          
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-40">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full h-7 px-3 py-1 pl-7 text-xs text-white bg-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50"
              />
              <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-white/70" />
            </div>
            
            <div className="relative">
              <button 
                className="relative"
                onClick={toggleNotifications}
              >
                <Bell className="h-5 w-5 text-white/80" />
                <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-400 ring-1 ring-[#2D1B69]"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 animate-fade-in">
                  <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                    <h3 className="text-xs font-medium">Notifications</h3>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-medium px-1.5 py-0.5 rounded">3 new</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    <div className="p-3 border-b hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2"></div>
                        <div>
                          <p className="text-xs font-medium">Deposit Confirmed</p>
                          <p className="text-[10px] text-gray-500">Your deposit of $1,000 has been confirmed.</p>
                          <p className="text-[9px] text-gray-400 mt-1">5 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2"></div>
                        <div>
                          <p className="text-xs font-medium">New Feature Available</p>
                          <p className="text-[10px] text-gray-500">Try our new mobile trading app!</p>
                          <p className="text-[9px] text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2"></div>
                        <div>
                          <p className="text-xs font-medium">Complete Verification</p>
                          <p className="text-[10px] text-gray-500">Please complete your account verification.</p>
                          <p className="text-[9px] text-gray-400 mt-1">1 day ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1 rounded-full bg-gray-300 mr-2"></div>
                        <div>
                          <p className="text-xs font-medium">Welcome to Quantis FX</p>
                          <p className="text-[10px] text-gray-500">Thank you for registering with us.</p>
                          <p className="text-[9px] text-gray-400 mt-1">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 border-t">
                    <button className="w-full text-center text-[10px] text-blue-600 hover:text-blue-800">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              className="flex items-center"
              onClick={toggleAccountDetails}
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white mr-1">
                <User className="h-4 w-4" />
              </div>
              <ChevronDown className="h-3 w-3 text-white/70" />
            </button>
            
            <AccountDetails 
              user={user} 
              isOpen={showAccountDetails} 
              onClose={() => setShowAccountDetails(false)} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
