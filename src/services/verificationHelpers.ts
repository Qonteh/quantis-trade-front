
import { AuthService } from './api';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/types/api.types';

export const useVerificationHelpers = () => {
  const { toast } = useToast();

  const verifyEmail = async (userId: string, code: string) => {
    try {
      const response = await AuthService.verifyEmail(userId, code);
      
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified",
        variant: "default",
      });
      
      return response;
    } catch (error: any) {
      const apiError = error as ApiError;
      toast({
        title: "Verification failed",
        description: apiError.response?.data?.error || "Invalid verification code",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const resendVerification = async (email: string) => {
    try {
      const response = await AuthService.resendVerification(email);
      
      toast({
        title: "Verification code sent",
        description: "Please check your email for the new verification code",
        variant: "default",
      });
      
      return response;
    } catch (error: any) {
      const apiError = error as ApiError;
      toast({
        title: "Failed to resend code",
        description: apiError.response?.data?.error || "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const updateProfile = async (userData: any) => {
    try {
      const response = await AuthService.updateProfile(userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
        variant: "default",
      });
      
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      toast({
        title: "Update failed",
        description: apiError.response?.data?.error || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return { verifyEmail, resendVerification, updateProfile };
};
