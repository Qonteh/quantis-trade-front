
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { User } from '@/types/user.types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import api from '@/services/api';

interface VerificationStatusPanelProps {
  user: User | null;
}

const VerificationStatusPanel: React.FC<VerificationStatusPanelProps> = ({ 
  user
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState({
    profile: user?.isVerified || false,
    document: false,
    percentage: user?.isVerified ? 50 : 0
  });

  useEffect(() => {
    // Set verification status based on user data from context
    if (user) {
      setVerificationStatus({
        profile: user.isVerified || false,
        document: false, // This would come from backend - we'll assume false for now
        percentage: calculatePercentage(user.isVerified || false, false)
      });
      setIsLoading(false);
    }
  }, [user]);

  // Calculate verification percentage based on completed steps
  const calculatePercentage = (isProfileVerified: boolean, isDocumentVerified: boolean): number => {
    let completed = 0;
    const totalSteps = 2;
    
    if (isProfileVerified) completed++;
    if (isDocumentVerified) completed++;
    
    return (completed / totalSteps) * 100;
  };

  const handleCompleteVerification = () => {
    setIsNavigating(true);
    
    toast({
      title: "Redirecting to verification",
      description: "Please complete your identity verification to unlock all features.",
    });
    
    // Simulate loading before redirecting
    setTimeout(() => {
      navigate('/verify');
      setIsNavigating(false);
    }, 500);
  };

  const handleDeposit = () => {
    setIsNavigating(true);
    
    toast({
      title: "Redirecting to deposit page",
      description: "You're being redirected to the deposit page to fund your account.",
    });
    
    // Simulate loading before redirecting
    setTimeout(() => {
      navigate('/deposit');
      setIsNavigating(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Verification Status Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-5">
          <CardTitle className="text-lg">Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="text-amber-700 font-medium text-sm">
              {verificationStatus.percentage === 100 ? 'Advanced Level' : 'Basic Level'}
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {verificationStatus.percentage === 100 
              ? 'Full account access' 
              : 'Limited account access'}
          </p>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Verification Progress</span>
              <span className="text-xs font-medium text-gray-700">{verificationStatus.percentage}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div 
                className="h-1.5 bg-amber-400 rounded-full transition-all duration-500" 
                style={{ width: `${verificationStatus.percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              {verificationStatus.profile ? (
                <div className="mr-2 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-green-600" strokeWidth={3} />
                </div>
              ) : (
                <div className="mr-2 w-5 h-5 rounded-full border-2 border-gray-300"></div>
              )}
              <div>
                <p className="text-xs font-medium">Email Verification</p>
                <p className="text-[10px] text-gray-500">Verify your email address</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {verificationStatus.document ? (
                <div className="mr-2 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-green-600" strokeWidth={3} />
                </div>
              ) : (
                <div className="mr-2 w-5 h-5 rounded-full border-2 border-gray-300"></div>
              )}
              <div>
                <p className="text-xs font-medium">Document Verification</p>
                <p className="text-[10px] text-gray-500">Verify your identity</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleCompleteVerification}
            className="w-full text-xs bg-amber-500 hover:bg-amber-600 text-white h-8"
            disabled={isNavigating || verificationStatus.percentage === 100}
          >
            {isNavigating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting...
              </>
            ) : verificationStatus.percentage === 100 ? (
              "Fully Verified"
            ) : (
              "Complete Verification"
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Deposit Limit Card */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 pt-5">
          <CardTitle className="text-lg">Deposit Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-blue-50 border border-blue-100 p-3 flex items-start mb-4">
            <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              {verificationStatus.percentage === 100 
                ? "You have full access to all deposit features with unlimited deposit amounts."
                : "You can deposit up to $2,000 and start trading immediately. Complete verification to increase your limit."
              }
            </div>
          </div>
          
          <Button 
            onClick={handleDeposit}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs h-8"
            disabled={isNavigating}
          >
            {isNavigating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting...
              </>
            ) : (
              "Deposit Now"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationStatusPanel;
