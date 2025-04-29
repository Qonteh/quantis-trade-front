"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, Shield, Globe, Clock, Users, Lock } from 'lucide-react'

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().optional(),
})

// Logo component to ensure consistent styling
const QuantisLogo = ({ className = "", darkMode = false }) => (
  <div className={`flex items-baseline ${className}`}>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold`}>Q</span>
    <span className={`${darkMode ? "text-white" : "text-black"} font-bold`}>uantis</span>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold text-xs translate-y-[-8px] ml-[1px]`}>
      FX
    </span>
  </div>
)

const LoginForm = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")
  const [loginError, setLoginError] = useState("")

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values)
    setLoginError("")
    setIsSubmitting(true)

    // Simulate form submission and authentication
    setTimeout(() => {
      // For demo purposes, successful login
      setIsSubmitting(false)
      setIsLoading(true)
      setStatusText("Authenticating...")
      
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
      
    }, 1500)
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
          <div className="mb-8 flex justify-center">
            <QuantisLogo className="text-4xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8">{statusText}</p>

          <div className="relative pt-1 mb-8">
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#7C3AED] transition-all duration-300 ease-in-out"
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#7C3AED] animate-spin mr-3" />
            <span className="text-gray-700 font-medium">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    )
  }

  // Show login form
  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden min-h-screen">
      <div className="absolute -left-40 bottom-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-40 top-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="inline-block py-1.5 px-3 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] font-medium text-sm mb-6">
              Welcome Back
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
              Log in to <span className="text-[#7C3AED]">Quantis FX</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Access your account to start trading on global markets.
            </p>

            <div className="mt-10 space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-[#7C3AED]" />
                  </div>
                  <p className="ml-4 text-gray-700 font-medium">{benefit.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Lock className="h-5 w-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Secure Trading Platform</h3>
                  <p className="text-gray-600 mt-1">
                    Quantis FX employs advanced encryption and security measures to ensure your account and personal information remain protected.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-center mb-8">
              <QuantisLogo className="text-3xl" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-8 font-display text-center">Log In</h3>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {loginError}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" className="h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-medium">Password</FormLabel>
                        <a href="#" className="text-sm text-[#7C3AED] hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className="h-12 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal text-sm text-gray-700">
                          Remember me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-12 text-base rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-[#7C3AED] hover:underline">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with dark background */}
      <footer className="mt-24 bg-[#2D1B69] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-baseline mb-4">
                <QuantisLogo className="text-2xl" darkMode={true} />
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Your trusted partner for online trading, providing access to global markets with advanced tools and
                exceptional support.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
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
              <h4 className="font-medium text-white mb-4">Trading</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
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
              <h4 className="font-medium text-white mb-4">Contact</h4>
              <p className="text-gray-300 text-sm mb-1">1234 Trading Street, Financial District, 10001</p>
              <p className="text-gray-300 text-sm mb-1">+1 (800) 123-4567</p>
              <p className="text-gray-300 text-sm mb-4">info@quantis.com</p>

              <h4 className="font-medium text-white mb-2">Trading Hours</h4>
              <p className="text-gray-300 text-sm mb-1">Monday to Friday: 24/5</p>
              <p className="text-gray-300 text-sm">Weekend: Crypto only</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#3D2B79]">
            <div className="flex flex-col md:flex-row justify-between">
              <p className="text-sm text-gray-300 mb-4 md:mb-0">© 2025 Quantis. All rights reserved.</p>
              <div className="flex flex-wrap gap-4 text-sm">
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
            <p className="mt-6 text-xs text-gray-400 leading-relaxed">
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