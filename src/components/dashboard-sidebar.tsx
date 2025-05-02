
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
      } px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-[#6D28D9]/10 text-[#6D28D9]'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      {!isCollapsed && <span className="ml-3 text-sm font-medium">{label}</span>}
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
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', to: '/dashboard' },
    { icon: <Wallet className="w-5 h-5" />, label: 'Wallet', to: '/wallet' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Deposit', to: '/deposit' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Withdraw', to: '/withdraw' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Trade', to: '/trade' },
    { icon: <Layers className="w-5 h-5" />, label: 'Platform', to: '/platform' },
    { icon: <Users className="w-5 h-5" />, label: 'Refer', to: '/refer' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Transfer', to: '/transfer' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', to: '/settings' },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <Menu className="h-6 w-6" />
        </Button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu} />
        )}

        <aside
          className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-16 border-b">
              <div className="flex items-baseline">
                <span className="text-[#7C3AED] font-bold text-xl">Q</span>
                <span className="text-black font-bold text-xl">uantis</span>
                <span className="text-[#7C3AED] font-bold text-xs translate-y-[-4px] ml-[1px]">FX</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3">
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

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => logout()}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Log out</span>
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
      className={`hidden md:flex h-screen flex-col border-r bg-white ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 fixed left-0 top-0 z-40`}
    >
      <div className="flex items-center justify-between h-16 border-b px-4">
        {!isCollapsed && (
          <div className="flex items-baseline">
            <span className="text-[#7C3AED] font-bold text-xl">Q</span>
            <span className="text-black font-bold text-xl">uantis</span>
            <span className="text-[#7C3AED] font-bold text-xs translate-y-[-4px] ml-[1px]">FX</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleCollapse} className={isCollapsed ? 'mx-auto' : ''}>
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
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

      <div className={`p-4 border-t ${isCollapsed ? 'flex justify-center' : ''}`}>
        <Button
          variant="ghost"
          className={`${isCollapsed ? 'p-2' : 'w-full justify-start'} text-red-500 hover:bg-red-50 hover:text-red-600`}
          onClick={() => logout()}
        >
          <LogOut className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5`} />
          {!isCollapsed && <span>Log out</span>}
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
