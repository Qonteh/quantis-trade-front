
import React from 'react';
import { Check, X, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Feature = ({ included, text }: { included: boolean; text: string }) => (
  <div className="flex items-center py-2.5">
    {included ? 
      <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <Check className="h-3 w-3 text-green-600" />
      </div> : 
      <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <X className="h-3 w-3 text-red-600" />
      </div>
    }
    <span className="text-gray-700">{text}</span>
  </div>
);

const AccountTypes = () => {
  const accounts = [
    {
      name: "Standard",
      description: "Perfect for beginners",
      minDeposit: "$100",
      spread: "from 1.6 pips",
      commission: "$0",
      leverage: "up to 1:500",
      platforms: ["MT5", "Mobile App"],
      features: [
        { text: "24/5 Customer Support", included: true },
        { text: "Market Execution", included: true },
        { text: "Educational Resources", included: true },
        { text: "Premium Signals", included: false },
        { text: "Dedicated Account Manager", included: false },
      ],
      color: "bg-white",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Premium",
      description: "For active traders",
      minDeposit: "$1,000",
      spread: "from 0.9 pips",
      commission: "$5 per lot",
      leverage: "up to 1:500",
      platforms: ["MT5", "Mobile App", "Web Platform"],
      features: [
        { text: "24/5 Customer Support", included: true },
        { text: "Market Execution", included: true },
        { text: "Educational Resources", included: true },
        { text: "Premium Signals", included: true },
        { text: "Dedicated Account Manager", included: false },
      ],
      color: "card-gradient",
      buttonVariant: "default",
      popular: true
    },
    {
      name: "VIP",
      description: "For professional traders",
      minDeposit: "$10,000",
      spread: "from 0.6 pips",
      commission: "$3 per lot",
      leverage: "up to 1:500",
      platforms: ["MT5", "Mobile App", "Web Platform"],
      features: [
        { text: "24/5 Customer Support", included: true },
        { text: "Market Execution", included: true },
        { text: "Educational Resources", included: true },
        { text: "Premium Signals", included: true },
        { text: "Dedicated Account Manager", included: true },
      ],
      color: "bg-white",
      buttonVariant: "outline",
      popular: false
    },
  ];

  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute -left-40 top-0 w-80 h-80 bg-quantis-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-40 bottom-0 w-80 h-80 bg-quantis-blue/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block py-1.5 px-3 rounded-full bg-quantis-purple/10 text-quantis-purple font-medium text-sm mb-4">
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
            <span className="text-quantis-purple">Account</span> Types
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the account that best suits your trading style and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
          {accounts.map((account, index) => (
            <div 
              key={index} 
              className={`relative rounded-2xl shadow-lg overflow-hidden transition-transform hover:transform hover:scale-[1.02] ${account.popular ? 'ring-2 ring-quantis-purple' : ''}`}
            >
              {account.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-quantis-orange text-white text-xs font-semibold py-1.5 px-3 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className={`${account.color} p-8`}>
                <h3 className={`text-2xl font-bold ${account.color === 'card-gradient' ? 'text-white' : 'text-gray-900'} font-display`}>
                  {account.name}
                </h3>
                <p className={`mt-2 ${account.color === 'card-gradient' ? 'text-white/90' : 'text-gray-600'}`}>
                  {account.description}
                </p>
                <div className="mt-6">
                  <div className={`text-3xl font-bold ${account.color === 'card-gradient' ? 'text-white' : 'text-gray-900'}`}>
                    {account.minDeposit}
                  </div>
                  <p className={`text-sm ${account.color === 'card-gradient' ? 'text-white/80' : 'text-gray-600'}`}>
                    Minimum Deposit
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-8">
                <div className="space-y-5">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Spread</div>
                    <div className="font-semibold text-gray-900">{account.spread}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Commission</div>
                    <div className="font-semibold text-gray-900">{account.commission}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Leverage</div>
                    <div className="font-semibold text-gray-900">{account.leverage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Platforms</div>
                    <div className="font-semibold text-gray-900">{account.platforms.join(", ")}</div>
                  </div>
                  
                  <hr className="my-6" />
                  
                  <div className="space-y-1">
                    {account.features.map((feature, i) => (
                      <Feature key={i} included={feature.included} text={feature.text} />
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant={account.buttonVariant === 'default' ? 'default' : 'outline'}
                  className={`w-full mt-8 flex items-center justify-center ${
                    account.buttonVariant === 'default' 
                      ? 'bg-quantis-purple hover:bg-quantis-secondary text-white' 
                      : 'border-quantis-purple text-quantis-purple hover:bg-quantis-purple hover:text-white'
                  }`}
                >
                  Open {account.name} Account <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountTypes;
