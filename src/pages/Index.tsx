
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TradingInstruments from '@/components/TradingInstruments';
import AccountTypes from '@/components/AccountTypes';
import TestimonialsSection from '@/components/Testimonials';
import MobileAppCTA from '@/components/MobileAppCTA';
import RegisterForm from '@/components/RegisterForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TradingInstruments />
      <AccountTypes />
      <TestimonialsSection />
      <MobileAppCTA />
      <RegisterForm />
      <Footer />
    </div>
  );
};

export default Index;
