
import { AuthService } from './api';
import { User } from '../types/user.types';
import { useToast } from '@/hooks/use-toast';

export const useAuthHelpers = () => {
  const { toast } = useToast();
  
  const register = async (userData: any) => {
    try {
      const response = await AuthService.register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast({
        title: "Registration successful",
        description: "Please check your email for verification code",
        variant: "default",
      });
      
      return response.data;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.error || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Quantis FX",
        variant: "default",
      });
      
      return response.data;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const logout = () => {
    AuthService.logout();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default",
    });
    
    // Redirect to login page or home
    window.location.href = '/';
  };
  
  return { register, login, logout };
};
