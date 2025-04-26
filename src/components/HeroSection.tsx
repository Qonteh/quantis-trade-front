
import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative pt-24 hero-gradient overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-quantis-purple/5 rounded-full animate-spin-slow"></div>
      <div className="absolute top-20 right-20 w-20 h-20 bg-quantis-blue/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-quantis-orange/10 rounded-full animate-bounce-subtle"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="inline-block py-1.5 px-3 rounded-full bg-white/10 backdrop-blur-sm text-quantis-purple font-medium text-sm mb-2">
              Trade with confidence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
              Trade global markets with 
              <span className="text-gradient"> Quantis</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-lg">
              Access over 10,000 instruments across forex, stocks, commodities, and cryptocurrencies with tight spreads and low commissions.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Button className="bg-quantis-purple hover:bg-quantis-secondary text-white px-8 py-6 text-lg rounded-xl">
                Open Account
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                Try Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/10 p-2">
                  <ShieldCheck className="h-4 w-4 text-quantis-purple" />
                </div>
                <span className="text-sm sm:text-base">Regulated Broker</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/10 p-2">
                  <Zap className="h-4 w-4 text-quantis-purple" />
                </div>
                <span className="text-sm sm:text-base">Fast Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/10 p-2">
                  <Clock className="h-4 w-4 text-quantis-purple" />
                </div>
                <span className="text-sm sm:text-base">24/5 Support</span>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-quantis-purple/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-quantis-blue/20 rounded-full filter blur-3xl"></div>
            <div className="relative glass backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-quantis-orange/30 rounded-full filter blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-quantis-blue/30 rounded-full filter blur-xl"></div>
              <h3 className="text-white text-xl font-semibold mb-6 flex items-center">
                <div className="h-2 w-2 rounded-full bg-quantis-green mr-2"></div>
                Market Overview
              </h3>
              <div className="space-y-6">
                {[
                  { name: "EUR/USD", value: "1.0934", change: "+0.12%", color: "green" },
                  { name: "Gold", value: "2,325.50", change: "+0.65%", color: "green" },
                  { name: "NASDAQ", value: "16,742.30", change: "-0.21%", color: "red" },
                  { name: "Bitcoin", value: "62,845.20", change: "+1.32%", color: "green" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-white/90 font-medium">{item.name}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-white font-mono font-medium">{item.value}</span>
                      <span className={`text-xs ${item.color === 'green' ? 'text-quantis-green' : 'text-quantis-red'}`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border border-white/20">
                Open Chart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white to-transparent"></div>
    </div>
  );
};

export default HeroSection;
