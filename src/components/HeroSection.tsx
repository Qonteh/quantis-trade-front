
import React from 'react';
import { ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative pt-24 bg-gradient-to-br from-quantis-dark to-[#2a314a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-quantis-purple">Trade</span> global markets with 
              <span className="text-quantis-purple"> Quantis</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mt-4 max-w-lg">
              Access over 10,000 instruments across forex, stocks, commodities, and cryptocurrencies with tight spreads and low commissions.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Button className="bg-quantis-purple hover:bg-quantis-secondary text-white px-8 py-6 text-lg">
                Open Account
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Try Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="pt-8 flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-quantis-purple" />
                <span>Regulated Broker</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-quantis-purple" />
                <span>Fast Execution</span>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-quantis-purple/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-quantis-blue/20 rounded-full filter blur-3xl"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl animate-float">
              <h3 className="text-white text-xl font-semibold mb-4">Market Overview</h3>
              <div className="space-y-4">
                {[
                  { name: "EUR/USD", value: "1.0934", change: "+0.12%" },
                  { name: "Gold", value: "2,325.50", change: "+0.65%" },
                  { name: "NASDAQ", value: "16,742.30", change: "-0.21%" },
                  { name: "Bitcoin", value: "62,845.20", change: "+1.32%" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white/90">{item.name}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-white font-medium">{item.value}</span>
                      <span className={`text-xs ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
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
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default HeroSection;
