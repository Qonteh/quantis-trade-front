
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  isVerified: boolean;
  role: string;
  walletBalance: number;
  demoBalance: number;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (userData: any) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  verifyEmail: (userId: string, code: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  updateProfile: (userData: any) => Promise<any>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
    
    // If user is logged in, fetch the latest user data
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const response = await AuthService.getCurrentUser();
          if (response.data) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          // If token is invalid or expired, logout
          logout();
        }
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Register user
  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await AuthService.register(userData);
      setUser(response.data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast({
        title: "Registration successful",
        description: "Please check your email for verification code",
        variant: "default",
      });
      
      setLoading(false);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Registration failed",
        description: error.response?.data?.error || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Login user
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      setUser(response.data);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Quantis FX",
        variant: "default",
      });
      
      setLoading(false);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Login failed",
        description: error.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Logout user
  const logout = () => {
    AuthService.logout();
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default",
    });
    
    // Redirect to login page or home
    window.location.href = '/';
  };
  
  // Verify email
  const verifyEmail = async (userId: string, code: string) => {
    try {
      const response = await AuthService.verifyEmail(userId, code);
      
      // Update the user's verified status
      setUser(prevUser => {
        if (prevUser) {
          const updatedUser = { ...prevUser, isVerified: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        }
        return prevUser;
      });
      
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified",
        variant: "default",
      });
      
      return response;
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.response?.data?.error || "Invalid verification code",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Resend verification code
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
      toast({
        title: "Failed to resend code",
        description: error.response?.data?.error || "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Update profile
  const updateProfile = async (userData: any) => {
    try {
      const response = await AuthService.updateProfile(userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
        variant: "default",
      });
      
      return response.data;
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.response?.data?.error || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout,
        verifyEmail,
        resendVerification,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};
