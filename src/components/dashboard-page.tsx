"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  BarChart3,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Users,
  MonitorSmartphone,
  Bell,
  Settings,
  LogOut,
  DollarSign,
  CreditCard,
  PieChart,
  TrendingUp,
  AlertCircle,
  Edit,
  Search,
  User,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
  LineChart,
  Zap,
  Shield,
  Lock,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  MessageSquare,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  Minimize2,
  Maximize2,
  ArrowLeftRight,
  Loader2,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Add this CSS class to style the progress indicator properly
const progressIndicatorStyles = "bg-gradient-to-r from-[#9D6FFF] to-[#7C3AED]"

// Add this CSS class to style the amber progress indicator
const amberProgressIndicatorStyles = "bg-gradient-to-r from-amber-500 to-amber-400"

// Logo component to ensure consistent styling
const QuantisLogo = ({ className = "", darkMode = false }: { className?: string; darkMode?: boolean }) => (
  <div className={`flex items-baseline ${className}`}>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold`}>Q</span>
    <span className={`${darkMode ? "text-white" : "text-black"} font-bold`}>uantis</span>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold text-xs translate-y-[-8px] ml-[1px]`}>
      FX
    </span>
  </div>
)

// Define the market data type
interface MarketItem {
  pair: string
  price: string
  change: string
  trend: "up" | "down" | "neutral"
  previousPrice?: string
  isFlashing?: boolean
}

// Message type definition for chat
interface Message {
  id: number
  sender: "user" | "support"
  text: string
  timestamp: Date
  status?: "sent" | "delivered" | "read"
}

// Mock data for the dashboard
const accountSummary = {
  totalBalance: 5250.75,
  totalCredit: 1000.0,
  totalEquity: 6250.75,
  totalDeposit: 5000.0,
  totalWithdraw: 0.0,
  lastUpdated: new Date(),
  profitPercentage: 5.2,
}

const recentActivities = [
  {
    id: 1,
    type: "Deposit",
    amount: 2000.0,
    status: "Completed",
    date: "2025-04-25T14:30:00",
    description: "Bank Transfer",
  },
  {
    id: 2,
    type: "Deposit",
    amount: 3000.0,
    status: "Completed",
    date: "2025-04-20T10:15:00",
    description: "Credit Card",
  },
  {
    id: 3,
    type: "Trade",
    amount: 250.75,
    status: "Profit",
    date: "2025-04-24T16:45:00",
    description: "EUR/USD",
  },
  {
    id: 4,
    type: "Login",
    amount: null,
    status: "Success",
    date: "2025-04-27T08:20:00",
    description: "Web Platform",
  },
  {
    id: 5,
    type: "Password",
    amount: null,
    status: "Changed",
    date: "2025-04-15T11:30:00",
    description: "Security Update",
  },
]

const liveAccount = {
  accountNumber: "QFX7654321",
  accountType: "Standard",
  leverage: "1:2000", // Changed to 1:2000 as requested
  equity: 6250.75,
  balance: 5250.75,
  margin: 120.5,
  credit: 1000.0,
  platform: "MetaTrader 5",
  currency: "USD",
  openDate: "2025-04-01",
}

const demoAccount = {
  accountNumber: "DEMO9876543",
  accountType: "Demo Standard",
  leverage: "1:2000", // Changed to 1:2000 as requested
  equity: 10000.0,
  balance: 10000.0,
  margin: 0.0,
  credit: 0.0,
  platform: "MetaTrader 5",
  currency: "USD",
  openDate: "2025-04-27",
}

// Initial market data
const initialMarketData: MarketItem[] = [
  { pair: "EUR/USD", price: "1.0876", change: "+0.05%", trend: "up" },
  { pair: "GBP/USD", price: "1.2543", change: "-0.12%", trend: "down" },
  { pair: "USD/JPY", price: "153.67", change: "+0.23%", trend: "up" },
  { pair: "BTC/USD", price: "63,245.78", change: "+1.87%", trend: "up" },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Function to generate a random price change
const generateRandomPriceChange = (currentPrice: string, pair: string): string => {
  // Different volatility for different pairs
  let volatility = 0.0002 // Default for forex pairs

  if (pair === "BTC/USD") {
    volatility = 50 // Higher volatility for Bitcoin
  } else if (pair === "USD/JPY") {
    volatility = 0.05 // Medium volatility
  }

  const price = Number.parseFloat(currentPrice.replace(",", ""))
  const change = (Math.random() - 0.5) * volatility * 2
  const newPrice = price + change

  // Format based on pair
  if (pair === "BTC/USD") {
    return newPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else {
    return newPrice.toFixed(4)
  }
}

// Function to calculate percentage change
const calculatePercentageChange = (oldPrice: string, newPrice: string): string => {
  const oldVal = Number.parseFloat(oldPrice.replace(",", ""))
  const newVal = Number.parseFloat(newPrice.replace(",", ""))
  const percentChange = ((newVal - oldVal) / oldVal) * 100

  return percentChange > 0 ? `+${percentChange.toFixed(2)}%` : `${percentChange.toFixed(2)}%`
}

// Format timestamp for chat
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Help Popup Component
const HelpPopup = ({
  isOpen,
  onClose,
  onChatNow,
}: {
  isOpen: boolean
  onClose: () => void
  onChatNow: () => void
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div
        className="animate-in fade-in zoom-in duration-300 bg-white rounded-xl shadow-lg p-5 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-3">
            <MessageCircle className="h-6 w-6 text-[#7C3AED]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Need any help?</h3>
            <p className="text-sm text-gray-500">Our support team is ready to assist you</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">
            Get instant help with account setup, trading platforms, deposits, withdrawals, or any other questions you
            might have.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onChatNow} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex-1">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat with Support
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-200 text-gray-700 hover:bg-gray-100 flex-1"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  )
}

// Floating Help Button Component
const FloatingHelpButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-[#9D6FFF] to-[#7C3AED] text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 animate-bounce-slow"
    >
      <HelpCircle className="h-6 w-6" />
      <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
    </button>
  )
}

// Minimized Chat Bubble Component
const MinimizedChatBubble = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-gradient-to-r from-[#9D6FFF] to-[#7C3AED] text-white shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="text-[10px] mt-0.5">Chat</span>
      <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
    </button>
  )
}

// Loading Overlay Component
const LoadingOverlay = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col items-center max-w-sm w-full mx-4">
        <Loader2 className="h-12 w-12 text-[#7C3AED] animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-800">{message}</p>
        <p className="text-sm text-gray-500 mt-2 text-center">Please wait while we process your request</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  // Function to handle navigation
  const handleNavigation = (path: string) => {
    // Extract the route name without the slash
    const routeName = path.substring(1)
    // Update the active menu state
    setActiveMenu(routeName)
    // Navigate to the path
    window.location.href = path
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [verificationProgress, setVerificationProgress] = useState(35)
  const [activeTab, setActiveTab] = useState("live")

  // State for help popup and chat
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [isChatMaximized, setIsChatMaximized] = useState(false)

  // State for logout
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "support",
      text: "Hello! Welcome to Quantis FX support. How can I help you today?",
      timestamp: new Date(Date.now() - 60000),
      status: "read",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // State for real-time market data
  const [marketData, setMarketData] = useState<MarketItem[]>(initialMarketData)
  const marketDataRef = useRef<MarketItem[]>(initialMarketData)
  const [isConnected, setIsConnected] = useState(true)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Update current time every minute in EAT (East Africa Time, UTC+3)
  useEffect(() => {
    const updateTimeInEAT = () => {
      const now = new Date()
      // Convert to EAT (UTC+3)
      const eatOffset = 3 * 60 // 3 hours in minutes
      const localOffset = now.getTimezoneOffset() // Local offset in minutes
      const totalOffsetMs = (eatOffset + localOffset) * 60 * 1000

      const eatTime = new Date(now.getTime() + totalOffsetMs)
      setCurrentTime(eatTime)
    }

    // Initial update
    updateTimeInEAT()

    // Update every minute
    const timer = setInterval(updateTimeInEAT, 60000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Show help popup after 10 seconds if it hasn't been shown yet
  useEffect(() => {
    const hasShownPopup = sessionStorage.getItem("helpPopupShown")

    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsHelpPopupOpen(true)
        sessionStorage.setItem("helpPopupShown", "true")
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Fix scrolling issues
  useEffect(() => {
    // Apply smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth"

    // Fix stacking issues by ensuring proper z-index and overflow handling
    const mainContent = document.querySelector("main")
    if (mainContent) {
      mainContent.style.willChange = "transform"
      mainContent.style.backfaceVisibility = "hidden"
    }

    // Add custom font styles to the document
    document.documentElement.classList.add("font-sans")
    document.body.style.fontFamily =
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

    return () => {
      document.documentElement.style.scrollBehavior = ""
      if (mainContent) {
        mainContent.style.willChange = ""
        mainContent.style.backfaceVisibility = ""
      }
    }
  }, [])

  // Real-time market data updates
  useEffect(() => {
    // Simulate WebSocket connection for real-time data
    const updateMarketData = () => {
      const currentData = [...marketDataRef.current]

      const updatedData = currentData.map((item) => {
        const newPrice = generateRandomPriceChange(item.price, item.pair)
        const newChange = calculatePercentageChange(item.price, newPrice)
        const newTrend: "up" | "down" | "neutral" =
          Number.parseFloat(newPrice.replace(",", "")) > Number.parseFloat(item.price.replace(",", ""))
            ? "up"
            : Number.parseFloat(newPrice.replace(",", "")) < Number.parseFloat(item.price.replace(",", ""))
              ? "down"
              : "neutral"

        return {
          ...item,
          previousPrice: item.price,
          price: newPrice,
          change: newChange,
          trend: newTrend,
          isFlashing: true,
        }
      })

      marketDataRef.current = updatedData
      setMarketData(updatedData)

      // Remove flashing effect after a short delay
      setTimeout(() => {
        setMarketData((prevData) =>
          prevData.map((item) => ({
            ...item,
            isFlashing: false,
          })),
        )
      }, 500)
    }

    // Update every 2 seconds
    const intervalId = setInterval(() => {
      if (isConnected) {
        updateMarketData()
      }
    }, 2000)

    // Initial update
    updateMarketData()

    return () => {
      clearInterval(intervalId)
    }
  }, [isConnected])

  // Handle sending a new message
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
      status: "sent",
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue("")

    // Simulate support response after a delay
    setTimeout(() => {
      const supportResponses = [
        "I'd be happy to help with that. Could you provide more details?",
        "Thank you for reaching out. Let me check that for you.",
        "I understand your concern. Let me assist you with this issue.",
        "We're here to help! I'll connect you with the right department.",
        "That's a great question. Here's what you need to know...",
      ]

      const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)]

      const newSupportMessage: Message = {
        id: messages.length + 2,
        sender: "support",
        text: randomResponse,
        timestamp: new Date(),
        status: "read",
      }

      setMessages((prev) => [...prev, newSupportMessage])
    }, 1000)
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVerificationClick = () => {
    handleNavigation("/verification")
  }

  const handleHelpButtonClick = () => {
    setIsHelpPopupOpen(true)
  }

  const handleCloseHelpPopup = () => {
    setIsHelpPopupOpen(false)
  }

  const handleChatNow = () => {
    setIsHelpPopupOpen(false)
    setIsChatOpen(true)
    setIsChatMinimized(false)
  }

  const handleCloseChatPanel = () => {
    setIsChatOpen(false)
    setIsChatMinimized(false)
    setIsChatMaximized(false)
  }

  const handleMinimizeChatPanel = () => {
    setIsChatMinimized(true)
  }

  const handleMaximizeChatPanel = () => {
    setIsChatMinimized(false)
    setIsChatOpen(true)
  }

  const handleToggleMaximize = () => {
    setIsChatMaximized(!isChatMaximized)
  }

  const handleSupportMenuClick = () => {
    setIsChatOpen(true)
    setIsChatMinimized(false)
  }

  // Handle logout process
  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    setIsLoggingOut(true)

    // Simulate logout process with a delay
    setTimeout(() => {
      // Clear any session/local storage if needed
      localStorage.removeItem("user_session")
      sessionStorage.clear()

      // Redirect to login page
      window.location.href = "/"
    }, 2000)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  // Format time in EAT (East Africa Time)
  const formatEATTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Nairobi", // This is EAT timezone
    })
  }

  return (
    <div
      className="flex h-screen bg-[#f8fafc] overflow-hidden"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Logout loading overlay */}
      {isLoggingOut && <LoadingOverlay message="Logging out..." />}

      {/* Logout confirmation dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account? Any unsaved changes may be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={cancelLogout}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogout} className="bg-red-600 hover:bg-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sidebar with glass morphism effect */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-[#2D1B69]/95 via-[#3D2B79]/95 to-[#2D1B69]/95 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative backdrop-blur-md shadow-xl`}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-r-xl"></div>

        <div className="flex flex-col h-full relative z-10">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <QuantisLogo className="text-xl" darkMode={true} />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-10 w-10 mr-3 ring-2 ring-purple-400/30">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-[#9D6FFF] to-[#7C3AED] text-white text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-2 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-[#3D2B79]"></div>
              </div>
              <div>
                <p className="font-medium text-white text-sm">John Doe</p>
                <p className="text-xs text-gray-300">john.doe@example.com</p>
              </div>
            </div>

            <div className="mt-3 bg-white/10 rounded-lg p-2.5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-gray-300">Verification</span>
                <Badge
                  variant="outline"
                  className="bg-white/10 text-[#9D6FFF] border-[#9D6FFF]/30 text-[10px] px-1.5 py-0"
                >
                  Basic
                </Badge>
              </div>
              <Progress value={verificationProgress} className={`h-1 bg-white/20 [&>div]:${progressIndicatorStyles}`} />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-gray-300">{verificationProgress}% Complete</span>
                <Button
                  variant="link"
                  className="text-[10px] text-[#9D6FFF] p-0 h-auto hover:text-white"
                  onClick={handleVerificationClick}
                >
                  Complete
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "dashboard"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <BarChart3 className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/deposit")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "deposit"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ArrowDownToLine className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Deposit
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/withdraw")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "withdraw"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ArrowUpFromLine className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Withdraw
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/transfer")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "transfer"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ArrowLeftRight className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Transfer
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/wallet")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "wallet"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Wallet className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Wallet
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/trade")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "trade"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <LineChart className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Trade
                </button>
              </li>

              <li className="pt-1.5">
                <div className="px-3 py-1.5">
                  <div className="h-px bg-white/10"></div>
                </div>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("/refer")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "refer"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Users className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Refer Friends
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/platform")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "platform"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <MonitorSmartphone className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Platforms
                </button>
              </li>
              <li>
                <button
                  onClick={handleSupportMenuClick}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "support"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <MessageCircle className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Live Support
                </button>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-white/10">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleNavigation("/settings")}
                  className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg ${
                    activeMenu === "settings"
                      ? "bg-white/15 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Settings className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                  Settings
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <div className="mr-2.5 h-4 w-4 text-[#9D6FFF] animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2.5 h-4 w-4 text-[#9D6FFF]" />
                      Logout
                    </>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 shadow-sm z-30">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 lg:hidden text-gray-600 hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-base font-medium text-gray-800">Dashboard</h1>
            </div>

            {/* Market ticker with real-time updates */}
            <div className="hidden lg:flex items-center space-x-5 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
              <div className="flex items-center">
                <Badge
                  variant={isConnected ? "default" : "outline"}
                  className={`${isConnected ? "bg-green-500" : "bg-red-100 text-red-500 border-red-500"} text-[10px] px-1.5 py-0`}
                >
                  {isConnected ? "Live" : "Disconnected"}
                </Badge>
              </div>

              {marketData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-xs font-medium text-gray-700">{item.pair}</span>
                  <div
                    className={`flex items-center ml-1.5 transition-colors duration-300 ${
                      item.isFlashing ? (item.trend === "up" ? "bg-green-100" : "bg-red-100") : ""
                    } rounded-md px-1`}
                  >
                    <span className={`text-xs font-medium ${item.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {item.price}
                    </span>
                    <div className="flex flex-col ml-1">
                      {item.trend === "up" ? (
                        <ChevronUp className="h-2.5 w-2.5 text-green-500" />
                      ) : (
                        <ChevronDown className="h-2.5 w-2.5 text-red-500" />
                      )}
                      <span
                        className={`text-[10px] ${item.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                      >
                        {item.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              {/* Time in EAT timezone */}
              <div className="hidden md:flex items-center bg-gray-50 rounded-full px-2.5 py-1 border border-gray-100">
                <Globe className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                <span className="text-xs text-gray-700">EAT {formatEATTime(currentTime)}</span>
              </div>

              <div className="hidden md:flex items-center bg-gray-50 rounded-full px-2.5 py-1 border border-gray-100">
                <Search className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none text-xs w-32"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex items-center justify-between text-xs">
                    <span>Notifications</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      New
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-72 overflow-y-auto">
                    <DropdownMenuItem className="flex flex-col items-start p-2.5 cursor-pointer">
                      <div className="flex items-center w-full">
                        <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center mr-2.5">
                          <ArrowDownToLine className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">Deposit Successful</p>
                          <p className="text-[10px] text-gray-500">Your deposit of $2,000 has been processed.</p>
                        </div>
                        <span className="text-[10px] text-gray-400">2h ago</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-2.5 cursor-pointer">
                      <div className="flex items-center w-full">
                        <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center mr-2.5">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">Complete Verification</p>
                          <p className="text-[10px] text-gray-500">Verify your account to unlock all features.</p>
                        </div>
                        <span className="text-[10px] text-gray-400">1d ago</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-xs text-[#7C3AED] cursor-pointer">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder.svg?height=28&width=28" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-[#9D6FFF] to-[#7C3AED] text-white text-[10px]">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-xs">
                    <User className="mr-2 h-3.5 w-3.5" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-xs">
                    <Settings className="mr-2 h-3.5 w-3.5" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-xs">
                    <HelpCircle className="mr-2 h-3.5 w-3.5" />
                    <span>Help Center</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-xs" onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? (
                      <>
                        <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-3.5 w-3.5" />
                        <span>Logout</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile market ticker */}
          <div className="lg:hidden overflow-x-auto px-3 pb-2">
            <div className="flex items-center space-x-3">
              <Badge
                variant={isConnected ? "default" : "outline"}
                className={`${isConnected ? "bg-green-500" : "bg-red-100 text-red-500 border-red-500"} text-[10px] px-1.5 py-0 shrink-0`}
              >
                {isConnected ? "Live" : "Disconnected"}
              </Badge>

              {marketData.map((item, index) => (
                <div key={index} className="flex items-center shrink-0">
                  <span className="text-xs font-medium text-gray-700">{item.pair}</span>
                  <div
                    className={`flex items-center ml-1.5 transition-colors duration-300 ${
                      item.isFlashing ? (item.trend === "up" ? "bg-green-100" : "bg-red-100") : ""
                    } rounded-md px-1`}
                  >
                    <span className={`text-xs font-medium ${item.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {item.price}
                    </span>
                    <div className="flex flex-col ml-1">
                      {item.trend === "up" ? (
                        <ChevronUp className="h-2.5 w-2.5 text-green-500" />
                      ) : (
                        <ChevronDown className="h-2.5 w-2.5 text-red-500" />
                      )}
                      <span
                        className={`text-[10px] ${item.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                      >
                        {item.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-3 md:p-4 scroll-smooth z-0">
          {/* Welcome Section - Simplified and Elegant */}
          <div className="mb-4 bg-white rounded-xl p-3 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-2.5">
                  <User className="h-4 w-4 text-[#7C3AED]" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-800">Welcome back, John</h2>
                  <p className="text-[10px] text-gray-500">Here's your account overview</p>
                </div>
              </div>
              <div className="flex items-center text-[10px] text-gray-500">
                <Globe className="h-3 w-3 mr-1" />
                <span>EAT {formatEATTime(currentTime)}</span>
              </div>
            </div>
          </div>

          {/* Account Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Main Balance Card */}
            <Card className="col-span-1 lg:col-span-2 border-none shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm text-gray-700">Account Balance</CardTitle>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none text-[10px] px-1.5 py-0">
                    <TrendingUp className="h-2.5 w-2.5 mr-1" />
                    {accountSummary.profitPercentage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-3 pt-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(accountSummary.totalBalance)}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Total Balance</p>
                  </div>
                  <div className="mt-3 md:mt-0 flex space-x-2">
                    <Button
                      className="bg-[#7C3AED] hover:bg-[#6D28D9] h-8 text-xs rounded-lg"
                      onClick={() => handleNavigation("/deposit")}
                    >
                      <ArrowDownToLine className="mr-1.5 h-3.5 w-3.5" />
                      Deposit
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5 h-8 text-xs rounded-lg"
                      onClick={() => handleNavigation("/withdraw")}
                    >
                      <ArrowUpFromLine className="mr-1.5 h-3.5 w-3.5" />
                      Withdraw
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mr-2.5">
                        <PieChart className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{formatCurrency(accountSummary.totalEquity)}</p>
                        <p className="text-[10px] text-gray-500">Total Equity</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mr-2.5">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{formatCurrency(accountSummary.totalCredit)}</p>
                        <p className="text-[10px] text-gray-500">Total Credit</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-2.5">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{formatCurrency(accountSummary.totalDeposit)}</p>
                        <p className="text-[10px] text-gray-500">Total Deposit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status Card */}
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-amber-500/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-3">
                <CardTitle className="text-sm text-gray-700">Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 p-3 pt-0">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mr-2.5">
                    <Shield className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Basic Level</p>
                    <p className="text-[10px] text-gray-500">Limited account access</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-600">Verification Progress</span>
                      <span className="text-[10px] font-medium">{verificationProgress}%</span>
                    </div>
                    <Progress value={verificationProgress} className={`h-1 [&>div]:${amberProgressIndicatorStyles}`} />
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium">Complete Verification</p>
                        <p className="text-[10px] text-gray-500">Unlock all trading features</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white h-8 text-xs rounded-lg"
                    onClick={handleVerificationClick}
                  >
                    Complete Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Accounts */}
          <div className="mb-4">
            <h2 className="text-xs font-medium text-gray-800 mb-2 px-1">Trading Accounts</h2>

            {/* Custom Tab Implementation */}
            <div className="w-full">
              {/* Tab Headers */}
              <div className="mb-3 grid grid-cols-2 w-full bg-white p-0.5 rounded-lg border shadow-sm">
                <div
                  className={`w-full py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center ${
                    activeTab === "live" ? "bg-[#7C3AED] text-white" : "bg-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("live")}
                  style={{ zIndex: 10 }}
                >
                  Live Account
                </div>
                <div
                  className={`w-full py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center ${
                    activeTab === "demo" ? "bg-[#7C3AED] text-white" : "bg-transparent text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("demo")}
                  style={{ zIndex: 10 }}
                >
                  Demo Account
                </div>
              </div>

              {/* Live Account Content */}
              {activeTab === "live" && (
                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
                  <CardHeader className="relative z-10 p-3 pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">Live Trading Account</CardTitle>
                        <div className="flex items-center mt-0.5">
                          <CardDescription className="text-[10px]">
                            #{liveAccount.accountNumber} • {liveAccount.accountType}
                          </CardDescription>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(liveAccount.accountNumber)
                              // Show a toast or notification here if you want
                              alert("Account number copied to clipboard!")
                            }}
                            className="ml-1 text-gray-400 hover:text-[#7C3AED] transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span className="sr-only">Copy account number</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-[#7C3AED] transition-colors">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                              </svg>
                              <span className="sr-only">Account information</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-60">
                            <DropdownMenuLabel className="text-xs font-medium">Account Details</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="p-2 space-y-2">
                              <div className="grid grid-cols-2 gap-1">
                                <div className="text-xs text-gray-500">Account type</div>
                                <div className="text-xs font-medium">{liveAccount.accountType}</div>

                                <div className="text-xs text-gray-500">Platform</div>
                                <div className="text-xs font-medium">{liveAccount.platform}</div>

                                <div className="text-xs text-gray-500">Server</div>
                                <div className="text-xs font-medium">Quantis FX-Live</div>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none text-[10px] px-1.5 py-0">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 p-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Leverage</p>
                        <p className="text-xs font-semibold mt-0.5">{liveAccount.leverage}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Equity</p>
                        <p className="text-xs font-semibold mt-0.5">{formatCurrency(liveAccount.equity)}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Balance</p>
                        <p className="text-xs font-semibold mt-0.5">{formatCurrency(liveAccount.balance)}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Margin</p>
                        <p className="text-xs font-semibold mt-0.5">{formatCurrency(liveAccount.margin)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                      <div className="flex items-center mr-3">
                        <span className="text-[10px] font-medium text-gray-500 mr-1">Platform:</span>
                        <span className="text-[10px] font-semibold">{liveAccount.platform}</span>
                      </div>
                      <div className="flex items-center mr-3">
                        <span className="text-[10px] font-medium text-gray-500 mr-1">Currency:</span>
                        <span className="text-[10px] font-semibold">{liveAccount.currency}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[10px] font-medium text-gray-500 mr-1">Open Date:</span>
                        <span className="text-[10px] font-semibold">{liveAccount.openDate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="relative z-10 border-t pt-3 p-3 flex justify-between">
                    <Button
                      variant="outline"
                      className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5 h-7 text-xs rounded-lg"
                      onClick={() => handleNavigation("/platform")}
                    >
                      <MonitorSmartphone className="mr-1.5 h-3.5 w-3.5" />
                      Open Platform
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] h-7 text-xs rounded-lg">
                          <Edit className="mr-1.5 h-3.5 w-3.5" />
                          Account Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer text-xs">
                          <Lock className="mr-2 h-3.5 w-3.5" />
                          Change Password
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-xs">
                          <Zap className="mr-2 h-3.5 w-3.5" />
                          Change Leverage
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-xs">
                          <RefreshCw className="mr-2 h-3.5 w-3.5" />
                          Internal Transfer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 cursor-pointer text-xs">
                          <AlertCircle className="mr-2 h-3.5 w-3.5" />
                          Close Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              )}

              {/* Demo Account Content */}
              {activeTab === "demo" && (
                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-500/2 to-transparent rounded-xl"></div>
                  <CardHeader className="relative z-10 p-3 pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">Demo Trading Account</CardTitle>
                        <div className="flex items-center mt-0.5">
                          <CardDescription className="text-[10px]">
                            #{demoAccount.accountNumber} • {demoAccount.accountType}
                          </CardDescription>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(demoAccount.accountNumber)
                              // Show a toast or notification here if you want
                              alert("Account number copied to clipboard!")
                            }}
                            className="ml-1 text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span className="sr-only">Copy account number</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-blue-500 transition-colors">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                              </svg>
                              <span className="sr-only">Account information</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-60">
                            <DropdownMenuLabel className="text-xs font-medium">Account Details</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="p-2 space-y-2">
                              <div className="grid grid-cols-2 gap-1">
                                <div className="text-xs text-gray-500">Account type</div>
                                <div className="text-xs font-medium">{demoAccount.accountType}</div>

                                <div className="text-xs text-gray-500">Platform</div>
                                <div className="text-xs font-medium">{demoAccount.platform}</div>

                                <div className="text-xs text-gray-500">Server</div>
                                <div className="text-xs font-medium">Quantis FX-Demo</div>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none text-[10px] px-1.5 py-0">
                          Demo
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 p-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Leverage</p>
                        <p className="text-xs font-semibold mt-0.5">{demoAccount.leverage}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Equity</p>
                        <p className="text-xs font-semibold mt-0.5">{formatCurrency(demoAccount.equity)}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Balance</p>
                        <p className="text-xs font-semibold mt-0.5">{formatCurrency(demoAccount.balance)}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Margin</p>
                        <p className="text-xs font-semibold mt-0.5">{formatCurrency(demoAccount.margin)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
                      <div className="flex items-center mr-3">
                        <span className="text-[10px] font-medium text-gray-500 mr-1">Platform:</span>
                        <span className="text-[10px] font-semibold">{demoAccount.platform}</span>
                      </div>
                      <div className="flex items-center mr-3">
                        <span className="text-[10px] font-medium text-gray-500 mr-1">Currency:</span>
                        <span className="text-[10px] font-semibold">{demoAccount.currency}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[10px] font-medium text-gray-500 mr-1">Open Date:</span>
                        <span className="text-[10px] font-semibold">{demoAccount.openDate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="relative z-10 border-t pt-3 p-3 flex justify-between">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 h-7 text-xs rounded-lg"
                      onClick={() => handleNavigation("/platform")}
                    >
                      <MonitorSmartphone className="mr-1.5 h-3.5 w-3.5" />
                      Open Platform
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 h-7 text-xs rounded-lg">
                      <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                      Reset Balance
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="text-xs font-medium text-gray-800 mb-2 px-1">Recent Activities</h2>
            <Card className="border-none shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">Activity History</CardTitle>
                    <CardDescription className="text-[10px]">Recent account activities</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5 h-7 text-xs rounded-lg"
                  >
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 p-3 pt-0">
                <div className="rounded-lg overflow-hidden border border-gray-100">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="text-[10px] font-medium py-2">Type</TableHead>
                        <TableHead className="text-[10px] font-medium py-2">Description</TableHead>
                        <TableHead className="text-[10px] font-medium py-2">Date</TableHead>
                        <TableHead className="text-[10px] font-medium py-2">Status</TableHead>
                        <TableHead className="text-[10px] font-medium py-2 text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivities.map((activity) => (
                        <TableRow key={activity.id} className="hover:bg-gray-50">
                          <TableCell className="py-1.5">
                            <Badge
                              variant="outline"
                              className={
                                activity.type === "Deposit"
                                  ? "border-green-500 text-green-600 bg-green-50"
                                  : activity.type === "Withdraw"
                                    ? "border-red-500 text-red-600 bg-red-50"
                                    : activity.type === "Trade"
                                      ? "border-blue-500 text-blue-600 bg-blue-50"
                                      : "border-gray-500 text-gray-600 bg-gray-50"
                              }
                            >
                              <span className="text-[10px]">{activity.type}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="py-1.5 text-xs">{activity.description}</TableCell>
                          <TableCell className="py-1.5 text-xs">{formatDate(activity.date)}</TableCell>
                          <TableCell className="py-1.5">
                            <Badge
                              variant="outline"
                              className={
                                activity.status === "Completed" ||
                                activity.status === "Success" ||
                                activity.status === "Profit"
                                  ? "border-green-500 text-green-600 bg-green-50"
                                  : activity.status === "Pending"
                                    ? "border-amber-500 text-amber-600 bg-amber-50"
                                    : activity.status === "Failed"
                                      ? "border-red-500 text-red-600 bg-red-50"
                                      : "border-gray-500 text-gray-600 bg-gray-50"
                              }
                            >
                              <span className="text-[10px]">{activity.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="py-1.5 text-right text-xs">
                            {activity.amount !== null ? formatCurrency(activity.amount) : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="relative z-10 flex justify-center border-t pt-3 p-3 md:hidden">
                <Button
                  variant="outline"
                  className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5 h-7 text-xs rounded-lg"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  View All Activities
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>

      {/* Help Components */}
      {!isChatOpen && !isChatMinimized && <FloatingHelpButton onClick={handleHelpButtonClick} />}

      {isChatMinimized && <MinimizedChatBubble onClick={handleMaximizeChatPanel} />}

      {/* Help Popup */}
      <HelpPopup isOpen={isHelpPopupOpen} onClose={handleCloseHelpPopup} onChatNow={handleChatNow} />

      {/* Chat Panel */}
      {isChatOpen && !isChatMinimized && (
        <div
          className={`fixed z-50 bg-white shadow-xl flex flex-col transition-all duration-300 ${
            isChatMaximized ? "inset-4 rounded-xl" : "inset-y-0 right-0 w-full sm:w-96"
          }`}
        >
          {/* Chat Header */}
          <div className="border-b border-gray-100 shadow-sm px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 ring-2 ring-purple-400/30">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Support" />
                  <AvatarFallback className="bg-gradient-to-br from-[#9D6FFF] to-[#7C3AED] text-white text-xs">
                    QS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <QuantisLogo className="text-sm mr-1" />
                    <p className="font-medium text-gray-800 text-sm">Support</p>
                  </div>
                  <div className="flex items-center">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {/* Maximize/Minimize Button - Completely standalone */}
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                  onClick={handleToggleMaximize}
                >
                  {isChatMaximized ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </div>

                {/* Minimize Button - Completely standalone */}
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                  onClick={handleMinimizeChatPanel}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 15L12 9L6 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Close Button - Completely standalone */}
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                  onClick={handleCloseChatPanel}
                >
                  <X className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {/* Welcome Card */}
            <Card className="mb-6 border-none shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
              <CardHeader className="relative z-10 pb-2 pt-4 px-4">
                <div className="flex justify-center">
                  <Avatar className="h-16 w-16 mb-2">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Support" />
                    <AvatarFallback className="bg-gradient-to-br from-[#9D6FFF] to-[#7C3AED] text-white text-lg">
                      QS
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center text-lg text-gray-800">Quantis FX Support</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 text-center pb-4 px-4">
                <p className="text-sm text-gray-600 mb-2">
                  Our support team is here to help you with any questions or issues you may have.
                </p>
                <p className="text-xs text-gray-500">
                  Average response time: <span className="font-medium">Under 5 minutes</span>
                </p>
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {message.sender === "support" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Support" />
                      <AvatarFallback className="bg-gradient-to-br from-[#9D6FFF] to-[#7C3AED] text-white text-xs">
                        QS
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-[#7C3AED] text-white"
                        : "bg-white border border-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div
                      className={`text-[10px] mt-1 flex justify-end ${
                        message.sender === "user" ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-end">
              <div className="flex items-center space-x-2 mr-2">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
                  <Paperclip className="h-5 w-5" />
                </div>
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
                  <Smile className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-12 py-5 bg-gray-50 border-gray-200 rounded-full"
                />
                <div
                  onClick={handleSendMessage}
                  className={`absolute right-1 top-1 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer ${
                    inputValue.trim() === "" ? "bg-gray-300 cursor-not-allowed" : "bg-[#7C3AED] hover:bg-[#6D28D9]"
                  }`}
                >
                  <Send className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
