
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Circle, Check, Upload, X, User, File, FileText, IdCard } from "lucide-react";
import Logo from "./ui/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample list of countries for nationality selection
const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Spain", "Italy", "Japan", "China", "India", "Brazil",
  "Mexico", "South Africa", "Russia", "Nigeria", "Egypt", "Saudi Arabia"
  // We'd include all countries in a real implementation
];

// Document types
const documentTypes = [
  { id: "passport", name: "Passport" },
  { id: "driving_license", name: "Driving License" },
  { id: "national_id", name: "National ID Card" },
  { id: "residence_permit", name: "Residence Permit" }
];

const VerificationFlow: React.FC = () => {
  const location = useLocation();
  // Check if we should start at the documents tab based on state
  const initialTab = location.state?.activeTab || "email";
  
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [personalInfoVerified, setPersonalInfoVerified] = useState(false);
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string>("passport");
  const [frontDocument, setFrontDocument] = useState<File | null>(null);
  const [backDocument, setBackDocument] = useState<File | null>(null);
  const [selfieDocument, setSelfieDocument] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, verifyEmail } = useAuth();

  // For displaying a loading indicator with the brand name
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  useEffect(() => {
    // Enable navigation to specific tab if coming from verification panel
    if (initialTab === "documents") {
      // If we're jumping directly to documents tab, assume previous steps are complete
      setEmailVerified(true);
      setPersonalInfoVerified(true);
    } 
    // Check if we're coming from registration
    else if (location.state?.fromRegistration) {
      setShowLoadingScreen(true);
      
      // Display loading screen for 2 seconds before showing verification
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [location, initialTab]);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified",
        variant: "default",
      });
      
      setEmailVerified(true);
      setLoading(false);
      setActiveTab("personal");
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
      setActiveTab("documents");
      
      toast({
        title: "Personal Information Verified",
        description: "Your personal information has been saved",
        variant: "default",
      });
    } catch (error) {
      setError("Failed to submit personal information. Please try again.");
      setLoading(false);
    }
  };
  
  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call for document upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDocumentsVerified(true);
      setLoading(false);
      
      toast({
        title: "Documents Uploaded",
        description: "Your documents have been submitted for verification",
        variant: "default",
      });
      
      // Simulate completed verification
      if (emailVerified && personalInfoVerified) {
        toast({
          title: "Verification Complete",
          description: "Your account has been fully verified",
          variant: "default",
        });
        
        // Redirect to dashboard after completing all verification steps
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setError("Failed to upload documents. Please try again.");
      setLoading(false);
    }
  };

  const renderProgressIndicator = () => {
    const totalSteps = 3;
    const completedSteps = (emailVerified ? 1 : 0) + (personalInfoVerified ? 1 : 0) + (documentsVerified ? 1 : 0);
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

  const renderVerificationStatus = () => {
    if (emailVerified && personalInfoVerified && documentsVerified) {
      return (
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-medium text-green-800">Verification Complete!</h3>
          <p className="text-sm text-green-600 mt-1">
            You will be redirected to the dashboard shortly...
          </p>
        </div>
      );
    }
    return null;
  };

  // Loading screen with brand name
  if (showLoadingScreen) {
    return (
      <div className="min-h-screen bg-[#2D1B69] flex flex-col items-center justify-center">
        <Logo darkMode={true} width={120} height={40} />
        <div className="mt-6">
          <div className="h-8 w-8 mx-auto animate-spin border-4 border-[#9D6FFF] border-t-white rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo width={120} height={40} />
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Account Verification</h2>
          <p className="text-gray-600 mt-1">Complete all verification steps to activate your account</p>
        </div>
        
        {renderProgressIndicator()}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger 
              value="email"
              disabled={activeTab !== "email" && !emailVerified}
              className={emailVerified ? "data-[state=active]:bg-green-100 data-[state=active]:text-green-800" : ""}
            >
              {emailVerified && <Check className="h-4 w-4 mr-2 text-green-600" />}
              Email Verification
            </TabsTrigger>
            <TabsTrigger 
              value="personal" 
              disabled={!emailVerified || (activeTab !== "personal" && !personalInfoVerified)}
              className={personalInfoVerified ? "data-[state=active]:bg-green-100 data-[state=active]:text-green-800" : ""}
            >
              {personalInfoVerified && <Check className="h-4 w-4 mr-2 text-green-600" />}
              Personal Info
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              disabled={(initialTab !== "documents" && !personalInfoVerified) || (activeTab !== "documents" && !documentsVerified)}
              className={documentsVerified ? "data-[state=active]:bg-green-100 data-[state=active]:text-green-800" : ""}
            >
              {documentsVerified && <Check className="h-4 w-4 mr-2 text-green-600" />}
              Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="border rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Verify Your Email</h3>
              <p className="text-gray-600 text-sm mb-4">
                We've sent a 6-digit verification code to your email address. Please enter it below to verify your account.
              </p>
              
              {!emailVerified ? (
                <form onSubmit={handleSubmitCode} className="space-y-4">
                  <div>
                    <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code
                    </label>
                    <Input
                      id="verification-code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>
                  
                  <div className="text-center text-sm text-gray-500">
                    <p>Didn't receive the code? <button type="button" className="text-[#7C3AED] hover:underline">Resend code</button></p>
                  </div>
                  
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      disabled={loading || code.length !== 6} 
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    >
                      {loading ? "Verifying..." : "Verify Email"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">Your email has been successfully verified!</p>
                  <Button 
                    className="mt-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    onClick={() => setActiveTab("personal")}
                  >
                    Continue to Personal Information
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="personal" className="border rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <p className="text-gray-600 text-sm mb-4">
                Please provide your personal details for account verification.
              </p>
              
              {!personalInfoVerified ? (
                <form onSubmit={handleSubmitPersonalInfo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <Input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <Select value={nationality} onValueChange={setNationality} required>
                        <SelectTrigger id="nationality">
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
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                        placeholder="Enter your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      disabled={loading || !dob || !nationality || !address || !city} 
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    >
                      {loading ? "Submitting..." : "Save Personal Information"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">Your personal information has been saved!</p>
                  <Button 
                    className="mt-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    onClick={() => setActiveTab("documents")}
                  >
                    Continue to Document Verification
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="border rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Document Verification</h3>
              <p className="text-gray-600 text-sm mb-4">
                Please upload clear images of your identification documents to remove the $2,000 deposit/withdrawal limit.
              </p>
              
              {!documentsVerified ? (
                <form onSubmit={handleUploadDocuments} className="space-y-6">
                  <div className="mb-4">
                    <label htmlFor="doc-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                      <SelectTrigger id="doc-type">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Front of ID Document
                      </div>
                      <div 
                        className={`border-2 border-dashed rounded-lg p-4 text-center ${
                          frontDocument ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-[#7C3AED]'
                        } transition-colors cursor-pointer`}
                        onClick={() => document.getElementById('front-doc-input')?.click()}
                      >
                        {frontDocument ? (
                          <div className="flex flex-col items-center">
                            <FileText className="h-8 w-8 text-green-500 mb-2" />
                            <p className="text-sm font-medium text-green-600">
                              {frontDocument.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {(frontDocument.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm font-medium">Upload Front Side</p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG or PDF, max 5MB
                            </p>
                          </div>
                        )}
                        <input
                          id="front-doc-input"
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => e.target.files && setFrontDocument(e.target.files[0])}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Back of ID Document
                      </div>
                      <div 
                        className={`border-2 border-dashed rounded-lg p-4 text-center ${
                          backDocument ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-[#7C3AED]'
                        } transition-colors cursor-pointer`}
                        onClick={() => document.getElementById('back-doc-input')?.click()}
                      >
                        {backDocument ? (
                          <div className="flex flex-col items-center">
                            <FileText className="h-8 w-8 text-green-500 mb-2" />
                            <p className="text-sm font-medium text-green-600">
                              {backDocument.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {(backDocument.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm font-medium">Upload Back Side</p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG or PDF, max 5MB
                            </p>
                          </div>
                        )}
                        <input
                          id="back-doc-input"
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => e.target.files && setBackDocument(e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Selfie with ID Document
                    </div>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        selfieDocument ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-[#7C3AED]'
                      } transition-colors cursor-pointer`}
                      onClick={() => document.getElementById('selfie-doc-input')?.click()}
                    >
                      {selfieDocument ? (
                        <div className="flex flex-col items-center">
                          <User className="h-8 w-8 text-green-500 mb-2" />
                          <p className="text-sm font-medium text-green-600">
                            {selfieDocument.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(selfieDocument.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <User className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm font-medium">Upload Selfie with ID</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Take a photo of yourself holding your ID document
                          </p>
                        </div>
                      )}
                      <input
                        id="selfie-doc-input"
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => e.target.files && setSelfieDocument(e.target.files[0])}
                      />
                    </div>
                  </div>
                  
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      disabled={loading || !frontDocument || !backDocument || !selfieDocument} 
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <span className="animate-spin mr-2">⏳</span> Uploading Documents...
                        </div>
                      ) : (
                        "Submit Documents"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">Your documents have been submitted!</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Our team will review your documents shortly. You will receive an email once the verification is complete.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {renderVerificationStatus()}

        <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
          <p>Need help? <a href="#" className="text-[#7C3AED] hover:underline">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default VerificationFlow;
