import { Link } from "react-router-dom"
import { ArrowRight, Zap, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const HeroSection = () => {
  return (
    <div className="relative pt-24 overflow-hidden bg-gradient-to-b from-[#0F0F1E] via-[#1A1A2E] to-[#1F1F35]">
      {/* Enhanced decorative elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/5 rounded-full animate-spin-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/5 rounded-full animate-spin-slow-reverse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-blue-400/10 rounded-full animate-float"></div>
      <div className="absolute bottom-20 left-20 w-36 h-36 bg-orange-400/10 rounded-full animate-bounce-subtle"></div>
      <div className="absolute top-40 left-40 w-16 h-16 bg-purple-400/15 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 right-40 w-20 h-20 bg-green-400/10 rounded-full animate-float-slow"></div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse-slow"></div>
      <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-white space-y-8">
            <div className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-sm text-purple-400 font-medium text-sm mb-4 border border-white/10 shadow-lg shadow-purple-500/10">
              Trade with confidence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
              Trade global markets with
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                {" "}
                Quantis
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-lg leading-relaxed">
              Access over 10,000 instruments across forex, stocks, commodities, and cryptocurrencies with tight spreads
              and low commissions.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-6">
              <Link to="/register">
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-6 text-lg rounded-xl shadow-xl transition-all duration-300">
                  Open Account
                </Button>
              </Link>
              <Link to="/register?demo=true">
                <Button className="bg-[#3B82F6] text-white px-8 py-6 text-lg rounded-xl shadow-xl transition-all duration-300">
                  Try Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10">
                <div className="rounded-full bg-purple-500/20 p-2.5">
                  <ShieldCheck className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-sm sm:text-base font-medium">Regulated Broker</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10">
                <div className="rounded-full bg-purple-500/20 p-2.5">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-sm sm:text-base font-medium">Fast Execution</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10">
                <div className="rounded-full bg-purple-500/20 p-2.5">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-sm sm:text-base font-medium">24/5 Support</span>
              </div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
            <div className="relative backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-400/30 rounded-full filter blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-400/30 rounded-full filter blur-xl"></div>
              <h3 className="text-white text-xl font-semibold mb-8 flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-400 mr-3 animate-pulse"></div>
                Market Overview
              </h3>
              <div className="space-y-6">
                {[
                  { name: "EUR/USD", value: "1.0934", change: "+0.12%", color: "green" },
                  { name: "Gold", value: "2,325.50", change: "+0.65%", color: "green" },
                  { name: "NASDAQ", value: "16,742.30", change: "-0.21%", color: "red" },
                  { name: "Bitcoin", value: "62,845.20", change: "+1.32%", color: "green" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-4 border-b border-white/10 hover:bg-white/5 p-2 rounded-lg transition-all duration-300"
                  >
                    <span className="text-white/90 font-medium">{item.name}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-white font-mono font-medium">{item.value}</span>
                      <span
                        className={`text-xs font-medium ${item.color === "green" ? "text-green-400" : "text-red-400"}`}
                      >
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-8 bg-white/10 text-white border border-white/20 rounded-xl py-5 shadow-lg">
                Open Chart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
    </div>
  )
}

export default HeroSection
