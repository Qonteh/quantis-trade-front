
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LogOut,
  Settings,
  Users,
  Wallet,
  Layers,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon, label, to, isActive, isCollapsed }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center ${
        isCollapsed ? 'justify-center' : 'justify-start'
      } px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-[#3d2a87] text-white'
          : 'text-gray-300 hover:bg-[#3d2a87]/50'
      }`}
    >
      <div className="w-4 h-4">{icon}</div>
      {!isCollapsed && <span className="ml-3 text-xs font-medium">{label}</span>}
    </Link>
  );
};

interface DashboardSidebarProps {
  isMobile?: boolean;
}

const DashboardSidebar = ({ isMobile = false }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Dashboard', to: '/dashboard' },
    { icon: <DollarSign className="w-4 h-4" />, label: 'Deposit', to: '/deposit' },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Withdraw', to: '/withdraw' },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Transfer', to: '/transfer' },
    { icon: <Wallet className="w-4 h-4" />, label: 'Wallet', to: '/wallet' },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Trade', to: '/trade' },
    { icon: <Layers className="w-4 h-4" />, label: 'Platform', to: '/platform' },
    { icon: <Users className="w-4 h-4" />, label: 'Refer', to: '/refer' },
    { icon: <Settings className="w-4 h-4" />, label: 'Settings', to: '/settings' },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    // Show loading toast
    toast({
      title: "Logging out...",
      description: "Please wait while we log you out.",
    });
    
    // Simulate network delay for logout
    setTimeout(() => {
      // Call the logout function from useAuth
      logout();
      
      // Navigate to login page
      navigate('/login');
      
      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out successfully.",
      });
    }, 800);
  };
  
  const handleVerification = () => {
    navigate('/verify');
  };

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu} />
        )}

        <aside
          className={`fixed left-0 top-0 bottom-0 w-60 bg-[#2D1B69] shadow-lg z-50 transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-16 border-b border-[#3d2a87]">
              <div className="flex items-baseline">
                <span className="text-[#9D6FFF] font-bold text-xl">Q</span>
                <span className="text-white font-bold text-xl">uantis</span>
                <span className="text-[#9D6FFF] font-bold text-xs translate-y-[-4px] ml-[1px]">FX</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-gray-300">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 border-b border-[#3d2a87]">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 border-2 border-[#3d2a87]">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-[#3d2a87] text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-300">{user?.email}</p>
                </div>
              </div>
              <div className="mt-2 bg-[#3d2a87] rounded-md p-2">
                <div className="flex items-center">
                  <div className="bg-amber-500 text-white text-[10px] rounded px-1.5 py-0.5">Basic</div>
                  <div className="ml-auto text-xs text-white">35% Complete</div>
                </div>
                <div className="mt-1 h-1 bg-[#4a3793] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <Button 
                onClick={handleVerification}
                className="w-full mt-2 text-xs bg-amber-500 hover:bg-amber-600 text-white"
                size="sm"
              >
                Complete Verification
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarItem
                    key={item.to}
                    icon={item.icon}
                    label={item.label}
                    to={item.to}
                    isActive={location.pathname === item.to}
                    isCollapsed={false}
                  />
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-[#3d2a87]">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-[#3d2a87] hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="text-xs">Log out</span>
              </Button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={`hidden md:flex h-screen flex-col border-r bg-[#2D1B69] ${
        isCollapsed ? 'w-16' : 'w-60'
      } transition-all duration-300 fixed left-0 top-0 z-10`}
    >
      <div className="flex items-center justify-between h-16 border-b border-[#3d2a87] px-4">
        {!isCollapsed && (
          <div className="flex items-baseline">
            <span className="text-[#9D6FFF] font-bold text-xl">Q</span>
            <span className="text-white font-bold text-xl">uantis</span>
            <span className="text-[#9D6FFF] font-bold text-xs translate-y-[-4px] ml-[1px]">FX</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse} 
          className={isCollapsed ? 'mx-auto text-gray-300' : 'text-gray-300'}
        >
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4" /> : 
            <ChevronLeft className="h-4 w-4" />
          }
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-b border-[#3d2a87]">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3 border-2 border-[#3d2a87]">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-[#3d2a87] text-white text-xs">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-300">{user?.email}</p>
            </div>
          </div>
          <div className="mt-2 bg-[#3d2a87] rounded-md p-2">
            <div className="flex items-center">
              <div className="bg-amber-500 text-white text-[10px] rounded px-1.5 py-0.5">Basic</div>
              <div className="ml-auto text-xs text-white">35% Complete</div>
            </div>
            <div className="mt-1 h-1 bg-[#4a3793] rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
          <Button 
            onClick={handleVerification}
            className="w-full mt-2 text-xs bg-amber-500 hover:bg-amber-600 text-white"
            size="sm"
          >
            Complete Verification
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-3 px-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isActive={location.pathname === item.to}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      <div className={`p-3 border-t border-[#3d2a87] ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Button
          variant="ghost"
          className={`${isCollapsed ? 'p-2 w-auto' : 'w-full justify-start'} text-gray-300 hover:bg-[#3d2a87] hover:text-white`}
          onClick={handleLogout}
        >
          <LogOut className={`${isCollapsed ? '' : 'mr-3'} h-4 w-4`} />
          {!isCollapsed && <span className="text-xs">Log out</span>}
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
