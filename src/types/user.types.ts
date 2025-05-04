
export interface User {
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
  avatarUrl?: string; // Added avatarUrl as an optional property
}

export interface UserContextType {
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
