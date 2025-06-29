
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VerificationFlow from "./components/verification-flow";
import LoginForm from "./components/ui/login-form";
import RegisterForm from "./components/RegisterForm";
import DepositPage from "./components/deposit-page";
import DashboardPage from "./components/dashboard-page";
import WithdrawPage from "./components/withdraw-page";
import WalletPage from "./components/wallet-page";
import PlatformPage from "./components/platform-page";
import ReferPage from "./components/refer-page";
import TransferPage from "./components/transfer-page";
import AdminDashboard from "./components/admin-dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Modified protected route wrapper - always allows access in demo mode
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  // For demo purposes, we'll create a token if none exists
  if (!token) {
    localStorage.setItem("token", "demo-token-for-frontend-only");
    localStorage.setItem("user", JSON.stringify({
      id: "demo-user",
      firstName: "Demo",
      lastName: "User",
      email: "demo@quantis.com",
      isVerified: true
    }));
  }
  
  return <>{children}</>;
};

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Check if user is admin (you can modify this logic)
  if (user.role !== 'admin' && user.email !== 'admin@quantis.com') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              {/* Verification route */}
              <Route path="/verify" element={<VerificationFlow />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              
              {/* Protected routes - all accessible in demo mode */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/deposit" element={
                <ProtectedRoute>
                  <DepositPage />
                </ProtectedRoute>
              } />
              <Route path="/withdraw" element={
                <ProtectedRoute>
                  <WithdrawPage />
                </ProtectedRoute>
              } />
              <Route path="/wallet" element={
                <ProtectedRoute>
                  <WalletPage />
                </ProtectedRoute>
              } />
              <Route path="/platform" element={
                <ProtectedRoute>
                  <PlatformPage />
                </ProtectedRoute>
              } />
              <Route path="/refer" element={
                <ProtectedRoute>
                  <ReferPage />
                </ProtectedRoute>
              } />
              <Route path="/transfer" element={
                <ProtectedRoute>
                  <TransferPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
