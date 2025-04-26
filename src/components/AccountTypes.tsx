
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Feature = ({ included, text }: { included: boolean; text: string }) => (
  <div className="flex items-center py-2">
    {included ? 
      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> : 
      <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
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
      color: "bg-quantis-purple",
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
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-quantis-purple">Account</span> Types
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the account that best suits your trading style and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accounts.map((account, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl shadow-lg border ${account.popular ? 'border-quantis-purple' : 'border-gray-100'} overflow-hidden transition-transform hover:transform hover:scale-105`}
            >
              {account.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-quantis-orange text-white text-xs font-bold py-1 px-3 rounded-bl">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className={`${account.color} p-6`}>
                <h3 className={`text-2xl font-bold ${account.color === 'bg-quantis-purple' ? 'text-white' : 'text-gray-900'}`}>
                  {account.name}
                </h3>
                <p className={`mt-2 ${account.color === 'bg-quantis-purple' ? 'text-white/80' : 'text-gray-600'}`}>
                  {account.description}
                </p>
                <div className="mt-4">
                  <div className={`text-3xl font-bold ${account.color === 'bg-quantis-purple' ? 'text-white' : 'text-gray-900'}`}>
                    {account.minDeposit}
                  </div>
                  <p className={`text-sm ${account.color === 'bg-quantis-purple' ? 'text-white/80' : 'text-gray-600'}`}>
                    Minimum Deposit
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Spread</div>
                    <div className="font-semibold">{account.spread}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Commission</div>
                    <div className="font-semibold">{account.commission}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Leverage</div>
                    <div className="font-semibold">{account.leverage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Platforms</div>
                    <div className="font-semibold">{account.platforms.join(", ")}</div>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="space-y-1">
                    {account.features.map((feature, i) => (
                      <Feature key={i} included={feature.included} text={feature.text} />
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant={account.buttonVariant === 'default' ? 'default' : 'outline'}
                  className={`w-full mt-6 ${
                    account.buttonVariant === 'default' 
                      ? 'bg-quantis-purple hover:bg-quantis-secondary text-white' 
                      : 'border-quantis-purple text-quantis-purple hover:bg-quantis-purple hover:text-white'
                  }`}
                >
                  Open {account.name} Account
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
