
import { AuthService } from './api';
import { User } from '../types/user.types';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/types/api.types';

export const useAuthHelpers = (navigate?: (path: string, options?: any) => void) => {
  const { toast } = useToast();
  
  const register = async (userData: any) => {
    try {
      const response = await AuthService.register(userData);
      
      // Only store token, not user data yet (since email not verified)
      localStorage.setItem('token', response.token);
      
      // Store partial user data
      const partialUserData = {
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        isVerified: false,
        countryCode: userData.countryCode || '',
        phone: userData.phone || ''
      };
      
      localStorage.setItem('user', JSON.stringify(partialUserData));
      
      toast({
        title: "Registration successful",
        description: "Please check your email for verification code",
        variant: "default",
      });
      
      // Navigate to verification page with state if navigate function is provided
      if (navigate) {
        navigate("/verify", { state: { fromRegistration: true } });
      }
      
      // Return the user data for redirection to verification
      return partialUserData;
    } catch (error: any) {
      const apiError = error as ApiError;
      toast({
        title: "Registration failed",
        description: apiError.response?.data?.error || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password });
      
      // Store both token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast({
        title: "Login successful",
        description: "Welcome back to Quantis FX",
        variant: "default",
      });
      
      // Redirect to dashboard if navigate function is provided
      if (navigate) {
        navigate("/dashboard");
      }
      
      return response.data;
    } catch (error: any) {
      const apiError = error as ApiError;
      toast({
        title: "Login failed",
        description: apiError.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Notify backend about logout (optional, depending on backend implementation)
    try {
      AuthService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default",
    });
    
    // Redirect to login page if navigate function is provided
    if (navigate) {
      navigate('/login');
    }
  };
  
  return { register, login, logout };
};
