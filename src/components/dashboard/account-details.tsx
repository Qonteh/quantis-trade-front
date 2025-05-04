
import React from 'react';
import { User } from '@/types/user.types';
import { 
  CalendarDays,
  MapPin,
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Award,
  HelpCircle,
  Globe
} from 'lucide-react';

interface AccountDetailsProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />
      
      <div className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
        <div className="bg-[#2D1B69] text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Account Details</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#3d2a87] flex items-center justify-center text-white mr-3">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <span className="text-lg font-medium">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold">{user.firstName} {user.lastName}</h4>
              <p className="text-xs text-gray-500">Account ID: {user.id}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                {user.accountStatus || 'Active'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-xs">
              <UserIcon className="w-3 h-3 text-gray-400 mr-2" />
              <span className="text-gray-500">Account Type:</span>
              <span className="ml-auto font-medium">{user.accountType || 'Standard'}</span>
            </div>
            
            <div className="flex items-center text-xs">
              <Mail className="w-3 h-3 text-gray-400 mr-2" />
              <span className="text-gray-500">Email:</span>
              <span className="ml-auto font-medium truncate max-w-[150px]">{user.email}</span>
            </div>
            
            <div className="flex items-center text-xs">
              <Phone className="w-3 h-3 text-gray-400 mr-2" />
              <span className="text-gray-500">Phone:</span>
              <span className="ml-auto font-medium">+{user.countryCode} {user.phone}</span>
            </div>
            
            <div className="flex items-center text-xs">
              <Shield className="w-3 h-3 text-gray-400 mr-2" />
              <span className="text-gray-500">Verification:</span>
              <span className="ml-auto font-medium">{user.isVerified ? 'Verified' : 'Unverified'}</span>
            </div>
            
            <div className="flex items-center text-xs">
              <CalendarDays className="w-3 h-3 text-gray-400 mr-2" />
              <span className="text-gray-500">Joined:</span>
              <span className="ml-auto font-medium">{user.joinDate || new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center text-xs">
              <MapPin className="w-3 h-3 text-gray-400 mr-2" />
              <span className="text-gray-500">Location:</span>
              <span className="ml-auto font-medium">{user.countryCode || 'US'}</span>
            </div>
            
            <div className="flex items-center text-xs">
              <Globe className="w-3 h-3 text-gray-400 mr-2" />
              <span className="text-gray-500">Trading Server:</span>
              <span className="ml-auto font-medium">{user.tradingServer || 'Quantis-Live'}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button 
              onClick={() => window.open('/settings', '_self')}
              className="w-full text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-1.5 px-3 rounded transition-colors"
            >
              Manage Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
