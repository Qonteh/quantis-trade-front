
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from "@/context/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Password validation pattern: 8-30 chars, at least 1 uppercase, 1 lowercase, and 1 special character
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,30}$/;

const registerSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  countryCode: z.string().min(1, {
    message: "Country code is required.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  password: z.string().refine(val => passwordPattern.test(val), {
    message: "Password must be 8-30 characters with at least one uppercase letter, one lowercase letter, and one special character.",
  }),
  confirmPassword: z.string(),
  termsAndConditions: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
  captcha: z.boolean().refine(val => val === true, {
    message: "Please confirm you are not a robot.",
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// All country codes in the world
const countryCodes = [
  { value: "+1", label: "United States (+1)" },
  { value: "+7", label: "Russia/Kazakhstan (+7)" },
  { value: "+20", label: "Egypt (+20)" },
  { value: "+27", label: "South Africa (+27)" },
  { value: "+30", label: "Greece (+30)" },
  { value: "+31", label: "Netherlands (+31)" },
  { value: "+32", label: "Belgium (+32)" },
  { value: "+33", label: "France (+33)" },
  { value: "+34", label: "Spain (+34)" },
  { value: "+36", label: "Hungary (+36)" },
  { value: "+39", label: "Italy/Vatican (+39)" },
  { value: "+40", label: "Romania (+40)" },
  { value: "+41", label: "Switzerland (+41)" },
  { value: "+43", label: "Austria (+43)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+45", label: "Denmark (+45)" },
  { value: "+46", label: "Sweden (+46)" },
  { value: "+47", label: "Norway (+47)" },
  { value: "+48", label: "Poland (+48)" },
  { value: "+49", label: "Germany (+49)" },
  { value: "+51", label: "Peru (+51)" },
  { value: "+52", label: "Mexico (+52)" },
  { value: "+53", label: "Cuba (+53)" },
  { value: "+54", label: "Argentina (+54)" },
  { value: "+55", label: "Brazil (+55)" },
  { value: "+56", label: "Chile (+56)" },
  { value: "+57", label: "Colombia (+57)" },
  { value: "+58", label: "Venezuela (+58)" },
  { value: "+60", label: "Malaysia (+60)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+62", label: "Indonesia (+62)" },
  { value: "+63", label: "Philippines (+63)" },
  { value: "+64", label: "New Zealand (+64)" },
  { value: "+65", label: "Singapore (+65)" },
  { value: "+66", label: "Thailand (+66)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+82", label: "South Korea (+82)" },
  { value: "+84", label: "Vietnam (+84)" },
  { value: "+86", label: "China (+86)" },
  { value: "+90", label: "Turkey (+90)" },
  { value: "+91", label: "India (+91)" },
  { value: "+92", label: "Pakistan (+92)" },
  { value: "+93", label: "Afghanistan (+93)" },
  { value: "+94", label: "Sri Lanka (+94)" },
  { value: "+95", label: "Myanmar (+95)" },
  { value: "+98", label: "Iran (+98)" },
  { value: "+212", label: "Morocco (+212)" },
  { value: "+213", label: "Algeria (+213)" },
  { value: "+216", label: "Tunisia (+216)" },
  { value: "+218", label: "Libya (+218)" },
  { value: "+220", label: "Gambia (+220)" },
  { value: "+221", label: "Senegal (+221)" },
  { value: "+222", label: "Mauritania (+222)" },
  { value: "+223", label: "Mali (+223)" },
  { value: "+224", label: "Guinea (+224)" },
  { value: "+225", label: "Ivory Coast (+225)" },
  { value: "+226", label: "Burkina Faso (+226)" },
  { value: "+227", label: "Niger (+227)" },
  { value: "+228", label: "Togo (+228)" },
  { value: "+229", label: "Benin (+229)" },
  { value: "+230", label: "Mauritius (+230)" },
  { value: "+231", label: "Liberia (+231)" },
  { value: "+232", label: "Sierra Leone (+232)" },
  { value: "+233", label: "Ghana (+233)" },
  { value: "+234", label: "Nigeria (+234)" },
  { value: "+235", label: "Chad (+235)" },
  { value: "+236", label: "Central African Republic (+236)" },
  { value: "+237", label: "Cameroon (+237)" },
  { value: "+238", label: "Cape Verde (+238)" },
  { value: "+239", label: "São Tomé and Príncipe (+239)" },
  { value: "+240", label: "Equatorial Guinea (+240)" },
  { value: "+241", label: "Gabon (+241)" },
  { value: "+242", label: "Republic of the Congo (+242)" },
  { value: "+243", label: "DR Congo (+243)" },
  { value: "+244", label: "Angola (+244)" },
  { value: "+245", label: "Guinea-Bissau (+245)" },
  { value: "+250", label: "Rwanda (+250)" },
  { value: "+251", label: "Ethiopia (+251)" },
  { value: "+252", label: "Somalia (+252)" },
  { value: "+253", label: "Djibouti (+253)" },
  { value: "+254", label: "Kenya (+254)" },
  { value: "+255", label: "Tanzania (+255)" },
  { value: "+256", label: "Uganda (+256)" },
  { value: "+257", label: "Burundi (+257)" },
  { value: "+258", label: "Mozambique (+258)" },
  { value: "+260", label: "Zambia (+260)" },
  { value: "+261", label: "Madagascar (+261)" },
  { value: "+262", label: "Réunion (+262)" },
  { value: "+263", label: "Zimbabwe (+263)" },
  { value: "+264", label: "Namibia (+264)" },
  { value: "+265", label: "Malawi (+265)" },
  { value: "+266", label: "Lesotho (+266)" },
  { value: "+267", label: "Botswana (+267)" },
  { value: "+268", label: "Eswatini (+268)" },
  { value: "+269", label: "Comoros (+269)" },
  { value: "+297", label: "Aruba (+297)" },
  { value: "+351", label: "Portugal (+351)" },
  { value: "+352", label: "Luxembourg (+352)" },
  { value: "+353", label: "Ireland (+353)" },
  { value: "+354", label: "Iceland (+354)" },
  { value: "+355", label: "Albania (+355)" },
  { value: "+356", label: "Malta (+356)" },
  { value: "+357", label: "Cyprus (+357)" },
  { value: "+358", label: "Finland (+358)" },
  { value: "+359", label: "Bulgaria (+359)" },
  { value: "+370", label: "Lithuania (+370)" },
  { value: "+371", label: "Latvia (+371)" },
  { value: "+372", label: "Estonia (+372)" },
  { value: "+373", label: "Moldova (+373)" },
  { value: "+374", label: "Armenia (+374)" },
  { value: "+375", label: "Belarus (+375)" },
  { value: "+376", label: "Andorra (+376)" },
  { value: "+377", label: "Monaco (+377)" },
  { value: "+378", label: "San Marino (+378)" },
  { value: "+380", label: "Ukraine (+380)" },
  { value: "+381", label: "Serbia (+381)" },
  { value: "+382", label: "Montenegro (+382)" },
  { value: "+385", label: "Croatia (+385)" },
  { value: "+386", label: "Slovenia (+386)" },
  { value: "+387", label: "Bosnia and Herzegovina (+387)" },
  { value: "+389", label: "North Macedonia (+389)" },
  { value: "+420", label: "Czech Republic (+420)" },
  { value: "+421", label: "Slovakia (+421)" },
  { value: "+423", label: "Liechtenstein (+423)" },
  { value: "+500", label: "Falkland Islands (+500)" },
  { value: "+501", label: "Belize (+501)" },
  { value: "+502", label: "Guatemala (+502)" },
  { value: "+503", label: "El Salvador (+503)" },
  { value: "+504", label: "Honduras (+504)" },
  { value: "+505", label: "Nicaragua (+505)" },
  { value: "+506", label: "Costa Rica (+506)" },
  { value: "+507", label: "Panama (+507)" },
  { value: "+509", label: "Haiti (+509)" },
  { value: "+590", label: "Guadeloupe (+590)" },
  { value: "+591", label: "Bolivia (+591)" },
  { value: "+592", label: "Guyana (+592)" },
  { value: "+593", label: "Ecuador (+593)" },
  { value: "+595", label: "Paraguay (+595)" },
  { value: "+597", label: "Suriname (+597)" },
  { value: "+598", label: "Uruguay (+598)" },
  { value: "+599", label: "Curaçao/Netherlands Antilles (+599)" },
  { value: "+670", label: "East Timor (+670)" },
  { value: "+673", label: "Brunei (+673)" },
  { value: "+674", label: "Nauru (+674)" },
  { value: "+675", label: "Papua New Guinea (+675)" },
  { value: "+676", label: "Tonga (+676)" },
  { value: "+677", label: "Solomon Islands (+677)" },
  { value: "+678", label: "Vanuatu (+678)" },
  { value: "+679", label: "Fiji (+679)" },
  { value: "+680", label: "Palau (+680)" },
  { value: "+682", label: "Cook Islands (+682)" },
  { value: "+685", label: "Samoa (+685)" },
  { value: "+686", label: "Kiribati (+686)" },
  { value: "+691", label: "Micronesia (+691)" },
  { value: "+692", label: "Marshall Islands (+692)" },
  { value: "+850", label: "North Korea (+850)" },
  { value: "+852", label: "Hong Kong (+852)" },
  { value: "+853", label: "Macau (+853)" },
  { value: "+855", label: "Cambodia (+855)" },
  { value: "+856", label: "Laos (+856)" },
  { value: "+880", label: "Bangladesh (+880)" },
  { value: "+886", label: "Taiwan (+886)" },
  { value: "+960", label: "Maldives (+960)" },
  { value: "+961", label: "Lebanon (+961)" },
  { value: "+962", label: "Jordan (+962)" },
  { value: "+963", label: "Syria (+963)" },
  { value: "+964", label: "Iraq (+964)" },
  { value: "+965", label: "Kuwait (+965)" },
  { value: "+966", label: "Saudi Arabia (+966)" },
  { value: "+967", label: "Yemen (+967)" },
  { value: "+968", label: "Oman (+968)" },
  { value: "+970", label: "Palestinian Territories (+970)" },
  { value: "+971", label: "United Arab Emirates (+971)" },
  { value: "+972", label: "Israel (+972)" },
  { value: "+973", label: "Bahrain (+973)" },
  { value: "+974", label: "Qatar (+974)" },
  { value: "+975", label: "Bhutan (+975)" },
  { value: "+976", label: "Mongolia (+976)" },
  { value: "+977", label: "Nepal (+977)" },
  { value: "+992", label: "Tajikistan (+992)" },
  { value: "+993", label: "Turkmenistan (+993)" },
  { value: "+994", label: "Azerbaijan (+994)" },
  { value: "+995", label: "Georgia (+995)" },
  { value: "+996", label: "Kyrgyzstan (+996)" },
  { value: "+998", label: "Uzbekistan (+998)" },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+1",
      phone: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false,
      captcha: false,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setRegistrationError("");
    setIsSubmitting(true);
    
    try {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        countryCode: values.countryCode,
        phone: values.phone,
        password: values.password
      };
      
      await register(userData);
      
      // Show loading animation
      setIsLoading(true);
      setStatusText("Creating your account...");
      
      // Simulate loading process
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Redirect to verification page
            navigate("/verify");
            return 100;
          }
          
          const newProgress = prev + 10;
          
          if (newProgress === 30) {
            setStatusText("Setting up your profile...");
          } else if (newProgress === 60) {
            setStatusText("Almost there...");
          } else if (newProgress >= 90) {
            setStatusText("Preparing verification process...");
          }
          
          return newProgress;
        });
      }, 300);
    } catch (error: any) {
      setIsSubmitting(false);
      setRegistrationError(error.message || "Registration failed. Please try again.");
    }
  }

  // Show loading screen if isLoading is true
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex items-baseline">
              <span className="text-[#7C3AED] font-bold text-3xl">Q</span>
              <span className="text-black font-bold text-3xl">uantis</span>
              <span className="text-[#7C3AED] font-bold text-xl translate-y-[-8px] ml-[1px]">
                FX
              </span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Setting Up Your Account</h1>
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
    );
  }

  return (
    <div className="py-16 md:py-20 bg-gray-50 overflow-hidden min-h-screen">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="flex items-baseline">
              <span className="text-[#7C3AED] font-bold text-3xl">Q</span>
              <span className="text-black font-bold text-3xl">uantis</span>
              <span className="text-[#7C3AED] font-bold text-xl translate-y-[-8px] ml-[1px]">
                FX
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Quantis FX and start trading on global markets
          </p>
        </div>

        {registrationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-6 text-sm">
            {registrationError}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" className="h-10 text-sm" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" className="h-10 text-sm" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

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

              {/* Phone Number with Country Code */}
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Country Code</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {countryCodes.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234567890" 
                          className="h-10 text-sm" 
                          {...field}
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
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
                    <p className="text-xs text-gray-500 mt-1">
                      8-30 characters, one uppercase letter, one lowercase letter, and at least one special character.
                    </p>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showConfirmPassword ? "text" : "password"}
                          className="h-10 pr-10 text-sm"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED]"
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="text-xs font-normal text-gray-700">
                        I agree to the{" "}
                        <a href="#" className="text-[#7C3AED] hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-[#7C3AED] hover:underline">
                          Privacy Policy
                        </a>
                      </FormLabel>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              {/* "I am not a robot" checkbox */}
              <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED]"
                      />
                    </FormControl>
                    <div className="flex flex-row justify-between w-full items-center">
                      <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                        I am not a robot
                      </FormLabel>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white border border-gray-200 rounded-sm flex items-center justify-center">
                          <img 
                            src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                            alt="reCAPTCHA"
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-10 text-sm rounded-lg mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-[#7C3AED] hover:underline">
              Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
