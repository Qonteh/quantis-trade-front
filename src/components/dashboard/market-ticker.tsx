import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketPair {
  pair: string;
  price: string;
  change: string;
  previousPrice?: string;
  isUp?: boolean;
  isDown?: boolean;
}

interface MarketTickerProps {
  initialData: MarketPair[];
}

const MarketTicker: React.FC<MarketTickerProps> = ({ initialData }) => {
  const [marketData, setMarketData] = useState<MarketPair[]>(initialData);
  
  // Simulate live market data updates
  useEffect(() => {
    const updateMarketData = () => {
      const updatedData = marketData.map(item => {
        // Convert the price to a number for calculations
        const currentPrice = parseFloat(item.price.replace(/,/g, ''));
        const previousPrice = currentPrice;
        
        // Simulate a small random price change
        const randomChange = (Math.random() * 0.02) - 0.01; // between -0.01 and 0.01
        const newPrice = currentPrice * (1 + randomChange);
        
        // Calculate the percentage change
        const percentChange = ((newPrice / currentPrice) - 1) * 100;
        
        // Format the new price according to the currency
        let formattedPrice = newPrice.toFixed(4);
        if (item.pair.includes('BTC')) {
          formattedPrice = newPrice.toFixed(2);
        }
        
        return {
          ...item,
          previousPrice: item.price,
          price: formattedPrice,
          change: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`,
          isUp: percentChange > 0,
          isDown: percentChange < 0
        };
      });
      
      setMarketData(updatedData);
    };
    
    // Update every 2 seconds
    const intervalId = setInterval(updateMarketData, 2000);
    
    return () => clearInterval(intervalId);
  }, [marketData]);
  
  return (
    <div className="bg-[#2D1B69] text-white py-2 px-4 flex items-center space-x-4 overflow-auto pb-1 md:pb-0 whitespace-nowrap">
      {marketData.map((item, index) => (
        <div key={index} className="text-[10px] group cursor-pointer">
          <div className="flex items-center">
            <span className="text-white mr-1">{item.pair}</span>
            <span 
              className={`transition-colors ${
                item.isUp ? 'text-green-400' : 
                item.isDown ? 'text-red-400' : 
                'text-white'
              }`}
            >
              {item.price}
            </span>
            <span 
              className={`ml-1 flex items-center ${
                item.change.includes('-') ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {item.change.includes('-') ? 
                <TrendingDown className="w-3 h-3 mr-0.5" /> : 
                <TrendingUp className="w-3 h-3 mr-0.5" />
              }
              {item.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketTicker;