
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ArrowUpRight } from 'lucide-react';

const InstrumentCard = ({ name, spread, margin, hours, trending = false }: { name: string; spread: string; margin: string; hours: string; trending?: boolean }) => {
  return (
    <div className={`bg-white p-8 rounded-2xl border ${trending ? 'border-quantis-purple/30' : 'border-gray-100'} hover:border-quantis-purple/30 transition-all relative group`}>
      {trending && (
        <div className="absolute top-4 right-4 bg-quantis-purple/10 text-quantis-purple text-xs font-medium py-1 px-2 rounded-full">
          Popular
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-6 group-hover:text-quantis-purple transition-colors">{name}</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Spread from</span>
          <span className="font-semibold text-gray-900">{spread}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Margin from</span>
          <span className="font-semibold text-gray-900">{margin}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Trading hours</span>
          <span className="font-semibold text-gray-900">{hours}</span>
        </div>
      </div>
      <Button variant="outline" className="w-full mt-6 border-quantis-purple text-quantis-purple hover:bg-quantis-purple hover:text-white group-hover:bg-quantis-purple group-hover:text-white transition-colors">
        Trade Now <ArrowUpRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

const TradingInstruments = () => {
  const forexInstruments = [
    { name: "EUR/USD", spread: "0.9 pips", margin: "3.33%", hours: "24/5", trending: true },
    { name: "GBP/USD", spread: "1.2 pips", margin: "3.33%", hours: "24/5" },
    { name: "USD/JPY", spread: "1.0 pips", margin: "3.33%", hours: "24/5" },
    { name: "AUD/USD", spread: "1.3 pips", margin: "3.33%", hours: "24/5" },
  ];

  const stocksInstruments = [
    { name: "Apple (AAPL)", spread: "0.10%", margin: "20%", hours: "Market Hours", trending: true },
    { name: "Tesla (TSLA)", spread: "0.15%", margin: "20%", hours: "Market Hours" },
    { name: "Amazon (AMZN)", spread: "0.12%", margin: "20%", hours: "Market Hours" },
    { name: "Microsoft (MSFT)", spread: "0.10%", margin: "20%", hours: "Market Hours" },
  ];

  const commoditiesInstruments = [
    { name: "Gold (XAU/USD)", spread: "0.3 pips", margin: "5%", hours: "24/5", trending: true },
    { name: "Silver (XAG/USD)", spread: "0.3 pips", margin: "5%", hours: "24/5" },
    { name: "Crude Oil (WTI)", spread: "3.0 pips", margin: "10%", hours: "24/5" },
    { name: "Natural Gas", spread: "3.0 pips", margin: "10%", hours: "24/5" },
  ];

  const cryptoInstruments = [
    { name: "Bitcoin (BTC/USD)", spread: "30 pips", margin: "50%", hours: "24/7", trending: true },
    { name: "Ethereum (ETH/USD)", spread: "25 pips", margin: "50%", hours: "24/7" },
    { name: "Ripple (XRP/USD)", spread: "1.2 pips", margin: "50%", hours: "24/7" },
    { name: "Cardano (ADA/USD)", spread: "0.8 pips", margin: "50%", hours: "24/7" },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block py-1.5 px-3 rounded-full bg-quantis-purple/10 text-quantis-purple font-medium text-sm mb-4">
            Markets
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
            Trade Popular <span className="text-quantis-purple">Instruments</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Access global markets and trade thousands of instruments with competitive conditions.
          </p>
        </div>

        <Tabs defaultValue="forex" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12 bg-gray-100/70 p-1 rounded-lg max-w-lg mx-auto">
            <TabsTrigger value="forex" className="data-[state=active]:bg-white data-[state=active]:text-quantis-purple data-[state=active]:shadow-sm rounded-md py-2.5">Forex</TabsTrigger>
            <TabsTrigger value="stocks" className="data-[state=active]:bg-white data-[state=active]:text-quantis-purple data-[state=active]:shadow-sm rounded-md py-2.5">Stocks</TabsTrigger>
            <TabsTrigger value="commodities" className="data-[state=active]:bg-white data-[state=active]:text-quantis-purple data-[state=active]:shadow-sm rounded-md py-2.5">Commodities</TabsTrigger>
            <TabsTrigger value="crypto" className="data-[state=active]:bg-white data-[state=active]:text-quantis-purple data-[state=active]:shadow-sm rounded-md py-2.5">Crypto</TabsTrigger>
          </TabsList>

          <TabsContent value="forex" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {forexInstruments.map((instrument, index) => (
                <InstrumentCard
                  key={index}
                  name={instrument.name}
                  spread={instrument.spread}
                  margin={instrument.margin}
                  hours={instrument.hours}
                  trending={instrument.trending}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stocks" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stocksInstruments.map((instrument, index) => (
                <InstrumentCard
                  key={index}
                  name={instrument.name}
                  spread={instrument.spread}
                  margin={instrument.margin}
                  hours={instrument.hours}
                  trending={instrument.trending}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commodities" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {commoditiesInstruments.map((instrument, index) => (
                <InstrumentCard
                  key={index}
                  name={instrument.name}
                  spread={instrument.spread}
                  margin={instrument.margin}
                  hours={instrument.hours}
                  trending={instrument.trending}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cryptoInstruments.map((instrument, index) => (
                <InstrumentCard
                  key={index}
                  name={instrument.name}
                  spread={instrument.spread}
                  margin={instrument.margin}
                  hours={instrument.hours}
                  trending={instrument.trending}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 text-center">
          <Button className="bg-quantis-purple hover:bg-quantis-secondary text-white px-6 py-3 rounded-xl">
            View All Instruments <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradingInstruments;
