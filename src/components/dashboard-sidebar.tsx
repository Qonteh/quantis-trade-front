"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
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
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  to: string
  isActive: boolean
  isCollapsed: boolean
  onClick?: () => void
}

const SidebarItem = ({ icon, label, to, isActive, isCollapsed, onClick }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center ${
        isCollapsed ? "justify-center" : "justify-start"
      } px-3 py-2 rounded-lg transition-colors ${
        isActive ? "bg-[#3d2a87] text-white" : "text-gray-300 hover:bg-[#3d2a87]/50"
      }`}
      onClick={onClick}
    >
      <div className="w-4 h-4">{icon}</div>
      {!isCollapsed && <span className="ml-3 text-[10px] font-medium">{label}</span>}
    </Link>
  )
}

interface DashboardSidebarProps {
  isMobile?: boolean
}

const DashboardSidebar = ({ isMobile = false }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [location.pathname])

  const menuItems = [
    { icon: <Home className="w-4 h-4" />, label: "Dashboard", to: "/dashboard" },
    { icon: <DollarSign className="w-4 h-4" />, label: "Deposit", to: "/deposit" },
    { icon: <CreditCard className="w-4 h-4" />, label: "Withdraw", to: "/withdraw" },
    { icon: <CreditCard className="w-4 h-4" />, label: "Transfer", to: "/transfer" },
    { icon: <Wallet className="w-4 h-4" />, label: "Wallet", to: "/wallet" },
    { icon: <Layers className="w-4 h-4" />, label: "Platform", to: "/platform" },
    { icon: <Users className="w-4 h-4" />, label: "Refer", to: "/refer" },
    { icon: <Settings className="w-4 h-4" />, label: "Settings", to: "/settings" },
  ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    setIsLoggingOut(true)
    // Show loading toast
    toast({
      title: "Logging out...",
      description: "Please wait while we log you out.",
    })

    // Simulate network delay for logout
    setTimeout(() => {
      // Call the logout function from useAuth
      logout()

      // Navigate to login page
      navigate("/login")

      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out successfully.",
      })

      setIsLoggingOut(false)
    }, 800)
  }

  const handleVerification = () => {
    // Show loading toast
    toast({
      title: "Redirecting to verification",
      description: "Complete your profile verification to unlock all features.",
    })

    // Navigate to document verification page
    navigate("/document-verification")

    // Close mobile menu if open
    if (isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleMobileMenu}>
          <Menu className="h-5 w-5 text-white" />
        </Button>

        {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu} />}

        <aside
          className={`fixed left-0 top-0 bottom-0 w-64 bg-[#2D1B69] shadow-lg z-50 transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-16 border-b border-[#3d2a87] bg-white">
              <div className="flex items-center">
                <img src="/logo.jpg" alt="Logo" className="h-12 w-auto" />
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-gray-700">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 border-b border-[#3d2a87]">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 border-2 border-[#3d2a87]">
                  <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#3d2a87] text-white text-xs">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-xs text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-gray-300">{user?.email}</p>
                </div>
              </div>
              <div className="mt-2 bg-[#3d2a87] rounded-md p-2">
                <div className="flex items-center">
                  <div className="bg-amber-500 text-white text-[9px] rounded px-1.5 py-0.5">Basic</div>
                  <div className="ml-auto text-[10px] text-white">35% Complete</div>
                </div>
                <div className="mt-1 h-1 bg-[#4a3793] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              <Button
                onClick={handleVerification}
                className="w-full mt-2 text-[10px] bg-amber-500 hover:bg-amber-600 text-white"
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
                    onClick={handleMenuItemClick}
                  />
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-[#3d2a87]">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-[#3d2a87] hover:text-white"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-[10px]">Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="text-[10px]">Log out</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </aside>
      </>
    )
  }

  // Desktop sidebar
  return (
    <aside
      className={`hidden md:flex h-screen flex-col border-r bg-[#2D1B69] ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 fixed left-0 top-0 z-10`}
    >
      <div className="flex items-center justify-between h-16 border-b border-[#3d2a87] px-4 bg-white">
        {!isCollapsed && (
          <div className="flex items-center">
            <img src="/logo.jpg" alt="Logo" className="h-8 w-auto" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className={isCollapsed ? "mx-auto text-gray-700" : "text-gray-700"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-b border-[#3d2a87]">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3 border-2 border-[#3d2a87]">
              <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#3d2a87] text-white text-xs">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-xs text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-gray-300">{user?.email}</p>
            </div>
          </div>
          <div className="mt-2 bg-[#3d2a87] rounded-md p-2">
            <div className="flex items-center">
              <div className="bg-amber-500 text-white text-[9px] rounded px-1.5 py-0.5">Basic</div>
              <div className="ml-auto text-[10px] text-white">35% Complete</div>
            </div>
            <div className="mt-1 h-1 bg-[#4a3793] rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "35%" }}></div>
            </div>
          </div>
          <Button
            onClick={handleVerification}
            className="w-full mt-2 text-[10px] bg-amber-500 hover:bg-amber-600 text-white"
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

      <div className={`p-3 border-t border-[#3d2a87] ${isCollapsed ? "flex justify-center" : ""}`}>
        <Button
          variant="ghost"
          className={`${isCollapsed ? "p-2 w-auto" : "w-full justify-start"} text-gray-300 hover:bg-[#3d2a87] hover:text-white`}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {!isCollapsed && <span className="text-[10px] ml-3">Logging out...</span>}
            </>
          ) : (
            <>
              <LogOut className={`${isCollapsed ? "" : "mr-3"} h-4 w-4`} />
              {!isCollapsed && <span className="text-[10px]">Log out</span>}
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

export default DashboardSidebar
