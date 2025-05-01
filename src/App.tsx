
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
import TradePage from "./components/trade-page";
import PlatformPage from "./components/platform-page";
import ReferPage from "./components/refer-page";
import TransferPage from "./components/transfer-page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              {/* Verification route */}
              <Route path="/verification" element={<VerificationFlow />} />
              
              {/* Protected routes */}
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
              <Route path="/trade" element={
                <ProtectedRoute>
                  <TradePage />
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
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
