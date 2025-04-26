
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Apple, Smartphone, ArrowDownToLine } from 'lucide-react';

const MobileAppCTA = () => {
  return (
    <div className="py-24 hero-gradient overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-quantis-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-quantis-blue/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative">
              <div className="absolute -left-6 top-1/4 w-40 h-40 bg-quantis-orange/20 rounded-full filter blur-2xl"></div>
              <div className="absolute -right-10 bottom-1/4 w-40 h-40 bg-quantis-light/20 rounded-full filter blur-2xl"></div>
              <div className="relative perspective-1000">
                <div className="relative transform rotate-6 hover:rotate-0 transition-transform duration-700">
                  <div className="p-4 glass backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                      alt="Quantis Mobile App" 
                      className="rounded-2xl mx-auto object-cover"
                      style={{ maxHeight: "500px" }}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-quantis-purple/30 rounded-full filter blur-xl"></div>
              </div>
            </div>
          </div>
          
          <div className="text-white">
            <div className="inline-block py-1.5 px-3 rounded-full bg-white/10 text-white font-medium text-sm mb-6">
              Mobile Trading
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">
              Trade On The Go With Our <span className="text-gradient">Mobile App</span>
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Download our powerful mobile app and access your trading account anytime, anywhere. Monitor the markets, execute trades, and manage your portfolio with ease.
            </p>
            
            <div className="mt-10 space-y-6">
              <div className="flex items-start">
                <div className="mt-1 bg-white/10 rounded-lg h-10 w-10 flex items-center justify-center">
                  <ArrowDownToLine className="h-5 w-5 text-quantis-purple" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Real-time Price Alerts</h3>
                  <p className="text-white/70 text-base mt-1">Get notified when markets reach your target prices.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-white/10 rounded-lg h-10 w-10 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-quantis-purple" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Advanced Charts</h3>
                  <p className="text-white/70 text-base mt-1">Perform technical analysis with multiple timeframes and indicators.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-white/10 rounded-lg h-10 w-10 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-quantis-purple" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Secure Biometric Login</h3>
                  <p className="text-white/70 text-base mt-1">Access your account quickly and securely with fingerprint or face recognition.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-quantis-dark hover:bg-white/90 flex items-center justify-center rounded-xl py-6 px-8">
                <Apple className="mr-2 h-5 w-5" />
                Download for iOS
              </Button>
              <Button className="bg-white text-quantis-dark hover:bg-white/90 flex items-center justify-center rounded-xl py-6 px-8">
                <Smartphone className="mr-2 h-5 w-5" />
                Download for Android
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppCTA;
