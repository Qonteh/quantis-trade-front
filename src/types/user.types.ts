
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  isVerified: boolean;
  isDocumentVerified?: boolean;
  role: string;
  walletBalance: number;
  demoBalance: number;
  avatarUrl?: string;
  leverage: string;
  accountType: string;
  lastLogin?: Date;
  joinDate?: string;
  accountStatus?: 'active' | 'pending' | 'suspended';
  tradingServer?: string;
  mt4Accounts?: MTAccount[];
  mt5Accounts?: MTAccount[];
}

interface MTAccount {
  accountId: string;
  password?: string;
  investorPassword?: string;
  server: string;
  type: string; // demo or live
  balance: number;
  leverage: string;
  accountType: string;
  isActive: boolean;
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

interface WalletBalance {
  walletBalance: number;
  demoBalance: number;
}

interface Transaction {
  id: number;
  userId: number;
  type: string;
  amount: number;
  status: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  relatedUserId?: number;
  metadata?: string;
}

interface AccountDetails {
  leverage: string;
  accountType: string;
  tradingServer: string;
  walletBalance: number;
  demoBalance: number;
}

interface MTServerStatus {
  server: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  message?: string;
}
