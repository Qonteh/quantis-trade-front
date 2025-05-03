import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/UserContext";

const VerificationFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, verifyEmail } = useAuth();

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
      
      // Wait a moment and then redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Invalid verification code");
    } finally {
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
      setStep(3); // Move to completion step
      
      // Wait a moment and then redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError("Failed to submit personal information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verify Your Email</CardTitle>
              <CardDescription>
                Please enter the verification code sent to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCode} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button disabled={loading} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>
                Please provide some personal information to complete your
                registration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPersonalInfo} className="space-y-4">
                <div>
                  <Input type="text" placeholder="Full Name" required />
                </div>
                <div>
                  <Input type="date" placeholder="Date of Birth" required />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button disabled={loading} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Complete</CardTitle>
              <CardDescription>
                Thank you for verifying your email and providing your
                information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You will be redirected to the dashboard shortly...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VerificationFlow;
