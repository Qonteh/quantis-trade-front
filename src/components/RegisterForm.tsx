"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Check, Eye, EyeOff, ChevronRight, Shield, Globe, Clock, Users, Lock, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// All country codes in a single array (shortened for brevity)
const countryCodes = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "American Samoa", code: "+1-684", flag: "🇦🇸" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Anguilla", code: "+1-264", flag: "🇦🇮" },
  { name: "Antarctica", code: "+672", flag: "🇦🇶" },
  { name: "Antigua and Barbuda", code: "+1-268", flag: "🇦🇬" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Aruba", code: "+297", flag: "🇦🇼" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "+1-242", flag: "🇧🇸" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "+1-246", flag: "🇧🇧" },
  { name: "Belarus", code: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "+229", flag: "🇧🇯" },
  { name: "Bermuda", code: "+1-441", flag: "🇧🇲" },
  { name: "Bhutan", code: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "British Indian Ocean Territory", code: "+246", flag: "🇮🇴" },
  { name: "British Virgin Islands", code: "+1-284", flag: "🇻🇬" },
  { name: "Brunei", code: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Cape Verde", code: "+238", flag: "🇨🇻" },
  { name: "Cayman Islands", code: "+1-345", flag: "🇰🇾" },
  { name: "Central African Republic", code: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Christmas Island", code: "+61", flag: "🇨🇽" },
  { name: "Cocos Islands", code: "+61", flag: "🇨🇨" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "+269", flag: "🇰🇲" },
  { name: "Cook Islands", code: "+682", flag: "🇨🇰" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "+53", flag: "🇨🇺" },
  { name: "Curacao", code: "+599", flag: "🇨🇼" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { name: "Democratic Republic of the Congo", code: "+243", flag: "🇨🇩" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "+1-767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "+1-809", flag: "🇩🇴" },
  { name: "East Timor", code: "+670", flag: "🇹🇱" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "+372", flag: "🇪🇪" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Falkland Islands", code: "+500", flag: "🇫🇰" },
  { name: "Faroe Islands", code: "+298", flag: "🇫🇴" },
  { name: "Fiji", code: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "French Polynesia", code: "+689", flag: "🇵🇫" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Gibraltar", code: "+350", flag: "🇬🇮" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Greenland", code: "+299", flag: "🇬🇱" },
  { name: "Grenada", code: "+1-473", flag: "🇬🇩" },
  { name: "Guam", code: "+1-671", flag: "🇬🇺" },
  { name: "Guatemala", code: "+502", flag: "🇬🇹" },
  { name: "Guernsey", code: "+44-1481", flag: "🇬🇬" },
  { name: "Guinea", code: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "+504", flag: "🇭🇳" },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "+354", flag: "🇮🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Isle of Man", code: "+44-1624", flag: "🇮🇲" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "+225", flag: "🇨🇮" },
  { name: "Jamaica", code: "+1-876", flag: "🇯🇲" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Jersey", code: "+44-1534", flag: "🇯🇪" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "+686", flag: "🇰🇮" },
  { name: "Kosovo", code: "+383", flag: "🇽🇰" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Macau", code: "+853", flag: "🇲🇴" },
  { name: "Macedonia", code: "+389", flag: "🇲🇰" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "+692", flag: "🇲🇭" },
  { name: "Mauritania", code: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "+230", flag: "🇲🇺" },
  { name: "Mayotte", code: "+262", flag: "🇾🇹" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Micronesia", code: "+691", flag: "🇫🇲" },
  { name: "Moldova", code: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪" },
  { name: "Montserrat", code: "+1-664", flag: "🇲🇸" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "Netherlands Antilles", code: "+599", flag: "🇧🇶" },
  { name: "New Caledonia", code: "+687", flag: "🇳🇨" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Niue", code: "+683", flag: "🇳🇺" },
  { name: "North Korea", code: "+850", flag: "🇰🇵" },
  { name: "Northern Mariana Islands", code: "+1-670", flag: "🇲🇵" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "+680", flag: "🇵🇼" },
  { name: "Palestine", code: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Pitcairn", code: "+64", flag: "🇵🇳" },
  { name: "Poland", code: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Puerto Rico", code: "+1-787", flag: "🇵🇷" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Republic of the Congo", code: "+242", flag: "🇨🇬" },
  { name: "Reunion", code: "+262", flag: "🇷🇪" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Saint Barthelemy", code: "+590", flag: "🇧🇱" },
  { name: "Saint Helena", code: "+290", flag: "🇸🇭" },
  { name: "Saint Kitts and Nevis", code: "+1-869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "+1-758", flag: "🇱🇨" },
  { name: "Saint Martin", code: "+590", flag: "🇲🇫" },
  { name: "Saint Pierre and Miquelon", code: "+508", flag: "🇵🇲" },
  { name: "Saint Vincent and the Grenadines", code: "+1-784", flag: "🇻🇨" },
  { name: "Samoa", code: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Sint Maarten", code: "+1-721", flag: "🇸🇽" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "South Sudan", code: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "+597", flag: "🇸🇷" },
  { name: "Svalbard and Jan Mayen", code: "+47", flag: "🇸🇯" },
  { name: "Swaziland", code: "+268", flag: "🇸🇿" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
  { name: "Tokelau", code: "+690", flag: "🇹🇰" },
  { name: "Tonga", code: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "+1-868", flag: "🇹🇹" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "+993", flag: "🇹🇲" },
  { name: "Turks and Caicos Islands", code: "+1-649", flag: "🇹🇨" },
  { name: "Tuvalu", code: "+688", flag: "🇹🇻" },
  { name: "U.S. Virgin Islands", code: "+1-340", flag: "🇻🇮" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "+678", flag: "🇻🇺" },
  { name: "Vatican", code: "+379", flag: "🇻🇦" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Wallis and Futuna", code: "+681", flag: "🇼🇫" },
  { name: "Western Sahara", code: "+212", flag: "🇪🇭" },
  { name: "Yemen", code: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "+263", flag: "🇿🇼" },
]

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [countryFlag, setCountryFlag] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isRobot, setIsRobot] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    // Simple password strength check
    let strength = 0
    let feedback = ""

    if (password.length >= 8) strength += 1
    if (password.match(/[A-Z]/)) strength += 1
    if (password.match(/[0-9]/)) strength += 1
    if (password.match(/[^A-Za-z0-9]/)) strength += 1

    switch (strength) {
      case 0:
        feedback = "Very weak"
        break
      case 1:
        feedback = "Weak"
        break
      case 2:
        feedback = "Fair"
        break
      case 3:
        feedback = "Good"
        break
      case 4:
        feedback = "Strong"
        break
    }

    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }, [password])

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

      // Simulate API call delay with progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 5
        })
      }, 100)

      // Simulate API call delay
      setTimeout(() => {
        clearInterval(interval)

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
            createdAt: new Date().toISOString(),
          },
        }

        // Store mock token and user data temporarily (will be used during verification)
        localStorage.setItem("temp_token", mockResponse.token)
        localStorage.setItem("temp_user", JSON.stringify(mockResponse.user))

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
      }, 2000)
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

  // If registration is successful, show success message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4">
        <Card className="w-full max-w-md mx-auto border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-6">
              <img src="/logo.jpg" alt="Logo" className="h-12 w-auto object-contain" />
            </div>
            <CardTitle className="text-xl text-center text-gray-900">Registration Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-md">
              <Check className="text-white w-8 h-8" />
            </div>
            <p className="text-gray-700 mb-6 text-sm">
              Your account has been created successfully. You will be redirected to the login page to continue.
            </p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Redirecting to login page...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 relative overflow-hidden py-8 px-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600"></div>
      <div className="absolute -left-40 -bottom-20 w-80 h-80 bg-purple-100 rounded-full opacity-70 blur-3xl"></div>
      <div className="absolute -right-40 -top-20 w-80 h-80 bg-indigo-100 rounded-full opacity-70 blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column: Benefits */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-8">
              <div className="inline-block py-1.5 px-3 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 font-medium text-xs mb-6 shadow-sm border border-purple-100">
                Join Quantis Trading
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                Create your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  QUANTIS
                </span>{" "}
                account
              </h2>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Join thousands of traders worldwide and access global markets with our cutting-edge platform.
              </p>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-purple-100"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="ml-3 text-xs text-gray-700">{benefit.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-white rounded-xl p-5 border border-gray-100 shadow-sm backdrop-blur-md bg-opacity-80">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">Secure Trading Environment</h3>
                    <p className="text-gray-600 mt-1 text-xs leading-relaxed">
                      Quantis employs enterprise-grade encryption and multi-layered security protocols to ensure your
                      investments and personal information remain protected at all times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Registration form */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <img src="/logo.jpg" alt="Logo" className="h-13 w-auto object-contain" />
                </div>
                <CardTitle className="text-xl text-center text-gray-900">Create an Account</CardTitle>
                <CardDescription className="text-center text-xs text-gray-500">
                  Enter your details to create your trading account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-xs font-medium">Error</AlertTitle>
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-9 text-xs bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-9 text-xs bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 text-xs bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <Select
                          value={countryCode}
                          onValueChange={(value) => {
                            setCountryCode(value)
                            const country = countryCodes.find((c) => c.code === value)
                            if (country) {
                              setCountryFlag(country.flag)
                            }
                          }}
                        >
                          <SelectTrigger className="h-9 text-xs bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Select">
                              {countryCode && (
                                <div className="flex items-center">
                                  {countryFlag && <span className="mr-1">{countryFlag}</span>}
                                  <span>{countryCode}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code} className="text-xs">
                                <div className="flex items-center">
                                  <span className="mr-1">{country.flag}</span>
                                  <span className="mr-1">{country.code}</span>
                                  <span className="text-gray-500 text-[10px]">{country.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        id="phone"
                        className="w-2/3 h-9 text-xs bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        className="h-9 pr-10 text-xs bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex space-x-1 w-full">
                            {[1, 2, 3, 4].map((index) => (
                              <div
                                key={index}
                                className={`h-1 flex-1 rounded-full ${
                                  passwordStrength >= index
                                    ? passwordStrength === 1
                                      ? "bg-red-400"
                                      : passwordStrength === 2
                                        ? "bg-yellow-400"
                                        : passwordStrength === 3
                                          ? "bg-green-400"
                                          : "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              ></div>
                            ))}
                          </div>
                          <span
                            className={`text-[10px] ml-2 ${
                              passwordStrength === 1
                                ? "text-red-500"
                                : passwordStrength === 2
                                  ? "text-yellow-500"
                                  : passwordStrength >= 3
                                    ? "text-green-500"
                                    : "text-gray-400"
                            }`}
                          >
                            {passwordFeedback}
                          </span>
                        </div>
                        <ul className="text-[10px] text-gray-500 space-y-0.5 mt-1">
                          <li className={password.length >= 8 ? "text-green-500" : ""}>• At least 8 characters</li>
                          <li className={password.match(/[A-Z]/) ? "text-green-500" : ""}>
                            • At least one uppercase letter
                          </li>
                          <li className={password.match(/[0-9]/) ? "text-green-500" : ""}>• At least one number</li>
                          <li className={password.match(/[^A-Za-z0-9]/) ? "text-green-500" : ""}>
                            • At least one special character
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-9 pr-10 text-xs bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <div className="flex items-center mt-1">
                        {password === confirmPassword ? (
                          <>
                            <Check className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-[10px] text-green-500">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-[10px] text-red-500">Passwords don't match</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start space-x-2 pt-1">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => {
                        if (typeof checked === "boolean") {
                          setAgreedToTerms(checked)
                        }
                      }}
                      className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 mt-0.5"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-700 leading-tight cursor-pointer">
                      I agree to the{" "}
                      <a href="/terms" className="text-purple-600 hover:underline">
                        terms and conditions
                      </a>
                      , and I have read the{" "}
                      <a href="/privacy" className="text-purple-600 hover:underline">
                        privacy policy
                      </a>
                    </label>
                  </div>

                  {/* I am not a robot verification */}
                  <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="flex items-center">
                      <Checkbox
                        id="robot"
                        checked={!isRobot}
                        onCheckedChange={(checked) => {
                          if (typeof checked === "boolean") {
                            setIsRobot(!checked)
                          }
                        }}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <label htmlFor="robot" className="ml-3 text-xs text-gray-700 cursor-pointer">
                        I'm not a robot
                      </label>
                      <div className="ml-auto">
                        <div className="flex items-center space-x-1">
                          <img
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDIuNUEyLjUgMi41IDAgMDEyLjUgMGgyNUEyLjUgMi41IDAgMDEzMCAyLjV2MjVBMi41IDIuNSAwIDAxMjcuNSAzMGgtMjVBMi41IDIuNSAwIDAxMCAyNy41di0yNXoiIGZpbGw9IiNGOUFCMDAiLz4KPHBhdGggZD0iTTIxLjIwNSA3LjgxYy0uNTUyLS41NTItMS4zOTQtLjc4Ni0yLjE3LS42MTlsLTMuMzYzLjcyOC0zLjEzOCAzLjEzOGMtLjE0LjE0LS4xNC4zNjcgMCAuNTA3bC41MDcuNTA3Yy4xNC4xNC4zNjcuMTQuNTA3IDBsMy4xMzgtMy4xMzguNjQ3LS4xNHYxMS4wMzhjMCAuMTk4LjE2LjM1OC4zNTkuMzU4aC43MTdjLjE5OCAwIC4zNTktLjE2LjM1OS0uMzU4VjguOTY3YzAtLjA0MS0uMDA3LS4wODEtLjAyLS4xMmwuNDY5LS4xMDFjLjM4OS0uMDgzLjgxLjAzNCAxLjA5Ni4zMnMuNDAzLjcwNy4zMiAxLjA5NmwtMS42MzkgNy41NzRjLS4wODMuMzg5LS4zNDUuNzA3LS43MDcuODctbC01LjA0OSAyLjI3NC0uMDI5LjAxM2MtLjA5OC4wNDQtLjIwOC4wNDUtLjMwNi4wMDNsLTUuMTQyLTIuMjc0Yy0uMzYxLS4xNjMtLjYyNC0uNDgxLS43MDctLjg3bC0xLjYzOS03LjU3NGMtLjA4My0uMzg5LS4wMTQtLjgxLjMyLTEuMDk2cy43MDctLjQwMyAxLjA5Ni0uMzJsNC4yMjIuOTE0LjE2Ni4wMzVjLjE5My4wNC4zOS0uMDcyLjQzLS4yNjVsLjA3Mi0uMzNjLjA0LS4xOTMtLjA3Mi0uMzktLjI2NC0uNDNsLTQuMjIzLS45MTRjLS43NzUtLjE2OC0xLjYxNy4wNjctMi4xNy42MTktLjU1Mi41NTItLjc4NiAxLjM5NC0uNjE5IDIuMTdMNy4xIDIwLjc1NmMuMTY2Ljc3NS42OSAxLjQwNiAxLjQxMyAxLjc0bDUuMTcgMi4yODVjLjE5Ni4wODcuNDAzLjEzLjYxMS4xM2guMDU5Yy4xOTQgMCAuMzg5LS4wMzcuNTcyLS4xMTFsNS4wOTMtMi4yOTRjLjcyNC0uMzM0IDEuMjQ4LS45NjUgMS40MTMtMS43NGwxLjYzOS03LjU3NGMuMTY3LS43NzUtLjA2Ny0xLjYxNy0uNjE5LTIuMTd6IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg=="
                            alt="reCAPTCHA"
                            className="h-7 w-7"
                          />
                          <span className="text-[10px] text-gray-500">reCAPTCHA</span>
                        </div>
                        <div className="text-[9px] text-gray-400 mt-0.5">Privacy - Terms</div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-10 text-xs rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <div className="flex flex-col items-start">
                          <span>Creating Account...</span>
                          <span className="text-[10px] text-white/80">{progress}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Create Account</span>
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center pt-0 pb-6">
                <p className="text-xs text-gray-500">
                  Already have an account?{" "}
                  <a href="/login" className="text-purple-600 hover:underline font-medium">
                    Login here
                  </a>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
