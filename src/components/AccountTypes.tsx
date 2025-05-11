import { Check, X, ChevronRight, Star, Bot, Signal, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Feature = ({ included, text }: { included: boolean; text: string }) => (
  <div className="flex items-center py-2.5">
    {included ? (
      <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <Check className="h-3 w-3 text-green-600" />
      </div>
    ) : (
      <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <X className="h-3 w-3 text-red-600" />
      </div>
    )}
    <span className="text-gray-700">{text}</span>
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

  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute -left-40 top-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-40 bottom-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block py-1.5 px-4 rounded-full bg-purple-100 text-purple-700 font-medium text-sm mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10">
          {accounts.map((account, index) => (
            <div
              key={index}
              className={`relative rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl border ${account.borderColor} ${
                account.popular ? "ring-2 ring-purple-500 ring-offset-2" : ""
              }`}
            >
              {account.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-semibold py-1.5 px-3 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="h-3 w-3 fill-white" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className={`${account.color} p-8 relative overflow-hidden`}>
                {/* Background decoration for premium card */}
                {account.popular && (
                  <>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  </>
                )}

                <div className="flex items-center mb-4">
                  <div
                    className={`h-12 w-12 ${account.iconBg} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}
                  >
                    <account.icon className={`h-6 w-6 ${account.iconColor}`} />
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-bold ${
                        account.color.includes("from-purple") ? "text-white" : "text-gray-900"
                      } font-display`}
                    >
                      {account.name}
                    </h3>
                    <p className={`mt-1 ${account.color.includes("from-purple") ? "text-white/90" : "text-gray-600"}`}>
                      {account.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-6 p-3 rounded-lg ${
                    account.color.includes("from-purple") ? "bg-white/10" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-3xl font-bold ${
                      account.color.includes("from-purple") ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {account.minDeposit}
                  </div>
                  <p className={`text-sm ${account.color.includes("from-purple") ? "text-white/80" : "text-gray-600"}`}>
                    Minimum Deposit
                  </p>
                </div>

                <div
                  className={`mt-4 inline-block py-1 px-3 rounded-lg text-xs font-medium ${
                    account.color.includes("from-purple")
                      ? "bg-white/20 text-white"
                      : `bg-${account.iconColor.split("-")[1]}-100 ${account.iconColor}`
                  }`}
                >
                  {account.highlight}
                </div>
              </div>

              <div className="bg-white p-8">
                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Spread</div>
                    <div className="font-semibold text-gray-900">{account.spread}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Commission</div>
                    <div className="font-semibold text-gray-900">{account.commission}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Leverage</div>
                    <div className="font-semibold text-gray-900">{account.leverage}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Execution</div>
                    <div className="font-semibold text-gray-900">Market</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">Platforms</div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {account.platforms.map((platform, i) => (
                      <span
                        key={i}
                        className={`text-xs py-1 px-2 rounded-full ${
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

                <hr className="my-6" />

                <div className="space-y-1">
                  {account.features.map((feature, i) => (
                    <Feature key={i} included={feature.included} text={feature.text} />
                  ))}
                </div>

                <Link to={`/register?account=${account.type}`}>
                  <Button
                    variant={account.buttonVariant === "default" ? "default" : "outline"}
                    className={`w-full mt-8 flex items-center justify-center py-6 ${account.buttonColor}`}
                  >
                    Open {account.name} Account <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Account Comparison</h3>
            <p className="text-gray-600">Detailed comparison of our trading accounts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-gray-500 font-medium">Features</th>
                  <th className="py-4 px-6 text-center text-blue-600 font-medium">Standard</th>
                  <th className="py-4 px-6 text-center text-purple-600 font-medium">Premium</th>
                  <th className="py-4 px-6 text-center text-amber-600 font-medium">VIP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="py-4 px-6 text-gray-900 font-medium">Min Deposit</td>
                  <td className="py-4 px-6 text-center text-gray-700">$10</td>
                  <td className="py-4 px-6 text-center text-gray-700">$100</td>
                  <td className="py-4 px-6 text-center text-gray-700">$1,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-medium">Spread</td>
                  <td className="py-4 px-6 text-center text-gray-700">from 1.6 pips</td>
                  <td className="py-4 px-6 text-center text-gray-700">from 0.9 pips</td>
                  <td className="py-4 px-6 text-center text-gray-700">from 0.6 pips</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-4 px-6 text-gray-900 font-medium">Commission</td>
                  <td className="py-4 px-6 text-center text-gray-700">$0</td>
                  <td className="py-4 px-6 text-center text-gray-700">$5 per lot</td>
                  <td className="py-4 px-6 text-center text-gray-700">$3 per lot</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-medium">Leverage</td>
                  <td className="py-4 px-6 text-center text-gray-700">up to 1:500</td>
                  <td className="py-4 px-6 text-center text-gray-700">up to 1:500</td>
                  <td className="py-4 px-6 text-center text-gray-700">up to 1:500</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-4 px-6 text-gray-900 font-medium">Premium Signals</td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-medium">Account Manager</td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="py-4 px-6 text-gray-900 font-medium">Automated Expert Advisor</td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountTypes
