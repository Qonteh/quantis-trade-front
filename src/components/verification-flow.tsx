"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Loader2,
  Check,
  Calendar,
  MapPin,
  Building,
  Globe,
  Upload,
  FileText,
  User,
  Briefcase,
  DollarSign,
  Wallet,
  CircleCheck,
  CreditCardIcon as CardIcon,
  BadgeCheck,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Logo component to ensure consistent styling
const QuantisLogo = ({ className = "", darkMode = false }) => (
  <div className={`flex items-baseline ${className}`}>
    <span className={`text-[#7C3AED] font-bold ${darkMode ? "text-[#9D6FFF]" : ""}`}>Q</span>
    <span className={`${darkMode ? "text-white" : "text-black"} font-bold`}>uantis</span>
    <span className={`${darkMode ? "text-[#9D6FFF]" : "text-[#7C3AED]"} font-bold text-xs translate-y-[-8px] ml-[1px]`}>
      FX
    </span>
  </div>
)

// Email verification form schema
const emailVerificationSchema = z.object({
  verificationCode: z.string().length(6, {
    message: "Verification code must be 6 digits",
  }),
})

// Personal information form schema
const personalInfoSchema = z.object({
  dateOfBirth: z.string().min(1, {
    message: "Date of birth is required",
  }),
  nationality: z.string().min(1, {
    message: "Nationality is required",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters",
  }),
})

// Profile verification schema
const profileVerificationSchema = z.object({
  tradingExperience: z.enum(["yes", "no"], {
    required_error: "Please select if you have traded forex before",
  }),
  employmentStatus: z.string({
    required_error: "Please select your employment status",
  }),
  annualIncome: z.string({
    required_error: "Please select your annual income range",
  }),
  sourceOfWealth: z.string({
    required_error: "Please select your source of wealth",
  }),
  investmentGoals: z.string({
    required_error: "Please select your investment goals",
  }),
  riskTolerance: z.string({
    required_error: "Please select your risk tolerance",
  }),
})

// Document verification schema
const documentVerificationSchema = z.object({
  documentType: z.enum(["passport", "drivingLicense", "identityCard"], {
    required_error: "Please select a document type",
  }),
  documentFile: z.any().optional(),
})

// List of all countries for nationality dropdown
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

// Employment status options
const employmentStatusOptions = ["Employed", "Self-Employed", "Retired", "Student", "Unemployed", "Other"]

// Annual income options
const annualIncomeOptions = [
  "Under $25,000",
  "$25,000 - $49,999",
  "$50,000 - $74,999",
  "$75,000 - $99,999",
  "$100,000 - $149,999",
  "$150,000 - $199,999",
  "$200,000 - $499,999",
  "$500,000+",
]

// Source of wealth options
const sourceOfWealthOptions = [
  "Employment Income",
  "Savings",
  "Investments",
  "Inheritance",
  "Business Income",
  "Pension",
  "Other",
]

// Investment goals options
const investmentGoalsOptions = [
  "Capital Growth",
  "Regular Income",
  "Preservation of Capital",
  "Retirement Planning",
  "Speculation",
  "Other",
]

// Risk tolerance options
const riskToleranceOptions = ["Conservative", "Moderate", "Aggressive"]

const VerificationFlow = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for tracking verification steps
  const [currentStep, setCurrentStep] = useState<"email" | "personal" | "loading" | "profile" | "document">("email")
  const [emailVerified, setEmailVerified] = useState(false)
  const [personalInfoVerified, setPersonalInfoVerified] = useState(false)
  const [profileVerified, setProfileVerified] = useState(false)
  const [documentVerified, setDocumentVerified] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStatusText, setLoadingStatusText] = useState("")

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Email verification states
  const [codeSent, setCodeSent] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [verificationError, setVerificationError] = useState("")

  // Personal info states
  const [submittingPersonalInfo, setSubmittingPersonalInfo] = useState(false)
  const [personalInfoError, setPersonalInfoError] = useState("")

  // Email verification form
  const emailForm = useForm<z.infer<typeof emailVerificationSchema>>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      verificationCode: "",
    },
  })

  // Personal information form
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      dateOfBirth: "",
      nationality: "",
      address: "",
      city: "",
    },
  })

  // Profile verification form
  const profileForm = useForm<z.infer<typeof profileVerificationSchema>>({
    resolver: zodResolver(profileVerificationSchema),
    defaultValues: {
      tradingExperience: undefined,
      employmentStatus: "",
      annualIncome: "",
      sourceOfWealth: "",
      investmentGoals: "",
      riskTolerance: "",
    },
  })

  // Document verification form
  const documentForm = useForm<z.infer<typeof documentVerificationSchema>>({
    resolver: zodResolver(documentVerificationSchema),
    defaultValues: {
      documentType: undefined,
      documentFile: undefined,
    },
  })

  // Handle sending verification code
  const handleSendCode = () => {
    setSendingCode(true)
    setVerificationError("")

    // Simulate API call to send verification code
    setTimeout(() => {
      setCodeSent(true)
      setSendingCode(false)
    }, 1500)
  }

  // Handle email verification code submission
  const onSubmitEmailVerification = (values: z.infer<typeof emailVerificationSchema>) => {
    setVerifyingCode(true)
    setVerificationError("")

    // Simulate API call to verify code
    setTimeout(() => {
      // Accept any code that matches the length requirement
      // This is hardcoded to always succeed for frontend demonstration
      setEmailVerified(true)
      setCurrentStep("personal")
      setVerifyingCode(false)
    }, 1500)
  }

  // Handle personal information submission
  const onSubmitPersonalInfo = (values: z.infer<typeof personalInfoSchema>) => {
    setSubmittingPersonalInfo(true)
    setPersonalInfoError("")

    // Simulate API call to verify personal information
    setTimeout(() => {
      setPersonalInfoVerified(true)
      setSubmittingPersonalInfo(false)
      handleCompleteVerification()
    }, 1500)
  }

  // Handle profile verification submission
  const onSubmitProfileVerification = (values: z.infer<typeof profileVerificationSchema>) => {
    console.log("Profile verification values:", values)

    // Simulate API call
    setIsLoading(true)
    setLoadingStatusText("Saving profile information...")

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 5
      })
    }, 100)

    setTimeout(() => {
      setProfileVerified(true)
      setIsLoading(false)
      setLoadingProgress(0)
      setCurrentStep("document")
    }, 2000)
  }

  // Handle document verification submission
  const onSubmitDocumentVerification = (values: z.infer<typeof documentVerificationSchema>) => {
    console.log("Document verification values:", values)

    if (!selectedFile) {
      return
    }

    setIsUploading(true)

    // Simulate file upload
    const uploadTimer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadTimer)
          return 100
        }
        return prev + 5
      })
    }, 100)

    setTimeout(() => {
      setDocumentVerified(true)
      setIsUploading(false)

      // Simulate redirect to dashboard
      setIsLoading(true)
      setLoadingStatusText("Verification complete! Redirecting to dashboard...")

      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    }, 3000)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    // Create preview for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }

    // Update form value
    documentForm.setValue("documentFile", file)
  }

  // Handle complete verification button click
  const handleCompleteVerification = () => {
    setIsLoading(true)
    setLoadingStatusText("Initializing verification process...")

    // Simulate loading process
    const timer = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }

        const newProgress = prevProgress + 5

        // Update status text based on progress
        if (newProgress === 25) {
          setLoadingStatusText("Verifying your information...")
        } else if (newProgress === 50) {
          setLoadingStatusText("Processing your data...")
        } else if (newProgress === 75) {
          setLoadingStatusText("Almost there...")
        } else if (newProgress >= 95) {
          setLoadingStatusText("Preparing next steps...")
        }

        return newProgress
      })
    }, 100)

    // After loading completes, move to profile verification
    setTimeout(() => {
      setIsLoading(false)
      setLoadingProgress(0)
      setCurrentStep("profile")
    }, 3000)
  }

  // Show loading screen if isLoading is true
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <QuantisLogo className="text-4xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification in Progress</h1>
          <p className="text-gray-600 mb-8">{loadingStatusText}</p>

          <div className="relative pt-1 mb-8">
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${loadingProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#7C3AED] transition-all duration-300 ease-in-out"
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#7C3AED] animate-spin mr-3" />
            <span className="text-gray-700 font-medium">{Math.round(loadingProgress)}%</span>
          </div>
        </div>
      </div>
    )
  }

  // Render verification steps progress
  const renderVerificationProgress = () => {
    const steps = [
      { id: "email", label: "Email", completed: emailVerified, icon: User },
      { id: "personal", label: "Personal Info", completed: personalInfoVerified, icon: FileText },
      { id: "profile", label: "Profile", completed: profileVerified, icon: Briefcase },
      { id: "document", label: "Documents", completed: documentVerified, icon: CardIcon },
    ]

    return (
      <div className="flex justify-between items-center w-full max-w-3xl mx-auto mb-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="relative">
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center border-2",
                  step.completed
                    ? "bg-green-100 border-green-500 text-green-500"
                    : currentStep === step.id
                      ? "bg-[#7C3AED]/10 border-[#7C3AED] text-[#7C3AED]"
                      : "bg-white border-gray-300 text-gray-400",
                )}
              >
                {step.completed ? <Check className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-1/2 left-full w-full h-0.5 -translate-y-1/2",
                    step.completed ? "bg-green-500" : "bg-gray-300",
                  )}
                  style={{ width: "calc(100% - 3rem)" }}
                ></div>
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-sm font-medium",
                step.completed ? "text-green-600" : currentStep === step.id ? "text-[#7C3AED]" : "text-gray-500",
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="py-12 bg-gray-50 relative overflow-hidden min-h-screen">
      {/* Background decorations */}
      <div className="absolute -left-40 bottom-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-40 top-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <QuantisLogo className="text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Account Verification</h1>
          <p className="mt-2 text-gray-600">Complete the verification steps to start trading</p>
        </div>

        {/* Verification Progress */}
        {renderVerificationProgress()}

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          {currentStep === "email" && (
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Verification</h2>

              {!codeSent ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    We need to verify your email address. Click the button below to receive a verification code.
                  </p>
                  <Button
                    onClick={handleSendCode}
                    disabled={sendingCode}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] w-full h-12"
                  >
                    {sendingCode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Code...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">
                    We've sent a verification code to your email address. Please check your inbox (and spam folder) and
                    enter the code below.
                  </p>

                  {verificationError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {verificationError}
                    </div>
                  )}

                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onSubmitEmailVerification)} className="space-y-6">
                      <FormField
                        control={emailForm.control}
                        name="verificationCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Verification Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter 6-digit code" {...field} className="h-12" maxLength={6} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSendCode}
                          disabled={sendingCode}
                          className="flex-1"
                        >
                          {sendingCode ? "Sending..." : "Resend Code"}
                        </Button>

                        <Button
                          type="submit"
                          className="bg-[#7C3AED] hover:bg-[#6D28D9] flex-1 h-12"
                          disabled={verifyingCode}
                        >
                          {verifyingCode ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                            </>
                          ) : (
                            "Verify Code"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          )}

          {currentStep === "personal" && (
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

              {personalInfoError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {personalInfoError}
                </div>
              )}

              <Form {...personalInfoForm}>
                <form onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-6">
                  <FormField
                    control={personalInfoForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-2" /> Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalInfoForm.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <Globe className="h-4 w-4 mr-2" /> Nationality
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your nationality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalInfoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-2" /> Address
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalInfoForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <Building className="h-4 w-4 mr-2" /> City
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your city" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-12 text-base rounded-xl"
                    disabled={submittingPersonalInfo}
                  >
                    {submittingPersonalInfo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {currentStep === "profile" && (
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-4">
                  <User className="h-5 w-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Profile Verification</h2>
                  <p className="text-gray-600">Tell us about your trading experience and financial background</p>
                </div>
              </div>

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfileVerification)} className="space-y-8">
                  <FormField
                    control={profileForm.control}
                    name="tradingExperience"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" /> Have you traded forex before?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                          
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="employmentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" /> Employment Status
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your employment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employmentStatusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="annualIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" /> Annual Income
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your annual income range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {annualIncomeOptions.map((income) => (
                              <SelectItem key={income} value={income}>
                                {income}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="sourceOfWealth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <Wallet className="h-4 w-4 mr-2" /> Source of Wealth
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your primary source of wealth" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sourceOfWealthOptions.map((source) => (
                              <SelectItem key={source} value={source}>
                                {source}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="investmentGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <BadgeCheck className="h-4 w-4 mr-2" /> Investment Goals
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your primary investment goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {investmentGoalsOptions.map((goal) => (
                              <SelectItem key={goal} value={goal}>
                                {goal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="riskTolerance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" /> Risk Tolerance
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your risk tolerance level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {riskToleranceOptions.map((risk) => (
                              <SelectItem key={risk} value={risk}>
                                {risk}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-12 text-base rounded-xl">
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {currentStep === "document" && (
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-4">
                  <CardIcon className="h-5 w-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Verify Your Identity</h2>
                  <p className="text-gray-600">Please upload one of the following documents</p>
                </div>
              </div>

              <Form {...documentForm}>
                <form onSubmit={documentForm.handleSubmit(onSubmitDocumentVerification)} className="space-y-8">
                  <FormField
                    control={documentForm.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Document Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                          >
                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-[#7C3AED] [&:has([data-state=checked])>div]:bg-[#7C3AED]/5">
                                <FormControl>
                                  <RadioGroupItem value="passport" className="sr-only" />
                                </FormControl>
                                <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-[#7C3AED]/70 hover:bg-[#7C3AED]/5 transition-colors">
                                  <div className="flex flex-col items-center text-center">
                                    <CardIcon className="h-8 w-8 mb-2 text-gray-600" />
                                    <span className="font-medium">Passport</span>
                                    <span className="text-xs text-gray-500 mt-1">Photo pages only</span>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>

                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-[#7C3AED] [&:has([data-state=checked])>div]:bg-[#7C3AED]/5">
                                <FormControl>
                                  <RadioGroupItem value="drivingLicense" className="sr-only" />
                                </FormControl>
                                <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-[#7C3AED]/70 hover:bg-[#7C3AED]/5 transition-colors">
                                  <div className="flex flex-col items-center text-center">
                                    <CardIcon className="h-8 w-8 mb-2 text-gray-600" />
                                    <span className="font-medium">Driving License</span>
                                    <span className="text-xs text-gray-500 mt-1">Front and back</span>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>

                            <FormItem>
                              <FormLabel className="[&:has([data-state=checked])>div]:border-[#7C3AED] [&:has([data-state=checked])>div]:bg-[#7C3AED]/5">
                                <FormControl>
                                  <RadioGroupItem value="identityCard" className="sr-only" />
                                </FormControl>
                                <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-[#7C3AED]/70 hover:bg-[#7C3AED]/5 transition-colors">
                                  <div className="flex flex-col items-center text-center">
                                    <CardIcon className="h-8 w-8 mb-2 text-gray-600" />
                                    <span className="font-medium">Identity Card</span>
                                    <span className="text-xs text-gray-500 mt-1">National ID</span>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf"
                    />

                    {!selectedFile ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <Upload className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Drag and drop your document here</p>
                          <p className="text-gray-500 text-sm mt-1">or</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
                        >
                          Browse Files
                        </Button>
                        <p className="text-xs text-gray-500">Supported formats: JPG, PNG, PDF. Max size: 10MB</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filePreview ? (
                          <div className="flex justify-center">
                            <img
                              src={filePreview || "/placeholder.svg"}
                              alt="Document preview"
                              className="max-h-48 rounded-lg border"
                            />
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <FileText className="h-12 w-12 text-[#7C3AED]" />
                          </div>
                        )}

                        <div>
                          <p className="text-gray-700 font-medium">{selectedFile.name}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>

                        <div className="flex justify-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedFile(null)
                              setFilePreview(null)
                              documentForm.setValue("documentFile", undefined)
                            }}
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
                          >
                            Change File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#7C3AED] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {documentVerified && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                      <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">Document Verified Successfully</p>
                        <p className="text-green-700 text-sm mt-1">
                          Your identity has been verified. You now have full access to all trading features.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-12 text-base rounded-xl"
                      disabled={!selectedFile || isUploading || documentVerified}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                        </>
                      ) : documentVerified ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Verified
                        </>
                      ) : (
                        "Upload Document"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
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

export default VerificationFlow
