import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, ChevronDown, X } from 'lucide-react';
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
  const notificationRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountDetails(false);
      }
    }
    
    // Prevent scrolling when notification panel is open on mobile
    if (isMobile && showNotifications) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobile, showNotifications]);
  
  const toggleAccountDetails = () => {
    setShowAccountDetails(!showAccountDetails);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showAccountDetails) setShowAccountDetails(false);
  };
  
  return (
    <header className="bg-[#2D1B69] py-3 px-4 md:px-6 w-full max-w-full overflow-visible">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
           
           
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative p-1 rounded-full hover:bg-white/10"
                onClick={toggleNotifications}
                aria-expanded={showNotifications}
                aria-haspopup="true"
              >
                <Bell className="h-5 w-5 text-white/80" />
                <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-400 ring-1 ring-[#2D1B69]"></span>
              </button>
              
              {/* Mobile Notification Panel */}
              {isMobile && (
                <div 
                  className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
                    showNotifications ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div 
                    className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${
                      showNotifications ? 'translate-x-0' : 'translate-x-full'
                    }`}
                  >
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="text-sm font-medium">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(100%-56px)]">
                      <div className="p-4 border-b hover:bg-gray-50 active:bg-gray-100">
                        <div className="flex items-start">
                          <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium">Deposit Confirmed</p>
                            <p className="text-xs text-gray-500">Your deposit of $1,000 has been confirmed.</p>
                            <p className="text-[10px] text-gray-400 mt-1">5 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b hover:bg-gray-50 active:bg-gray-100">
                        <div className="flex items-start">
                          <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium">Verification Required</p>
                            <p className="text-xs text-gray-500">Complete identity verification to remove limits.</p>
                            <p className="text-[10px] text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b hover:bg-gray-50 active:bg-gray-100">
                        <div className="flex items-start">
                          <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium">Complete Verification</p>
                            <p className="text-xs text-gray-500">Please complete your account verification.</p>
                            <p className="text-[10px] text-gray-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b hover:bg-gray-50 active:bg-gray-100">
                        <div className="flex items-start">
                          <div className="w-2 h-2 mt-1 rounded-full bg-gray-300 mr-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium">Welcome to QuantisFX</p>
                            <p className="text-xs text-gray-500">Thank you for joining our platform.</p>
                            <p className="text-[10px] text-gray-400 mt-1">2 days ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b hover:bg-gray-50 active:bg-gray-100">
                        <div className="flex items-start">
                          <div className="w-2 h-2 mt-1 rounded-full bg-gray-300 mr-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium">Account Created</p>
                            <p className="text-xs text-gray-500">Your trading account has been created successfully.</p>
                            <p className="text-[10px] text-gray-400 mt-1">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t">
                      <button className="w-full py-2 text-center text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Desktop Notification Dropdown */}
              {!isMobile && showNotifications && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50"
                >
                  <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                    <h3 className="text-xs font-medium">Notifications</h3>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-medium px-1.5 py-0.5 rounded">3 new</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-medium">Deposit Confirmed</p>
                          <p className="text-[10px] text-gray-500">Your deposit of $1,000 has been confirmed.</p>
                          <p className="text-[9px] text-gray-400 mt-1">5 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-medium">Verification Required</p>
                          <p className="text-[10px] text-gray-500">Complete identity verification to remove limits.</p>
                          <p className="text-[9px] text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1 rounded-full bg-blue-500 mr-2 flex-shrink-0"></div>
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
            
            <div className="relative" ref={accountRef}>
              <button
                className="flex items-center p-1 rounded-full hover:bg-white/10"
                onClick={toggleAccountDetails}
                aria-expanded={showAccountDetails}
                aria-haspopup="true"
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
      </div>
    </header>
  );
};

export default DashboardHeader;