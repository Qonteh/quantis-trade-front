
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { Progress } from "@/components/ui/progress";

// All nationalities in the world
const nationalities = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguan and Barbudan", "Argentine", "Armenian", 
  "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Belarusian", "Belgian", 
  "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian and Herzegovinian", "Botswanan", "Brazilian", "British", 
  "Bruneian", "Bulgarian", "Burkinabé", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", 
  "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese (Congo Republic)", 
  "Congolese (DRC)", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djiboutian", "Dominican (Dominica)", 
  "Dominican (Dominican Republic)", "Dutch", "East Timorese", "Ecuadorian", "Egyptian", "Emirati", "Equatorial Guinean", 
  "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", 
  "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinean", "Guinea-Bissauan", "Guyanese", "Haitian", 
  "Honduran", "Hungarian", "Icelandic", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", 
  "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kiribati", "Kuwaiti", "Kyrgyz", "Laotian", 
  "Latvian", "Lebanese", "Lesothan", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourgish", "Macedonian", 
  "Malagasy", "Malawian", "Malaysian", "Maldivian", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", 
  "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Montenegrin", "Moroccan", "Mozambican", "Myanma", 
  "Namibian", "Nauruan", "Nepalese", "New Zealand", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Norwegian", 
  "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", 
  "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Kitts and Nevis", "Saint Lucian", 
  "Saint Vincent and the Grenadines", "Samoan", "San Marinese", "São Tomé and Príncipe", "Saudi", "Senegalese", "Serbian", 
  "Seychellois", "Sierra Leonean", "Singaporean", "Slovak", "Slovenian", "Solomon Islander", "Somali", "South African", 
  "South Korean", "South Sudanese", "Spanish", "Sri Lankan", "Sudanese", "Surinamese", "Swazi", "Swedish", "Swiss", 
  "Syrian", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian and Tobagonian", "Tunisian", "Turkish", 
  "Turkmen", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbek", "Vanuatuan", "Vatican", "Venezuelan", "Vietnamese", 
  "Yemeni", "Zambian", "Zimbabwean"
];

const VerificationFlow = () => {
  const navigate = useNavigate();
  const { user, verifyEmail, resendVerification, updateProfile } = useAuth();
  
  // Email verification state
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "resent">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  
  // Personal info verification state
  const [currentStep, setCurrentStep] = useState<"email" | "personal">("email");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isSubmittingPersonalInfo, setIsSubmittingPersonalInfo] = useState(false);
  const [personalInfoStatus, setPersonalInfoStatus] = useState<"idle" | "success" | "error">("idle");

  // Overall completion status
  const [emailVerified, setEmailVerified] = useState(user?.isVerified || false);
  const [personalInfoVerified, setPersonalInfoVerified] = useState(false);

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      navigate("/login");
    }
    
    // Check if user is already verified
    if (user?.isVerified) {
      setEmailVerified(true);
    }
  }, [user, navigate]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !verificationCode.trim()) return;
    
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");
    
    try {
      await verifyEmail(user.id, verificationCode);
      setStatus("success");
      setEmailVerified(true);
      
      setTimeout(() => {
        setCurrentStep("personal");
      }, 1500);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Invalid verification code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    setStatus("idle");
    setErrorMessage("");
    
    try {
      await resendVerification(user.email);
      setStatus("resent");
      setCountdown(60); // 60 seconds cooldown
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to resend verification code");
    } finally {
      setIsResending(false);
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !dateOfBirth || !nationality || !address || !city) return;
    
    setIsSubmittingPersonalInfo(true);
    setPersonalInfoStatus("idle");
    
    try {
      // Update user profile with personal information
      await updateProfile({
        id: user.id,
        dateOfBirth,
        nationality,
        address,
        city
      });
      
      setPersonalInfoStatus("success");
      setPersonalInfoVerified(true);
      
      setTimeout(() => {
        // After both steps are completed, redirect to login page
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setPersonalInfoStatus("error");
    } finally {
      setIsSubmittingPersonalInfo(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#7C3AED]" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-xl mx-auto">
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
          <h2 className="text-2xl font-bold text-gray-900 font-display">Verification Process</h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete the following steps to verify your account
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${emailVerified ? "bg-green-50 border-green-500" : "border-gray-300"}`}>
                {emailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-sm font-medium">1</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Verify Email</span>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${personalInfoVerified ? "bg-green-50 border-green-500" : "border-gray-300"}`}>
                {personalInfoVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-sm font-medium">2</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">Personal Info</span>
            </div>
          </div>
          <Progress value={emailVerified ? (personalInfoVerified ? 100 : 50) : 0} className="h-2" />
        </div>

        {/* Email Verification Step */}
        {currentStep === "email" && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Email Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a verification code to <span className="font-medium">{user.email}</span>
            </p>

            {status === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-green-700">Email verified successfully!</p>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {status === "resent" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                <p className="text-sm text-blue-700">A new verification code has been sent to your email.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="h-10 text-sm"
                  required
                  disabled={emailVerified}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the 6-digit verification code we sent to your email.
                </p>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-10 text-white text-sm rounded-lg"
                  disabled={isSubmitting || !verificationCode.trim() || emailVerified}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Didn't receive a code?{" "}
                  {countdown > 0 ? (
                    <span className="text-gray-400">
                      Resend in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-[#7C3AED] hover:underline font-medium"
                      disabled={isResending || emailVerified}
                    >
                      {isResending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Personal Info Verification Step */}
        {currentStep === "personal" && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide your personal information to complete the verification.
            </p>

            {personalInfoStatus === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-green-700">Personal information verified successfully! Redirecting to login...</p>
              </div>
            )}

            {personalInfoStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-4">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">Failed to verify personal information. Please try again.</p>
              </div>
            )}

            <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-10 text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <Select value={nationality} onValueChange={setNationality} required>
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {nationalities.map((nat) => (
                      <SelectItem key={nat} value={nat}>
                        {nat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="h-10 text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                  className="h-10 text-sm"
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-10 text-white text-sm rounded-lg"
                  disabled={isSubmittingPersonalInfo}
                >
                  {isSubmittingPersonalInfo ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Personal Information"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationFlow;
