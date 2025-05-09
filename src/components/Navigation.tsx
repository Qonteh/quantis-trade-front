
"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logo from "./ui/Logo"

export default function Navigation() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const isLoggedIn = localStorage.getItem("token") !== null

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo height={32} width={100} />
          </Link>
        </div>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link to="/" className="font-medium transition-colors hover:text-[#7C3AED]">
            Home
          </Link>
          <Link to="/platform" className="font-medium transition-colors hover:text-[#7C3AED]">
            Platforms
          </Link>
          <Link to="/markets" className="font-medium transition-colors hover:text-[#7C3AED]">
            Markets
          </Link>
          <Link to="/about" className="font-medium transition-colors hover:text-[#7C3AED]">
            About
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/deposit">Deposit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/withdraw">Withdraw</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open Menu" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-3 p-4 bg-white border-t">
            <Link to="/" className="font-medium py-2 px-3 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/platform" className="font-medium py-2 px-3 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
              Platforms
            </Link>
            <Link to="/markets" className="font-medium py-2 px-3 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
              Markets
            </Link>
            <Link to="/about" className="font-medium py-2 px-3 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
              About
            </Link>
            {/* Added login and register for mobile */}
            {isLoggedIn ? (
              <>
                <div className="border-t pt-2 mt-2"></div>
                <Link to="/dashboard" className="font-medium py-2 px-3 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <Link to="/profile" className="font-medium py-2 px-3 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link to="/deposit" className="font-medium py-2 px-3 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
                  Deposit
                </Link>
                <Link to="/withdraw" className="font-medium py-2 px-3 hover:bg-gray-100 rounded-md" onClick={toggleMenu}>
                  Withdraw
                </Link>
                <button onClick={handleLogout} className="text-left font-medium py-2 px-3 hover:bg-gray-100 rounded-md text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t pt-2 mt-2"></div>
                <Link
                  to="/login"
                  className="flex items-center gap-2 font-medium py-2 px-3 hover:bg-gray-100 rounded-md"
                  onClick={toggleMenu}
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 font-medium py-2 px-3 bg-[#7C3AED] text-white hover:bg-[#6D28D9] rounded-md"
                  onClick={toggleMenu}
                >
                  <User className="h-4 w-4" /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
