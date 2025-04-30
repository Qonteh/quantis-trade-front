
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';
import { useAuthHelpers } from '../services/authHelpers';
import { useVerificationHelpers } from '../services/verificationHelpers';
import { User, UserContextType } from '../types/user.types';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { register: authRegister, login: authLogin, logout } = useAuthHelpers();
  const { verifyEmail: verifyUserEmail, resendVerification, updateProfile: updateUserProfile } = useVerificationHelpers();
  
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
  
  const register = async (userData: any) => {
    setLoading(true);
    try {
      const registeredUser = await authRegister(userData);
      setUser(registeredUser);
      setLoading(false);
      return registeredUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await authLogin(email, password);
      setUser(loggedInUser);
      setLoading(false);
      return loggedInUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  
  const verifyEmail = async (userId: string, code: string) => {
    try {
      const response = await verifyUserEmail(userId, code);
      
      // Update the user's verified status
      setUser(prevUser => {
        if (prevUser) {
          const updatedUser = { ...prevUser, isVerified: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        }
        return prevUser;
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  const updateProfile = async (userData: any) => {
    try {
      const updatedUser = await updateUserProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
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
