import React from "react"
import { BarChartIcon as ChartBar, Wallet, Shield, ArrowRight, Clock, Users, Check, Signal, UserCog, Bot, BarChart4, Globe, BookOpen, HeadphonesIcon, Smartphone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  iconColor = "text-purple-600",
  iconBg = "bg-purple-100",
}: {
  icon: React.ElementType
  title: string
  description: string
  iconColor?: string
  iconBg?: string
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all p-8 group">
      <div
        className={`h-14 w-14 ${iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:bg-opacity-70 transition-colors`}
      >
        <Icon className={`h-7 w-7 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

const AccountFeatureCard = ({
  icon: Icon,
  title,
  minDeposit,
  keyFeature,
  benefits,
  color,
  buttonText,
  accountType,
}: {
  icon: React.ElementType
  title: string
  minDeposit: string
  keyFeature: string
  benefits: string[]
  color: string
  buttonText: string
  accountType: string
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-${color}-200 hover:shadow-xl transition-all overflow-hidden`}
    >
      <div className={`bg-${color}-50 p-6 border-b border-${color}-100`}>
        <div className="flex items-center mb-4">
          <div className={`h-12 w-12 bg-${color}-100 rounded-xl flex items-center justify-center mr-4`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className={`text-${color}-600 font-medium`}>{keyFeature}</p>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">{minDeposit}</span>
          <span className="text-gray-500 ml-2">min deposit</span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3 mb-6">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-1 h-5 w-5 bg-${color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                <Check className={`h-3 w-3 text-${color}-600`} />
              </div>
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
        <Link to={`/register?account=${accountType}`}>
          <Button
            className={`w-full bg-${color}-600 hover:bg-${color}-700 text-white flex items-center justify-center`}
          >
            {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

const FeaturesSection = () => {
  const tradingFeatures = [
    {
      icon: ChartBar,
      title: "Advanced Trading Tools",
      description:
        "Access cutting-edge analysis tools, indicators, and real-time charts to make informed trading decisions.",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      icon: Wallet,
      title: "Competitive Spreads",
      description:
        "Trade with some of the lowest spreads in the industry, optimizing your trading costs and potential profits.",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your funds are protected with bank-level security and segregated accounts for peace of mind.",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      icon: Clock,
      title: "24/7 Market Access",
      description: "Trade cryptocurrencies around the clock and access other markets during their trading hours.",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
  ]

  const accountTypes = [
    {
      icon: Signal,
      title: "Standard Account",
      minDeposit: "$10",
      keyFeature: "Premium Signals Included",
      benefits: [
        "Access to all markets",
        "Premium trading signals",
        "Basic charting tools",
        "Standard spreads from 1.6 pips",
        "24/5 customer support",
      ],
      color: "blue",
      buttonText: "Open Standard Account",
      accountType: "standard",
    },
    {
      icon: UserCog,
      title: "Premium Account",
      minDeposit: "$100",
      keyFeature: "Dedicated Account Manager",
      benefits: [
        "All Standard features",
        "Dedicated account manager",
        "Lower spreads from 0.9 pips",
        "Advanced charting tools",
        "Priority customer support",
      ],
      color: "purple",
      buttonText: "Open Premium Account",
      accountType: "premium",
    },
    {
      icon: Bot,
      title: "VIP Account",
      minDeposit: "$1,000",
      keyFeature: "Automated Expert Advisor",
      benefits: [
        "All Premium features",
        "Automated Expert Advisor",
        "Lowest spreads from 0.6 pips",
        "VIP market analysis",
        "Personalized trading strategy",
      ],
      color: "amber",
      buttonText: "Open VIP Account",
      accountType: "vip",
    },
  ]

  const whyChooseUs = [
    {
      icon: Globe,
      text: "Regulated and licensed broker with global presence",
    },
    {
      icon: BarChart4,
      text: "Fast and reliable trade execution with no requotes",
    },
    {
      icon: BookOpen,
      text: "Comprehensive educational resources for all levels",
    },
    {
      icon: HeadphonesIcon,
      text: "Professional customer support in multiple languages",
    },
    {
      icon: Shield,
      text: "Secure deposit and withdrawal methods",
    },
    {
      icon: Users,
      text: "Customizable trading conditions for all account types",
    },
  ]

  return (
    <div className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Trading Features Section */}
        <div className="text-center mb-16">
          <div className="inline-block py-1.5 px-3 rounded-full bg-purple-100 text-purple-700 font-medium text-sm mb-4">
            Our Advantages
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
            Why Trade with <span className="text-purple-700">Quantis</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Experience superior trading conditions backed by advanced technology and exceptional support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tradingFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
              iconBg={feature.iconBg}
            />
          ))}
        </div>

        {/* Account Types Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-block py-1.5 px-3 rounded-full bg-purple-100 text-purple-700 font-medium text-sm mb-4">
              Account Types
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
              Choose Your <span className="text-purple-700">Trading Account</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Select the account that matches your trading style and goals, with flexible options for every level of
              trader.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accountTypes.map((account, index) => (
              <AccountFeatureCard
                key={index}
                icon={account.icon}
                title={account.title}
                minDeposit={account.minDeposit}
                keyFeature={account.keyFeature}
                benefits={account.benefits}
                color={account.color}
                buttonText={account.buttonText}
                accountType={account.accountType}
              />
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-block py-1.5 px-3 rounded-full bg-purple-100 text-purple-700 font-medium text-sm mb-4">
              Why Choose Us
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-display mb-6">
              The Quantis <span className="text-purple-700">Advantage</span>
            </h2>

            <p className="text-gray-600 mb-8">
              At Quantis, we combine innovative technology with deep market expertise to deliver an exceptional trading
              experience. We're committed to providing the tools, resources, and support you need to succeed in the
              global financial markets.
            </p>

            <div className="space-y-4">
              {whyChooseUs.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="pt-1">
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/register">
              <Button className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl">
                Open Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute w-full h-full bg-purple-500/5 rounded-3xl -rotate-6 transform"></div>
            <div className="absolute w-full h-full bg-blue-500/5 rounded-3xl rotate-3 transform"></div>
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Trading Platform"
              className="rounded-2xl shadow-lg relative z-10"
            />
          </div>
        </div>

        {/* Mobile App Coming Soon */}
        <div className="mt-32 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-10 lg:p-12">
              <div className="inline-block py-1 px-3 rounded-full bg-white/20 text-white font-medium text-sm mb-6">
                Coming Soon
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Mobile Trading App</h3>
              <p className="text-white/80 mb-6">
                Trade on the go with our powerful mobile application. Stay connected to the markets and manage your
                portfolio from anywhere in the world.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white/90">Real-time price alerts</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white/90">Advanced charting</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white/90">One-click trading</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white/90">Secure login</span>
                </div>
              </div>
              <Button className="bg-white text-purple-700 hover:bg-white/90 flex items-center">
                <Smartphone className="mr-2 h-4 w-4" />
                Get Notified
              </Button>
            </div>
            <div className="hidden lg:block relative h-full">
              <img
                src="https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Mobile Trading"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-purple-800/40"></div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <Link to="/register">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl">
              Start Trading Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection

