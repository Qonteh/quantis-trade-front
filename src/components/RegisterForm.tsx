
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
import { AlertCircle } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
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
            isVerified: true, // Auto-verify the user
            createdAt: new Date().toISOString()
          }
        };

        // Store mock token and user data
        localStorage.setItem("token", mockResponse.token);
        localStorage.setItem("user", JSON.stringify(mockResponse.user));
        
        // Success notification
        toast({
          title: "Registration successful!",
          description: "Your account has been created. Welcome to Quantis FX!",
          variant: "default",
        })

        // Redirect to dashboard
        navigate("/dashboard")
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
