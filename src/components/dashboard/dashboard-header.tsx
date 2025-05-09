
import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import AccountDetails from './account-details';
import { useAuth } from '@/context/UserContext';
import Logo from '../ui/Logo';

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
    <header className="bg-[#2D1B69] py-3 px-4 md:px-6 w-full max-w-full overflow-hidden">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {isMobile && (
              <div className="flex items-center mr-3">
                <Logo darkMode={true} width={80} height={30} />
              </div>
            )}
            <div className="flex">
              <span className="text-white text-sm font-medium">Dashboard</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-2 text-[10px] font-medium text-green-800 bg-green-200 rounded">Live</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 overflow-x-auto">
            {marketData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center bg-white/10 rounded px-2 py-1 text-white text-xs">
                <span className="font-medium">{item.pair}</span>
                <span className={`ml-2 ${item.change.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-40">
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
                          <p className="text-xs font-medium">Verification Required</p>
                          <p className="text-[10px] text-gray-500">Complete identity verification to remove limits.</p>
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
