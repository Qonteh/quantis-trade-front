import React from 'react';
import { 
  ChartBar, 
  Wallet, 
  Shield, 
  Smartphone,
  ArrowRight,
  Clock,
  Users,
  Check
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all p-8 group">
      <div className="h-14 w-14 bg-quantis-purple/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-quantis-purple/20 transition-colors">
        <Icon className="h-7 w-7 text-quantis-purple" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
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
      icon: Clock,
      title: "24/7 Market Access",
      description: "Trade cryptocurrencies around the clock and access other markets during their trading hours."
    }
  ];

  const whyChooseUs = [
    "Regulated and licensed broker with global presence",
    "Fast and reliable trade execution with no requotes",
    "Comprehensive educational resources for all levels",
    "Professional customer support in multiple languages",
    "Secure deposit and withdrawal methods",
    "Customizable trading conditions for all account types"
  ];

  return (
    <div className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-quantis-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-quantis-blue/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block py-1.5 px-3 rounded-full bg-quantis-purple/10 text-quantis-purple font-medium text-sm mb-4">
            Our Advantages
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
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

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-block py-1.5 px-3 rounded-full bg-quantis-purple/10 text-quantis-purple font-medium text-sm mb-4">
              Why Choose Us
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-display mb-6">
              The Quantis <span className="text-quantis-purple">Advantage</span>
            </h2>
            
            <p className="text-gray-600 mb-8">
              At Quantis, we combine innovative technology with deep market expertise to deliver an exceptional trading experience. We're committed to providing the tools, resources, and support you need to succeed in the global financial markets.
            </p>
            
            <div className="space-y-3">
              {whyChooseUs.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 bg-quantis-purple/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-quantis-purple" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            
            <Button className="mt-8 bg-quantis-purple hover:bg-quantis-secondary text-white px-6 py-2.5 rounded-xl">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="absolute w-full h-full bg-quantis-purple/5 rounded-3xl -rotate-6 transform"></div>
            <div className="absolute w-full h-full bg-quantis-blue/5 rounded-3xl rotate-3 transform"></div>
            <img 
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Trading Platform" 
              className="rounded-2xl shadow-lg relative z-10"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button className="bg-quantis-purple hover:bg-quantis-secondary text-white px-8 py-6 text-lg rounded-xl">
            Explore All Features <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;