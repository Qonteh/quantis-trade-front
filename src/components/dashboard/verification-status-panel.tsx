
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { User } from '@/types/user.types';

interface VerificationStatusPanelProps {
  user: User | null;
  navigate: (path: string) => void;
}

const VerificationStatusPanel: React.FC<VerificationStatusPanelProps> = ({ 
  user,
  navigate
}) => {
  const [verificationStatus, setVerificationStatus] = useState({
    profile: user?.isVerified || false,
    document: false,
    percentage: user?.isVerified ? 50 : 0
  });

  const handleCompleteVerification = () => {
    navigate('/verify');
  };

  const handleDeposit = () => {
    navigate('/deposit');
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
            <div className="text-amber-700 font-medium text-sm">Basic Level</div>
          </div>
          <p className="text-xs text-gray-500 mb-3">Limited account access</p>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Verification Progress</span>
              <span className="text-xs font-medium text-gray-700">{verificationStatus.percentage}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full">
              <div 
                className="h-1.5 bg-amber-400 rounded-full" 
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
          >
            Complete Verification
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
              You can deposit up to $2,000 and start trading immediately. Complete verification to increase your limit.
            </div>
          </div>
          
          <Button 
            onClick={handleDeposit}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs h-8"
          >
            Deposit Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationStatusPanel;
