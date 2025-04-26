
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Apple, Smartphone } from 'lucide-react';

const MobileAppCTA = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-quantis-dark to-quantis-purple">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative">
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-quantis-orange/20 rounded-full filter blur-xl"></div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-quantis-light/20 rounded-full filter blur-xl"></div>
              <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                <img 
                  src="https://via.placeholder.com/300x600" 
                  alt="Quantis Mobile App" 
                  className="rounded-2xl mx-auto"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>
          </div>
          
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Trade On The Go With Our <span className="text-quantis-light">Mobile App</span>
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Download our powerful mobile app and access your trading account anytime, anywhere. Monitor the markets, execute trades, and manage your portfolio with ease.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="mt-1 bg-white/20 rounded-full p-1">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Real-time Price Alerts</h3>
                  <p className="text-white/70 text-sm mt-1">Get notified when markets reach your target prices.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-white/20 rounded-full p-1">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Advanced Charts</h3>
                  <p className="text-white/70 text-sm mt-1">Perform technical analysis with multiple timeframes and indicators.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-white/20 rounded-full p-1">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Secure Biometric Login</h3>
                  <p className="text-white/70 text-sm mt-1">Access your account quickly and securely with fingerprint or face recognition.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-quantis-dark hover:bg-white/90 flex items-center justify-center">
                <Apple className="mr-2 h-5 w-5" />
                Download for iOS
              </Button>
              <Button className="bg-white text-quantis-dark hover:bg-white/90 flex items-center justify-center">
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
