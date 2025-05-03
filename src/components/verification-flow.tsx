
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/UserContext";

const VerificationFlow = () => {
  const navigate = useNavigate();
  const { user, verifyEmail, resendVerification } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "resent">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      navigate("/login");
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
      setTimeout(() => {
        // Redirect to login page instead of dashboard
        navigate("/login");
      }, 2000);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 font-display">Email Verification</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to <span className="font-medium">{user.email}</span>
          </p>
        </div>

        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">Email verified successfully! Redirecting to dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        {status === "resent" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-sm text-blue-700">A new verification code has been sent to your email.</p>
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit verification code we sent to your email.
              </p>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] h-10 text-white text-sm rounded-lg"
                disabled={isSubmitting || !verificationCode.trim()}
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
                    disabled={isResending}
                  >
                    {isResending ? "Sending..." : "Resend Code"}
                  </button>
                )}
              </p>
            </div>
          </form>
        </div>

        <div className="text-center">
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
