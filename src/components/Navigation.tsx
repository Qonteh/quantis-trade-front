
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/UserContext";
import { Menu, X, User, Settings, LogOut, Shield, Users } from 'lucide-react';
import Logo from './ui/Logo';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@quantis.com';

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <Logo width={120} height={40} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-gray-700 hover:text-[#7C3AED] px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/wallet" 
                  className={`text-gray-700 hover:text-[#7C3AED] px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/wallet') ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : ''
                  }`}
                >
                  Wallet
                </Link>
                <Link 
                  to="/platform" 
                  className={`text-gray-700 hover:text-[#7C3AED] px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/platform') ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : ''
                  }`}
                >
                  Platform
                </Link>
                
                {/* Admin Links */}
                {isAdmin && (
                  <>
                    <Link 
                      to="/admin" 
                      className={`text-gray-700 hover:text-[#7C3AED] px-3 py-2 text-sm font-medium transition-colors ${
                        isActive('/admin') ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : ''
                      }`}
                    >
                      <Shield className="h-4 w-4 inline mr-1" />
                      Admin
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className={`text-gray-700 hover:text-[#7C3AED] px-3 py-2 text-sm font-medium transition-colors ${
                        isActive('/admin/users') ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]' : ''
                      }`}
                    >
                      <Users className="h-4 w-4 inline mr-1" />
                      Clients
                    </Link>
                  </>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[#7C3AED] text-white text-xs">
                          {getInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/users" className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Manage Clients
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-[#7C3AED] px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/wallet"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wallet
                  </Link>
                  <Link
                    to="/platform"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Platform
                  </Link>
                  
                  {/* Admin Links for Mobile */}
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-gray-50 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4 inline mr-2" />
                        Admin Panel
                      </Link>
                      <Link
                        to="/admin/users"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-gray-50 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users className="h-4 w-4 inline mr-2" />
                        Manage Clients
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex items-center px-3 mb-3">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-[#7C3AED] text-white text-xs">
                          {getInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-gray-50 rounded-md"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7C3AED] hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
