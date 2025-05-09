
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Logo from "./ui/Logo"

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isRobot, setIsRobot] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!countryCode) {
      setError("Please select a country code")
      return
    }
    
    if (isRobot) {
      setError("Please verify that you are not a robot")
      return
    }

    try {
      setIsLoading(true)
      
      // Simulate API call delay
      setTimeout(() => {
        // Hardcoded successful response - no actual API call
        const mockResponse = {
          success: true,
          token: "mock-jwt-token-for-frontend-demo",
          user: {
            id: "user-123",
            firstName,
            lastName,
            email,
            phone: `${countryCode}${phone}`,
            isVerified: false, // Set to false so verification is required
            createdAt: new Date().toISOString()
          }
        };

        // Store mock token and user data temporarily (will be used during verification)
        localStorage.setItem("temp_token", mockResponse.token);
        localStorage.setItem("temp_user", JSON.stringify(mockResponse.user));
        
        // Show success message
        toast({
          title: "Registration successful!",
          description: "Your account has been created. Please login to continue.",
          variant: "default",
        })

        // Set registration success state
        setRegistrationSuccess(true)
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }, 1500);
      
    } catch (err: any) {
      console.error("Registration error:", err)
      setError("Registration failed. Please try again.")
      
      toast({
        title: "Registration failed",
        description: "Please check your information and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Common country codes
  const countryCodes = [
    { value: "+1", label: "United States (+1)" },
    { value: "+44", label: "United Kingdom (+44)" },
    { value: "+91", label: "India (+91)" },
    { value: "+61", label: "Australia (+61)" },
    { value: "+86", label: "China (+86)" },
    { value: "+49", label: "Germany (+49)" },
    { value: "+33", label: "France (+33)" },
    { value: "+81", label: "Japan (+81)" },
    { value: "+7", label: "Russia (+7)" },
    { value: "+27", label: "South Africa (+27)" },
    { value: "+234", label: "Nigeria (+234)" },
    { value: "+254", label: "Kenya (+254)" },
    { value: "+971", label: "UAE (+971)" },
    { value: "+966", label: "Saudi Arabia (+966)" },
    { value: "+20", label: "Egypt (+20)" },
  ]

  // If registration is successful, show success message
  if (registrationSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Logo width={150} height={50} />
          </div>
          <CardTitle className="text-2xl text-center">Registration Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="text-green-600 w-6 h-6" />
          </div>
          <p className="text-gray-600 mb-4">
            Your account has been created successfully. You will be redirected to the login page to continue.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
            <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Redirecting to login page...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Logo width={150} height={50} />
        </div>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Enter your details to create your trading account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex gap-2">
              <div className="w-1/3">
                <Select 
                  value={countryCode} 
                  onValueChange={setCountryCode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input 
                id="phone" 
                className="w-2/3"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  setAgreedToTerms(checked)
                }
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <a href="/terms" className="text-[#7C3AED]">
                terms and conditions
              </a>
            </label>
          </div>

          {/* I am not a robot verification */}
          <div className="border border-gray-200 rounded-md p-3">
            <div className="flex items-center">
              <Checkbox 
                id="robot" 
                checked={!isRobot}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") {
                    setIsRobot(!checked)
                  }
                }}
              />
              <label
                htmlFor="robot"
                className="ml-3 text-sm font-medium leading-none"
              >
                I'm not a robot
              </label>
              <div className="ml-auto">
                <div className="flex items-center space-x-1">
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDIuNUEyLjUgMi41IDAgMDEyLjUgMGgyNUEyLjUgMi41IDAgMDEzMCAyLjV2MjVBMi41IDIuNSAwIDAxMjcuNSAzMGgtMjVBMi41IDIuNSAwIDAxMCAyNy41di0yNXoiIGZpbGw9IiNGOUFCMDAiLz4KPHBhdGggZD0iTTIxLjIwNSA3LjgxYy0uNTUyLS41NTItMS4zOTQtLjc4Ni0yLjE3LS42MTlsLTMuMzYzLjcyOC0zLjEzOCAzLjEzOGMtLjE0LjE0LS4xNC4zNjcgMCAuNTA3bC41MDcuNTA3Yy4xNC4xNC4zNjcuMTQuNTA3IDBsMy4xMzgtMy4xMzguNjQ3LS4xNHYxMS4wMzhjMCAuMTk4LjE2LjM1OC4zNTkuMzU4aC43MTdjLjE5OCAwIC4zNTktLjE2LjM1OS0uMzU4VjguOTY3YzAtLjA0MS0uMDA3LS4wODEtLjAyLS4xMmwuNDY5LS4xMDFjLjM4OS0uMDgzLjgxLjAzNCAxLjA5Ni4zMnMuNDAzLjcwNy4zMiAxLjA5NmwtMS42MzkgNy41NzRjLS4wODMuMzg5LS4zNDUuNzA3LS43MDcuODctbC01LjA0OSAyLjI3NC0uMDI5LjAxM2MtLjA5OC4wNDQtLjIwOC4wNDUtLjMwNi4wMDNsLTUuMTQyLTIuMjc0Yy0uMzYxLS4xNjMtLjYyNC0uNDgxLS43MDctLjg3bC0xLjYzOS03LjU3NGMtLjA4My0uMzg5LS4wMTQtLjgxLjMyLTEuMDk2cy43MDctLjQwMyAxLjA5Ni0uMzJsNC4yMjIuOTE0LjE2Ni4wMzVjLjE5My4wNC4zOS0uMDcyLjQzLS4yNjVsLjA3Mi0uMzNjLjA0LS4xOTMtLjA3Mi0uMzktLjI2NC0uNDNsLTQuMjIzLS45MTRjLS43NzUtLjE2OC0xLjYxNy4wNjctMi4xNy42MTktLjU1Mi41NTItLjc4NiAxLjM5NC0uNjE5IDIuMTdMNy4xIDIwLjc1NmMuMTY2Ljc3NS42OSAxLjQwNiAxLjQxMyAxLjc0bDUuMTcgMi4yODVjLjE5Ni4wODcuNDAzLjEzLjYxMS4xM2guMDU5Yy4xOTQgMCAuMzg5LS4wMzcuNTcyLS4xMTFsNS4wOTMtMi4yOTRjLjcyNC0uMzM0IDEuMjQ4LS45NjUgMS40MTMtMS43NGwxLjYzOS03LjU3NGMuMTY3LS43NzUtLjA2Ny0xLjYxNy0uNjE5LTIuMTd6IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg=="
                    alt="reCAPTCHA"
                    className="h-9 w-9"
                  />
                  <span className="text-xs text-gray-500">reCAPTCHA</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Privacy - Terms</div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-[#7C3AED] hover:underline">
            Login here
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
