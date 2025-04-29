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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Check, Shield, Globe, Clock, Users, Eye, EyeOff, Loader2, BotIcon as Robot } from "lucide-react"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  countryCode: z.string({
    required_error: "Please select a country code.",
  }),
  phone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    }),
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration.",
  }),
  notRobot: z.boolean().refine((val) => val === true, {
    message: "Please verify you're not a robot.",
  }),
})

// Complete list of country codes
const countryCodes = [
  { code: "+1", country: "United States/Canada" },
  { code: "+7", country: "Russia/Kazakhstan" },
  { code: "+20", country: "Egypt" },
  { code: "+27", country: "South Africa" },
  { code: "+30", country: "Greece" },
  { code: "+31", country: "Netherlands" },
  { code: "+32", country: "Belgium" },
  { code: "+33", country: "France" },
  { code: "+34", country: "Spain" },
  { code: "+36", country: "Hungary" },
  { code: "+39", country: "Italy" },
  { code: "+40", country: "Romania" },
  { code: "+41", country: "Switzerland" },
  { code: "+43", country: "Austria" },
  { code: "+44", country: "United Kingdom" },
  { code: "+45", country: "Denmark" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+48", country: "Poland" },
  { code: "+49", country: "Germany" },
  { code: "+51", country: "Peru" },
  { code: "+52", country: "Mexico" },
  { code: "+55", country: "Brazil" },
  { code: "+56", country: "Chile" },
  { code: "+57", country: "Colombia" },
  { code: "+58", country: "Venezuela" },
  { code: "+60", country: "Malaysia" },
  { code: "+61", country: "Australia" },
  { code: "+62", country: "Indonesia" },
  { code: "+63", country: "Philippines" },
  { code: "+64", country: "New Zealand" },
  { code: "+65", country: "Singapore" },
  { code: "+66", country: "Thailand" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+84", country: "Vietnam" },
  { code: "+86", country: "China" },
  { code: "+90", country: "Turkey" },
  { code: "+91", country: "India" },
  { code: "+92", country: "Pakistan" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+95", country: "Myanmar" },
  { code: "+98", country: "Iran" },
  { code: "+211", country: "South Sudan" },
  { code: "+212", country: "Morocco" },
  { code: "+213", country: "Algeria" },
  { code: "+216", country: "Tunisia" },
  { code: "+218", country: "Libya" },
  { code: "+220", country: "Gambia" },
  { code: "+221", country: "Senegal" },
  { code: "+222", country: "Mauritania" },
  { code: "+223", country: "Mali" },
  { code: "+224", country: "Guinea" },
  { code: "+225", country: "Côte d'Ivoire" },
  { code: "+226", country: "Burkina Faso" },
  { code: "+227", country: "Niger" },
  { code: "+228", country: "Togo" },
  { code: "+229", country: "Benin" },
  { code: "+230", country: "Mauritius" },
  { code: "+231", country: "Liberia" },
  { code: "+232", country: "Sierra Leone" },
  { code: "+233", country: "Ghana" },
  { code: "+234", country: "Nigeria" },
  { code: "+235", country: "Chad" },
  { code: "+236", country: "Central African Republic" },
  { code: "+237", country: "Cameroon" },
  { code: "+238", country: "Cape Verde" },
  { code: "+239", country: "São Tomé and Príncipe" },
  { code: "+240", country: "Equatorial Guinea" },
  { code: "+241", country: "Gabon" },
  { code: "+242", country: "Republic of the Congo" },
  { code: "+243", country: "Democratic Republic of the Congo" },
  { code: "+244", country: "Angola" },
  { code: "+245", country: "Guinea-Bissau" },
  { code: "+246", country: "British Indian Ocean Territory" },
  { code: "+248", country: "Seychelles" },
  { code: "+249", country: "Sudan" },
  { code: "+250", country: "Rwanda" },
  { code: "+251", country: "Ethiopia" },
  { code: "+252", country: "Somalia" },
  { code: "+253", country: "Djibouti" },
  { code: "+254", country: "Kenya" },
  { code: "+255", country: "Tanzania" },
  { code: "+256", country: "Uganda" },
  { code: "+257", country: "Burundi" },
  { code: "+258", country: "Mozambique" },
  { code: "+260", country: "Zambia" },
  { code: "+261", country: "Madagascar" },
  { code: "+262", country: "Réunion" },
  { code: "+263", country: "Zimbabwe" },
  { code: "+264", country: "Namibia" },
  { code: "+265", country: "Malawi" },
  { code: "+266", country: "Lesotho" },
  { code: "+267", country: "Botswana" },
  { code: "+268", country: "Eswatini" },
  { code: "+269", country: "Comoros" },
  { code: "+297", country: "Aruba" },
  { code: "+298", country: "Faroe Islands" },
  { code: "+299", country: "Greenland" },
  { code: "+350", country: "Gibraltar" },
  { code: "+351", country: "Portugal" },
  { code: "+352", country: "Luxembourg" },
  { code: "+353", country: "Ireland" },
  { code: "+354", country: "Iceland" },
  { code: "+355", country: "Albania" },
  { code: "+356", country: "Malta" },
  { code: "+357", country: "Cyprus" },
  { code: "+358", country: "Finland" },
  { code: "+359", country: "Bulgaria" },
  { code: "+370", country: "Lithuania" },
  { code: "+371", country: "Latvia" },
  { code: "+372", country: "Estonia" },
  { code: "+373", country: "Moldova" },
  { code: "+374", country: "Armenia" },
  { code: "+375", country: "Belarus" },
  { code: "+376", country: "Andorra" },
  { code: "+377", country: "Monaco" },
  { code: "+378", country: "San Marino" },
  { code: "+380", country: "Ukraine" },
  { code: "+381", country: "Serbia" },
  { code: "+382", country: "Montenegro" },
  { code: "+383", country: "Kosovo" },
  { code: "+385", country: "Croatia" },
  { code: "+386", country: "Slovenia" },
  { code: "+387", country: "Bosnia and Herzegovina" },
  { code: "+389", country: "North Macedonia" },
  { code: "+420", country: "Czech Republic" },
  { code: "+421", country: "Slovakia" },
  { code: "+423", country: "Liechtenstein" },
  { code: "+500", country: "Falkland Islands" },
  { code: "+501", country: "Belize" },
  { code: "+502", country: "Guatemala" },
  { code: "+503", country: "El Salvador" },
  { code: "+504", country: "Honduras" },
  { code: "+505", country: "Nicaragua" },
  { code: "+506", country: "Costa Rica" },
  { code: "+507", country: "Panama" },
  { code: "+509", country: "Haiti" },
  { code: "+590", country: "Guadeloupe" },
  { code: "+591", country: "Bolivia" },
  { code: "+592", country: "Guyana" },
  { code: "+593", country: "Ecuador" },
  { code: "+595", country: "Paraguay" },
  { code: "+597", country: "Suriname" },
  { code: "+598", country: "Uruguay" },
  { code: "+599", country: "Curaçao" },
  { code: "+670", country: "East Timor" },
  { code: "+673", country: "Brunei" },
  { code: "+674", country: "Nauru" },
  { code: "+675", country: "Papua New Guinea" },
  { code: "+676", country: "Tonga" },
  { code: "+677", country: "Solomon Islands" },
  { code: "+678", country: "Vanuatu" },
  { code: "+679", country: "Fiji" },
  { code: "+680", country: "Palau" },
  { code: "+682", country: "Cook Islands" },
  { code: "+685", country: "Samoa" },
  { code: "+686", country: "Kiribati" },
  { code: "+687", country: "New Caledonia" },
  { code: "+688", country: "Tuvalu" },
  { code: "+689", country: "French Polynesia" },
  { code: "+690", country: "Tokelau" },
  { code: "+691", country: "Micronesia" },
  { code: "+692", country: "Marshall Islands" },
  { code: "+850", country: "North Korea" },
  { code: "+852", country: "Hong Kong" },
  { code: "+853", country: "Macau" },
  { code: "+855", country: "Cambodia" },
  { code: "+856", country: "Laos" },
  { code: "+880", country: "Bangladesh" },
  { code: "+886", country: "Taiwan" },
  { code: "+960", country: "Maldives" },
  { code: "+961", country: "Lebanon" },
  { code: "+962", country: "Jordan" },
  { code: "+963", country: "Syria" },
  { code: "+964", country: "Iraq" },
  { code: "+965", country: "Kuwait" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+967", country: "Yemen" },
  { code: "+968", country: "Oman" },
  { code: "+970", country: "Palestine" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+972", country: "Israel" },
  { code: "+973", country: "Bahrain" },
  { code: "+974", country: "Qatar" },
  { code: "+975", country: "Bhutan" },
  { code: "+976", country: "Mongolia" },
  { code: "+977", country: "Nepal" },
  { code: "+992", country: "Tajikistan" },
  { code: "+993", country: "Turkmenistan" },
  { code: "+994", country: "Azerbaijan" },
  { code: "+995", country: "Georgia" },
  { code: "+996", country: "Kyrgyzstan" },
  { code: "+998", country: "Uzbekistan" },
]

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

const RegisterForm = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [verifyingRobot, setVerifyingRobot] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("")
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: "",
      password: "",
      declaration: false,
      notRobot: false,
    },
  })

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    })
  }

  const handleRobotVerification = () => {
    setVerifyingRobot(true)

    // Simulate verification process
    setTimeout(() => {
      form.setValue("notRobot", true)
      setVerifyingRobot(false)
    }, 1500)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setIsSubmitting(true)

    // Simulate form submission and show loading page
    setTimeout(() => {
      setIsLoading(true)
      setStatusText("Initializing your account...")
    }, 1500)
  }

  // Handle loading progress
  useEffect(() => {
    if (!isLoading) return

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }

        const newProgress = prevProgress + 5

        // Update status text based on progress
        if (newProgress === 25) {
          setStatusText("Verifying your information...")
        } else if (newProgress === 50) {
          setStatusText("Setting up your trading account...")
        } else if (newProgress === 75) {
          setStatusText("Almost there...")
        } else if (newProgress >= 95) {
          setStatusText("Redirecting to verification...")
        }

        return newProgress
      })
    }, 300)

    // Redirect after loading completes
    const redirectTimer = setTimeout(() => {
      navigate("/verification")
    }, 7000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [isLoading, navigate])

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

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Setting Up Your Account</h1>
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

  // Show registration form
  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden min-h-screen">
      <div className="absolute -left-40 bottom-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-40 top-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="inline-block py-1.5 px-3 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] font-medium text-sm mb-6">
              Get Started
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
              Open Your <span className="text-[#7C3AED]">Trading Account</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Get started in minutes and join thousands of traders worldwide.
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
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Regulated and Secure</h3>
                  <p className="text-gray-600 mt-1">
                    Quantis is a regulated broker that adheres to strict financial standards and protects client funds
                    with segregated accounts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-center mb-8">
              <QuantisLogo className="text-3xl" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-8 font-display text-center">Create Account</h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Country Code</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.code} ({country.country})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="font-medium">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="234 567 890" type="tel" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className="h-12 pr-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              checkPasswordStrength(e.target.value)
                            }}
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
                      <div className="mt-2 space-y-2">
                        <p className={`text-sm ${passwordStrength.length ? "text-green-600" : "text-gray-500"}`}>
                          ✓ At least 8 characters
                        </p>
                        <p className={`text-sm ${passwordStrength.uppercase ? "text-green-600" : "text-gray-500"}`}>
                          ✓ At least one uppercase letter
                        </p>
                        <p className={`text-sm ${passwordStrength.lowercase ? "text-green-600" : "text-gray-500"}`}>
                          ✓ At least one lowercase letter
                        </p>
                        <p className={`text-sm ${passwordStrength.number ? "text-green-600" : "text-gray-500"}`}>
                          ✓ At least one number
                        </p>
                        <p className={`text-sm ${passwordStrength.special ? "text-green-600" : "text-gray-500"}`}>
                          ✓ At least one special character
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notRobot"
                  render={({ field }) => (
                    <FormItem>
                      <div
                        className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer ${field.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
                        onClick={!field.value && !verifyingRobot ? handleRobotVerification : undefined}
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-10 w-10 rounded-md flex items-center justify-center mr-3 ${field.value ? "bg-green-100" : "bg-gray-100"}`}
                          >
                            {verifyingRobot ? (
                              <Loader2 className="h-5 w-5 text-[#7C3AED] animate-spin" />
                            ) : field.value ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <Robot className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <span className="font-medium text-gray-700">
                            {verifyingRobot ? "Verifying..." : field.value ? "Verified" : "I am not a robot"}
                          </span>
                        </div>
                        {!field.value && !verifyingRobot && (
                          <div className="text-xs text-gray-500">Click to verify</div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="declaration"
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
                          I declare that I have read, understood and accept the{" "}
                          <a href="#" className="text-[#7C3AED] font-medium hover:underline">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-[#7C3AED] font-medium hover:underline">
                            Privacy Policy
                          </a>
                        </FormLabel>
                        <FormMessage />
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-[#7C3AED] hover:underline">
                Log in
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

export default RegisterForm
