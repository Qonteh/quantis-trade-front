
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VerificationFlow  from "./components/verification-flow";
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

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/verification" element={<VerificationFlow />} />
            <Route path="/Login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/refer" element={<ReferPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
