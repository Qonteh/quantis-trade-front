"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, Shield, Globe, Clock, Users, Lock } from 'lucide-react'
import { useAuth } from "@/context/UserContext"
import Logo from "../ui/Logo"

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().optional(),
})

const LoginForm = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")
  const [loginError, setLoginError] = useState("")

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setLoginError("")
    setIsSubmitting(true)
    
    try {
      // For frontend demo, accept any valid email/password combination
      // Simulate successful login with any credentials
      setIsLoading(true);
      setStatusText("Authenticating...");
      
      // Store mock token and user data
      localStorage.setItem("token", "mock-jwt-token-for-frontend-demo");
      localStorage.setItem("user", JSON.stringify({
        id: "user-123",
        firstName: "Demo",
        lastName: "User",
        email: values.email,
        isVerified: true,
        createdAt: new Date().toISOString()
      }));
      
      // Simulate loading process
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            navigate("/dashboard")
            return 100
          }
          
          const newProgress = prev + 10
          
          if (newProgress === 30) {
            setStatusText("Fetching account information...")
          } else if (newProgress === 60) {
            setStatusText("Loading your trading dashboard...")
          } else if (newProgress >= 90) {
            setStatusText("Almost there...")
          }
          
          return newProgress
        })
      }, 300)
    } catch (error: any) {
      setIsSubmitting(false)
      setLoginError("Login failed. Please check your credentials and try again.")
    }
  }

  const benefits = [
    {
      icon: Globe,
      text: "Access to 10,000+ trading instruments",
    },
    {
      icon: Clock,
      text: "Ultra-fast execution with no requotes",
    },
    {
      icon: Users,
      text: "Free demo account with $10,000 virtual funds",
    },
    {
      icon: Shield,
      text: "24/5 customer support in multiple languages",
    },
  ]

  // Show loading screen if isLoading is true
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <Logo width={180} height={100} />
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-600 mb-6">{statusText}</p>

          <div className="relative pt-1 mb-6">
            <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#7C3AED] transition-all duration-300 ease-in-out"
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-[#7C3AED] animate-spin mr-3" />
            <span className="text-sm text-gray-700 font-medium">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    )
  }

  // Show login form
  return (
    <div className="py-16 md:py-20 bg-gray-50 relative overflow-hidden min-h-screen">
      <div className="absolute -left-40 bottom-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-40 top-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="inline-block py-1 px-2.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] font-medium text-xs mb-4">
              Welcome Back
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display leading-tight">
              Log in to <span className="text-[#7C3AED]">QUANTIS</span>
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Access your account to start trading on global markets.
            </p>

            <div className="mt-8 space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-4 w-4 text-[#7C3AED]" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">{benefit.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <Lock className="h-4 w-4 text-[#7C3AED]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Secure Trading Platform</h3>
                  <p className="text-gray-600 mt-1 text-xs">
                    Quantis FX employs advanced encryption and security measures to ensure your account and personal information remain protected.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-center mb-6">
              <Logo width={150} height={70} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-6 font-display text-center">Log In</h3>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                {loginError}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" className="h-10 text-sm" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <a href="#" className="text-xs text-[#7C3AED] hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className="h-10 pr-10 text-sm"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal text-xs text-gray-700">
                          Remember me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-10 text-sm rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Authenticating...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-xs text-gray-500">
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-[#7C3AED] hover:underline">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with dark background */}
      <footer className="mt-16 bg-[#2D1B69] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
            <div className="flex items-baseline mb-3">
  <img src="logo.jpg" alt="Logo" className="h-12" />
</div>

              <p className="text-gray-300 text-xs mb-4">
                Your trusted partner for online trading, providing access to global markets with advanced tools and
                exceptional support.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Quick Links</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a href="#" className="text-[#9D6FFF] hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#9D6FFF] hover:underline">
                    Trading Platforms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#9D6FFF] hover:underline">
                    Account Types
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#9D6FFF] hover:underline">
                    Trading Instruments
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#9D6FFF] hover:underline">
                    Education
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#9D6FFF] hover:underline">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Trading</h4>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Forex
                </a>
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Stocks
                </a>
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Indices
                </a>
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Commodities
                </a>
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Cryptocurrencies
                </a>
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  ETFs
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Contact</h4>
              <p className="text-gray-300 text-xs mb-1">1234 Trading Street, Financial District, 10001</p>
              <p className="text-gray-300 text-xs mb-1">+255  123-4567</p>
              <p className="text-gray-300 text-xs mb-3">info@quantis.com</p>

              <h4 className="font-medium text-white mb-2 text-sm">Trading Hours</h4>
              <p className="text-gray-300 text-xs mb-1">Monday to Friday: 24/5</p>
              <p className="text-gray-300 text-xs">Weekend: Crypto only</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#3D2B79]">
            <div className="flex flex-col md:flex-row justify-between">
              <p className="text-xs text-gray-300 mb-3 md:mb-0">© 2025 Quantis. All rights reserved.</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Terms of Service
                </a>
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Risk Disclosure
                </a>
                <a href="#" className="text-[#9D6FFF] hover:underline">
                  Cookie Policy
                </a>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-gray-400 leading-relaxed">
              Risk Warning: Trading derivatives and leveraged products carries a high level of risk, including the risk
              of losing substantially more than your initial investment. It is not suitable for all investors. Before
              you make any decision in relation to a financial product you should obtain and consider our Product
              Disclosure Statement (PDS) and Financial Services Guide (FSG) available on our website and seek
              independent advice if necessary.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LoginForm
