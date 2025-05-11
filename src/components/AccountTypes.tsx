import { Check, X, ChevronRight, Star, Bot, Signal, UserCog, Copy, Users, TrendingUp, BarChart4 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Feature = ({ included, text }: { included: boolean; text: string }) => (
  <div className="flex items-center py-2">
    {included ? (
      <div className="h-4 w-4 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
        <Check className="h-2.5 w-2.5 text-green-600" />
      </div>
    ) : (
      <div className="h-4 w-4 bg-red-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
        <X className="h-2.5 w-2.5 text-red-600" />
      </div>
    )}
    <span className="text-gray-700 text-sm">{text}</span>
  </div>
)

const AccountTypes = () => {
  const accounts = [
    {
      name: "Standard",
      description: "Perfect for beginners",
      minDeposit: "$10",
      spread: "from 1.6 pips",
      commission: "$0",
      leverage: "up to 1:500",
      platforms: ["MT5", "Web Platform"],
      icon: Signal,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
      features: [
        { text: "24/5 Customer Support", included: true },
        { text: "Market Execution", included: true },
        { text: "Educational Resources", included: true },
        { text: "Premium Signals", included: true },
        { text: "Dedicated Account Manager", included: false },
        { text: "Automated Expert Advisor", included: false },
      ],
      color: "bg-white",
      borderColor: "border-blue-200",
      buttonVariant: "outline",
      buttonColor: "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white",
      popular: false,
      highlight: "Premium Signals Included",
      type: "standard",
    },
    {
      name: "Premium",
      description: "For active traders",
      minDeposit: "$100",
      spread: "from 0.9 pips",
      commission: "$5 per lot",
      leverage: "up to 1:500",
      platforms: ["MT5", "Web Platform", "Mobile App (Coming Soon)"],
      icon: UserCog,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100",
      features: [
        { text: "24/5 Customer Support", included: true },
        { text: "Market Execution", included: true },
        { text: "Educational Resources", included: true },
        { text: "Premium Signals", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Automated Expert Advisor", included: false },
      ],
      color: "bg-gradient-to-br from-purple-600 to-purple-800",
      borderColor: "border-purple-400",
      buttonVariant: "default",
      buttonColor: "bg-white text-purple-700 hover:bg-white/90",
      popular: true,
      highlight: "Account Manager Included",
      type: "premium",
    },
    {
      name: "VIP",
      description: "For professional traders",
      minDeposit: "$1,000",
      spread: "from 0.6 pips",
      commission: "$3 per lot",
      leverage: "up to 1:500",
      platforms: ["MT5", "Web Platform", "Mobile App (Coming Soon)"],
      icon: Bot,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100",
      features: [
        { text: "24/5 Customer Support", included: true },
        { text: "Market Execution", included: true },
        { text: "Educational Resources", included: true },
        { text: "Premium Signals", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Automated Expert Advisor", included: true },
      ],
      color: "bg-white",
      borderColor: "border-amber-200",
      buttonVariant: "outline",
      buttonColor: "border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white",
      popular: false,
      highlight: "Automated Expert Advisor Included",
      type: "vip",
    },
  ]

  const copyTradingPlans = [
    {
      name: "Starter",
      description: "Begin your copy trading journey",
      minDeposit: "$100",
      fee: "20% of profits",
      managementFee: "2% monthly",
      maxDrawdown: "25%",
      platforms: ["MT5", "Web Platform"],
      icon: Copy,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100",
      features: [
        { text: "Copy up to 3 traders", included: true },
        { text: "Real-time trade copying", included: true },
        { text: "Performance analytics", included: true },
        { text: "Risk management tools", included: true },
        { text: "Priority trader selection", included: false },
        { text: "Custom risk settings", included: false },
      ],
      color: "bg-white",
      borderColor: "border-purple-200",
      buttonVariant: "outline",
      buttonColor: "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
      popular: false,
      highlight: "Perfect for Beginners",
      type: "copy-starter",
    },
    {
      name: "Advanced",
      description: "For serious copy traders",
      minDeposit: "$500",
      fee: "15% of profits",
      managementFee: "1.5% monthly",
      maxDrawdown: "20%",
      platforms: ["MT5", "Web Platform", "Mobile App (Coming Soon)"],
      icon: Users,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100",
      features: [
        { text: "Copy up to 10 traders", included: true },
        { text: "Real-time trade copying", included: true },
        { text: "Performance analytics", included: true },
        { text: "Risk management tools", included: true },
        { text: "Priority trader selection", included: true },
        { text: "Custom risk settings", included: false },
      ],
      color: "bg-gradient-to-br from-purple-600 to-purple-800",
      borderColor: "border-purple-400",
      buttonVariant: "default",
      buttonColor: "bg-white text-purple-700 hover:bg-white/90",
      popular: true,
      highlight: "Most Popular Choice",
      type: "copy-advanced",
    },
    {
      name: "Professional",
      description: "Maximum copy trading potential",
      minDeposit: "$2,000",
      fee: "10% of profits",
      managementFee: "1% monthly",
      maxDrawdown: "15%",
      platforms: ["MT5", "Web Platform", "Mobile App (Coming Soon)"],
      icon: TrendingUp,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100",
      features: [
        { text: "Unlimited trader copying", included: true },
        { text: "Real-time trade copying", included: true },
        { text: "Performance analytics", included: true },
        { text: "Risk management tools", included: true },
        { text: "Priority trader selection", included: true },
        { text: "Custom risk settings", included: true },
      ],
      color: "bg-white",
      borderColor: "border-purple-200",
      buttonVariant: "outline",
      buttonColor: "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
      popular: false,
      highlight: "Full Customization",
      type: "copy-professional",
    },
  ]

  const topTraders = [
    {
      name: "AlphaTrader",
      winRate: "76%",
      monthlyReturn: "+12.4%",
      followers: "1,245",
      style: "Swing",
      instruments: ["Forex", "Indices"],
      drawdown: "14%",
    },
    {
      name: "FXMaster",
      winRate: "68%",
      monthlyReturn: "+9.7%",
      followers: "876",
      style: "Day Trading",
      instruments: ["Forex", "Commodities"],
      drawdown: "18%",
    },
    {
      name: "TechTrader",
      winRate: "72%",
      monthlyReturn: "+11.2%",
      followers: "1,032",
      style: "Position",
      instruments: ["Stocks", "Crypto"],
      drawdown: "16%",
    },
    {
      name: "GoldHunter",
      winRate: "65%",
      monthlyReturn: "+8.5%",
      followers: "754",
      style: "Scalping",
      instruments: ["Commodities", "Forex"],
      drawdown: "20%",
    },
  ]

  return (
    <div className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute -left-40 top-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-40 bottom-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Tabs defaultValue="accounts" id="account-tabs" className="w-full">
          <div className="text-center mb-6">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-gray-100 p-1 text-gray-500 mb-6">
              <TabsTrigger
                value="accounts"
                className="rounded-full px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm"
              >
                Trading Accounts
              </TabsTrigger>
              <TabsTrigger
                value="copytrading"
                id="copytrading-tab"
                className="rounded-full px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm"
              >
                Copy Trading
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="accounts" className="mt-0">
            <div className="text-center mb-12">
              <div className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 font-medium text-xs mb-3">
                Account Types
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
                Choose Your <span className="text-purple-700">Trading Account</span>
              </h2>
              <p className="mt-3 text-base text-gray-600 max-w-3xl mx-auto">
                Select the account that matches your trading style and goals, with flexible options for every level of
                trader.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
              {accounts.map((account, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl border ${account.borderColor} ${
                    account.popular ? "ring-2 ring-purple-500 ring-offset-2" : ""
                  }`}
                >
                  {account.popular && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-semibold py-1 px-2 rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="h-2.5 w-2.5 fill-white" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className={`${account.color} p-6 relative overflow-hidden`}>
                    {/* Background decoration for premium card */}
                    {account.popular && (
                      <>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                      </>
                    )}

                    <div className="flex items-center mb-3">
                      <div
                        className={`h-10 w-10 ${account.iconBg} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}
                      >
                        <account.icon className={`h-5 w-5 ${account.iconColor}`} />
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold ${
                            account.color.includes("from-purple") ? "text-white" : "text-gray-900"
                          } font-display`}
                        >
                          {account.name}
                        </h3>
                        <p
                          className={`mt-0.5 text-sm ${account.color.includes("from-purple") ? "text-white/90" : "text-gray-600"}`}
                        >
                          {account.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-4 p-2.5 rounded-lg ${
                        account.color.includes("from-purple") ? "bg-white/10" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`text-2xl font-bold ${
                          account.color.includes("from-purple") ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {account.minDeposit}
                      </div>
                      <p
                        className={`text-xs ${account.color.includes("from-purple") ? "text-white/80" : "text-gray-600"}`}
                      >
                        Minimum Deposit
                      </p>
                    </div>

                    <div
                      className={`mt-3 inline-block py-0.5 px-2 rounded-md text-xs font-medium ${
                        account.color.includes("from-purple")
                          ? "bg-white/20 text-white"
                          : `bg-${account.iconColor.split("-")[1]}-100 ${account.iconColor}`
                      }`}
                    >
                      {account.highlight}
                    </div>
                  </div>

                  <div className="bg-white p-6">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Spread</div>
                        <div className="font-semibold text-sm text-gray-900">{account.spread}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Commission</div>
                        <div className="font-semibold text-sm text-gray-900">{account.commission}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Leverage</div>
                        <div className="font-semibold text-sm text-gray-900">{account.leverage}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Execution</div>
                        <div className="font-semibold text-sm text-gray-900">Market</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1.5">Platforms</div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {account.platforms.map((platform, i) => (
                          <span
                            key={i}
                            className={`text-xs py-0.5 px-1.5 rounded-full ${
                              platform.includes("Coming")
                                ? "bg-gray-100 text-gray-600"
                                : `bg-${account.iconColor.split("-")[1]}-50 ${account.iconColor}`
                            }`}
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="space-y-0.5">
                      {account.features.map((feature, i) => (
                        <Feature key={i} included={feature.included} text={feature.text} />
                      ))}
                    </div>

                    <Link to={`/register?account=${account.type}`}>
                      <Button
                        variant={account.buttonVariant === "default" ? "default" : "outline"}
                        className={`w-full mt-6 flex items-center justify-center py-4 text-sm ${account.buttonColor}`}
                      >
                        Open {account.name} Account <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Account Comparison</h3>
                <p className="text-sm text-gray-600">Detailed comparison of our trading accounts</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Features</th>
                      <th className="py-3 px-4 text-center text-xs text-blue-600 font-medium">Standard</th>
                      <th className="py-3 px-4 text-center text-xs text-purple-600 font-medium">Premium</th>
                      <th className="py-3 px-4 text-center text-xs text-amber-600 font-medium">VIP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Min Deposit</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$10</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$100</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$1,000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Spread</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">from 1.6 pips</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">from 0.9 pips</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">from 0.6 pips</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Commission</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$0</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$5 per lot</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$3 per lot</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Leverage</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">up to 1:500</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">up to 1:500</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">up to 1:500</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Premium Signals</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Account Manager</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Automated Expert Advisor</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="copytrading" className="mt-0">
            <div id="copy-trading" className="scroll-mt-24 text-center mb-12">
              <div className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 font-medium text-xs mb-3">
                Copy Trading
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
                QuantisFx <span className="text-purple-700">Copy Trading</span> Service
              </h2>
              <p className="mt-3 text-base text-gray-600 max-w-3xl mx-auto">
                Automatically copy the trades of successful traders and benefit from their expertise without having to
                analyze the markets yourself.
              </p>
            </div>

            {/* Hero section with image */}
            <div className="relative rounded-xl overflow-hidden mb-12 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-600/90 mix-blend-multiply"></div>
              <div className="h-80 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-3xl mx-auto px-6 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Trade Like a Pro, Even If You're a Beginner
                  </h3>
                  <p className="text-white/90 text-sm md:text-base mb-6">
                    Our copy trading service connects you with expert traders, allowing you to automatically replicate
                    their successful strategies in your own account.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white text-center">
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-xs text-white/80">Success Rate</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white text-center">
                      <div className="text-2xl font-bold">5,000+</div>
                      <div className="text-xs text-white/80">Active Copiers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white text-center">
                      <div className="text-2xl font-bold">$12M+</div>
                      <div className="text-xs text-white/80">Monthly Volume</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <BarChart4 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">How Copy Trading Works</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    QuantisFx Copy Trading allows you to automatically replicate the trades of experienced and
                    successful traders in real-time. When they trade, you trade - it's that simple.
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5">
                    <li>Choose from our carefully vetted selection of top-performing traders</li>
                    <li>Set your risk parameters and investment amount</li>
                    <li>Our system automatically copies their trades to your account</li>
                    <li>Monitor performance and adjust your portfolio as needed</li>
                    <li>Earn profits while learning from professional trading strategies</li>
                  </ol>
                  <p className="font-medium text-purple-700">
                    Perfect for beginners looking to learn, busy professionals without time to trade, or experienced
                    traders diversifying their strategy.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Top Performing Traders</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {topTraders.map((trader, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="font-bold text-sm text-gray-900 mb-1.5">{trader.name}</div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                          <div>
                            <span className="text-gray-500">Win Rate:</span>
                            <div className="font-medium text-gray-900">{trader.winRate}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Monthly:</span>
                            <div className="font-medium text-green-600">{trader.monthlyReturn}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Style:</span>
                            <div className="font-medium text-gray-900">{trader.style}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Drawdown:</span>
                            <div className="font-medium text-gray-900">{trader.drawdown}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link to="/copy-trading/traders">
                      <Button
                        variant="outline"
                        className="mt-3 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white text-sm py-2"
                      >
                        View All Traders <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-12 bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">What Our Clients Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 relative">
                  <div className="absolute -top-3 left-5 h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-lg font-bold">"</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 mt-1">
                    I've been using QuantisFx copy trading for 6 months and my portfolio has grown by 32%. The platform
                    is intuitive and the trader selection is excellent.
                  </p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">Sarah K.</div>
                      <div className="text-xs text-gray-500">Retail Investor</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 relative">
                  <div className="absolute -top-3 left-5 h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-lg font-bold">"</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 mt-1">
                    As a busy professional, I don't have time to analyze markets. Copy trading with QuantisFx has been a
                    game-changer for my investment strategy.
                  </p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">Michael T.</div>
                      <div className="text-xs text-gray-500">Business Owner</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 relative">
                  <div className="absolute -top-3 left-5 h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-lg font-bold">"</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 mt-1">
                    The risk management tools are fantastic. I can set exactly how much I want to risk and the system
                    takes care of the rest. Highly recommended!
                  </p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">David R.</div>
                      <div className="text-xs text-gray-500">Financial Analyst</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
              {copyTradingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl border ${plan.borderColor} ${
                    plan.popular ? "ring-2 ring-purple-500 ring-offset-2" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-semibold py-1 px-2 rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="h-2.5 w-2.5 fill-white" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className={`${plan.color} p-6 relative overflow-hidden`}>
                    {/* Background decoration for premium card */}
                    {plan.popular && (
                      <>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                      </>
                    )}

                    <div className="flex items-center mb-3">
                      <div
                        className={`h-10 w-10 ${plan.iconBg} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}
                      >
                        <plan.icon className={`h-5 w-5 ${plan.iconColor}`} />
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold ${
                            plan.color.includes("from-purple") ? "text-white" : "text-gray-900"
                          } font-display`}
                        >
                          {plan.name}
                        </h3>
                        <p
                          className={`mt-0.5 text-sm ${plan.color.includes("from-purple") ? "text-white/90" : "text-gray-600"}`}
                        >
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-4 p-2.5 rounded-lg ${
                        plan.color.includes("from-purple") ? "bg-white/10" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`text-2xl font-bold ${
                          plan.color.includes("from-purple") ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {plan.minDeposit}
                      </div>
                      <p
                        className={`text-xs ${plan.color.includes("from-purple") ? "text-white/80" : "text-gray-600"}`}
                      >
                        Minimum Deposit
                      </p>
                    </div>

                    <div
                      className={`mt-3 inline-block py-0.5 px-2 rounded-md text-xs font-medium ${
                        plan.color.includes("from-purple")
                          ? "bg-white/20 text-white"
                          : `bg-${plan.iconColor.split("-")[1]}-100 ${plan.iconColor}`
                      }`}
                    >
                      {plan.highlight}
                    </div>
                  </div>

                  <div className="bg-white p-6">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Success Fee</div>
                        <div className="font-semibold text-sm text-gray-900">{plan.fee}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Management Fee</div>
                        <div className="font-semibold text-sm text-gray-900">{plan.managementFee}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Max Drawdown</div>
                        <div className="font-semibold text-sm text-gray-900">{plan.maxDrawdown}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500 mb-0.5">Copy Speed</div>
                        <div className="font-semibold text-sm text-gray-900">Real-time</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1.5">Platforms</div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {plan.platforms.map((platform, i) => (
                          <span
                            key={i}
                            className={`text-xs py-0.5 px-1.5 rounded-full ${
                              platform.includes("Coming") ? "bg-gray-100 text-gray-600" : `bg-purple-50 text-purple-600`
                            }`}
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="space-y-0.5">
                      {plan.features.map((feature, i) => (
                        <Feature key={i} included={feature.included} text={feature.text} />
                      ))}
                    </div>

                    <Link to={`/register?account=${plan.type}`}>
                      <Button
                        variant={plan.buttonVariant === "default" ? "default" : "outline"}
                        className={`w-full mt-6 flex items-center justify-center py-4 text-sm ${plan.buttonColor}`}
                      >
                        Start Copy Trading <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Copy Trading Comparison table */}
            <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Copy Trading Plan Comparison</h3>
                <p className="text-sm text-gray-600">Detailed comparison of our copy trading plans</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-xs text-gray-500 font-medium">Features</th>
                      <th className="py-3 px-4 text-center text-xs text-purple-600 font-medium">Starter</th>
                      <th className="py-3 px-4 text-center text-xs text-purple-600 font-medium">Advanced</th>
                      <th className="py-3 px-4 text-center text-xs text-purple-600 font-medium">Professional</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Min Deposit</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$100</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$500</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">$2,000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Success Fee</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">20% of profits</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">15% of profits</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">10% of profits</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Management Fee</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">2% monthly</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">1.5% monthly</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">1% monthly</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Max Traders to Copy</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">3</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">10</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">Unlimited</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Priority Trader Selection</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">Custom Risk Settings</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-purple-700 to-purple-900 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-10 md:py-12 text-center">
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Copy Trading?</h3>
                <p className="text-white/90 text-sm mb-6 max-w-2xl mx-auto">
                  Join thousands of traders who are already benefiting from our copy trading service. Get started today
                  with just a few clicks.
                </p>
                <Link to="/register?service=copy-trading">
                  <Button className="bg-white text-purple-700 hover:bg-white/90 py-4 px-6 text-sm font-medium">
                    Create Your Copy Trading Account <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Frequently Asked Questions</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-gray-900">What is copy trading?</h4>
                  <p className="text-xs text-gray-700">
                    Copy trading is a form of automated trading that allows you to automatically copy the trades of
                    experienced traders. When they open or close a position, the same action is replicated in your
                    account proportionally to your investment.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-gray-900">How do I choose which traders to copy?</h4>
                  <p className="text-xs text-gray-700">
                    You can browse our selection of verified traders, review their performance statistics, trading
                    style, and risk level. Choose traders whose strategy aligns with your investment goals.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-gray-900">Can I modify or stop copied trades?</h4>
                  <p className="text-xs text-gray-700">
                    Yes, you have full control over your copy trading account. You can stop copying a trader at any
                    time, adjust your investment amount, or set specific risk parameters.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-gray-900">What are the fees for copy trading?</h4>
                  <p className="text-xs text-gray-700">
                    Our copy trading service charges a success fee on profits generated and a small monthly management
                    fee. The exact rates depend on your chosen plan, with better rates for higher-tier plans.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AccountTypes
