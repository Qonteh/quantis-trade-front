
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Circle, Check } from "lucide-react";

// Sample list of countries for nationality selection
const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Spain", "Italy", "Japan", "China", "India", "Brazil",
  "Mexico", "South Africa", "Russia", "Nigeria", "Egypt", "Saudi Arabia"
  // We'd include all countries in a real implementation
];

const VerificationFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [personalInfoVerified, setPersonalInfoVerified] = useState(false);
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, verifyEmail } = useAuth();

  // For displaying a loading indicator with the brand name
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  useEffect(() => {
    // Check if we're coming from registration
    if (location.state?.fromRegistration) {
      setShowLoadingScreen(true);
      
      // Display loading screen for 2 seconds before showing verification
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!user?.id) {
      setError("User ID is missing. Please ensure you are logged in.");
      setLoading(false);
      return;
    }
    
    try {
      await verifyEmail(user.id, code);
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified",
        variant: "default",
      });
      
      setEmailVerified(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "Invalid verification code");
      setLoading(false);
    }
  };

  const handleSubmitPersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, this would submit the data to an API
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPersonalInfoVerified(true);
      setLoading(false);
      
      if (emailVerified) {
        toast({
          title: "Verification Complete",
          description: "Your account has been fully verified",
          variant: "default",
        });
        
        // Redirect to login after completing all verification steps
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError("Failed to submit personal information. Please try again.");
      setLoading(false);
    }
  };

  const renderProgressIndicator = () => {
    const totalSteps = 2;
    const completedSteps = (emailVerified ? 1 : 0) + (personalInfoVerified ? 1 : 0);
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
    
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Verification Progress</span>
          <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-[#7C3AED] rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Loading screen with brand name
  if (showLoadingScreen) {
    return (
      <div className="min-h-screen bg-[#2D1B69] flex flex-col items-center justify-center">
        <div className="flex items-baseline mb-4">
          <span className="text-[#9D6FFF] font-bold text-4xl">Q</span>
          <span className="text-white font-bold text-4xl">uantis</span>
          <span className="text-[#9D6FFF] font-bold text-xl translate-y-[-8px] ml-[1px]">
            FX
          </span>
        </div>
        <div className="mt-6">
          <div className="h-8 w-8 mx-auto animate-spin border-4 border-[#9D6FFF] border-t-white rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Account Verification</h2>
          <p className="text-gray-600 mt-1">Complete these steps to verify your account</p>
        </div>
        
        {renderProgressIndicator()}

        <div className="space-y-6">
          {/* Email Verification Section */}
          <Card className={emailVerified ? "border-green-200" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {emailVerified ? (
                    <div className="mr-2 bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 mr-2 text-gray-400" />
                  )}
                  Verify Email
                </CardTitle>
                {emailVerified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              <CardDescription>
                Enter the 6-digit code sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!emailVerified ? (
                <form onSubmit={handleSubmitCode} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="6-digit verification code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      maxLength={6}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button 
                    disabled={loading || code.length !== 6} 
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </Button>
                </form>
              ) : (
                <div className="text-green-600 text-sm">
                  Your email has been successfully verified.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Information Section */}
          <Card className={personalInfoVerified ? "border-green-200" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {personalInfoVerified ? (
                    <div className="mr-2 bg-green-100 rounded-full p-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 mr-2 text-gray-400" />
                  )}
                  Verify Personal Info
                </CardTitle>
                {personalInfoVerified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              <CardDescription>
                Please provide your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!personalInfoVerified ? (
                <form onSubmit={handleSubmitPersonalInfo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <Select value={nationality} onValueChange={setNationality} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Input
                      type="text"
                      placeholder="Your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input
                      type="text"
                      placeholder="Your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button 
                    disabled={loading || !dob || !nationality || !address || !city} 
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                  >
                    {loading ? "Submitting..." : "Verify Personal Info"}
                  </Button>
                </form>
              ) : (
                <div className="text-green-600 text-sm">
                  Your personal information has been verified.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completion message when both steps are done */}
          {emailVerified && personalInfoVerified && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-800">Verification Complete!</h3>
              <p className="text-sm text-green-600 mt-1">
                You will be redirected to the login page shortly...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationFlow;
