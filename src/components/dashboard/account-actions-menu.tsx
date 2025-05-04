
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Download,
  Upload,
  CreditCard,
  Lock,
  BarChart2,
  FileText,
  Settings,
  RefreshCcw,
  Power
} from 'lucide-react';

interface AccountActionsMenuProps {
  accountId: string;
}

const AccountActionsMenu: React.FC<AccountActionsMenuProps> = ({ accountId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleAction = (action: string) => {
    setIsOpen(false);
    
    switch (action) {
      case 'deposit':
        navigate('/deposit');
        break;
      case 'withdraw':
        navigate('/withdraw');
        break;
      case 'changePassword':
        navigate('/settings?tab=security');
        break;
      case 'tradingHistory':
        navigate('/wallet?tab=history');
        break;
      case 'accountStatement':
        // Simulate downloading a statement
        setTimeout(() => {
          alert('Account statement downloaded');
        }, 500);
        break;
      case 'accountSettings':
        navigate('/settings');
        break;
      case 'refreshAccount':
        // Simulate account refreshing
        setTimeout(() => {
          alert('Account refreshed successfully');
        }, 1000);
        break;
      case 'closeAccount':
        if (window.confirm('Are you sure you want to deactivate this trading account?')) {
          alert('Your request has been submitted. Our team will contact you shortly.');
        }
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs py-1.5 px-3 rounded flex items-center"
      >
        Account Actions
        <ChevronDown className="ml-1 h-3 w-3" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 text-xs animate-fade-in">
          <button
            onClick={() => handleAction('deposit')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <Upload className="h-3 w-3 mr-2 text-green-600" />
            Deposit Funds
          </button>
          
          <button
            onClick={() => handleAction('withdraw')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <Download className="h-3 w-3 mr-2 text-red-600" />
            Withdraw Funds
          </button>
          
          <hr className="my-1" />
          
          <button
            onClick={() => handleAction('changePassword')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <Lock className="h-3 w-3 mr-2 text-gray-600" />
            Change Password
          </button>
          
          <button
            onClick={() => handleAction('tradingHistory')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <BarChart2 className="h-3 w-3 mr-2 text-blue-600" />
            Trading History
          </button>
          
          <button
            onClick={() => handleAction('accountStatement')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <FileText className="h-3 w-3 mr-2 text-gray-600" />
            Account Statement
          </button>
          
          <hr className="my-1" />
          
          <button
            onClick={() => handleAction('accountSettings')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <Settings className="h-3 w-3 mr-2 text-gray-600" />
            Account Settings
          </button>
          
          <button
            onClick={() => handleAction('refreshAccount')}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            <RefreshCcw className="h-3 w-3 mr-2 text-green-600" />
            Refresh Account
          </button>
          
          <hr className="my-1" />
          
          <button
            onClick={() => handleAction('closeAccount')}
            className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
          >
            <Power className="h-3 w-3 mr-2" />
            Close Account
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountActionsMenu;
