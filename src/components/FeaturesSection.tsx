
import React from 'react';
import { 
  ChartBar, 
  Wallet, 
  Shield, 
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="h-12 w-12 bg-quantis-purple/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-quantis-purple" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: ChartBar,
      title: "Advanced Trading Tools",
      description: "Access cutting-edge analysis tools, indicators, and real-time charts to make informed trading decisions."
    },
    {
      icon: Wallet,
      title: "Competitive Spreads",
      description: "Trade with some of the lowest spreads in the industry, optimizing your trading costs and potential profits."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your funds are protected with bank-level security and segregated accounts for peace of mind."
    },
    {
      icon: Smartphone,
      title: "Mobile Trading",
      description: "Trade anytime and anywhere with our powerful mobile platforms for iOS and Android devices."
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Trade with <span className="text-quantis-purple">Quantis</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Experience superior trading conditions backed by advanced technology and exceptional support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button className="bg-quantis-purple hover:bg-quantis-secondary text-white px-8 py-6">
            Explore All Features <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
