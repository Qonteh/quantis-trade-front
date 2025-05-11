import { Button } from "@/components/ui/button"
import { Bell, ArrowDownToLine, ChevronRight, Mail, Calendar } from "lucide-react"

const MobileAppCTA = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-[#0F0F1E] via-[#1A1A2E] to-[#1F1F35] overflow-hidden relative">
      {/* Enhanced decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-spin-slow"></div>

      {/* Coming soon badge */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg z-20 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        COMING SOON
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative">
              <div className="absolute -left-6 top-1/4 w-40 h-40 bg-orange-500/20 rounded-full filter blur-2xl"></div>
              <div className="absolute -right-10 bottom-1/4 w-40 h-40 bg-blue-400/20 rounded-full filter blur-2xl"></div>
              <div className="relative perspective-1000">
                <div className="relative transform rotate-6 hover:rotate-0 transition-transform duration-700">
                  <div className="p-4 bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                    {/* Phone mockup with app preview */}
                    <div className="relative mx-auto" style={{ maxWidth: "280px" }}>
                      <div className="bg-gray-900 rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden">
                        <div className="h-[500px] w-full bg-gradient-to-b from-purple-600 to-blue-700 relative">
                          {/* Phone notch */}
                          <div className="absolute top-0 left-0 right-0 h-6 bg-black rounded-t-[2rem] flex items-center justify-center">
                            <div className="w-20 h-4 bg-black rounded-b-xl"></div>
                          </div>

                          {/* App UI mockup */}
                          <div className="pt-10 px-4 text-center">
                            <div className="text-white text-xl font-bold mb-2">Quantis Trading</div>
                            <div className="text-white/70 text-sm">Mobile App Coming Soon</div>

                            <div className="mt-6 bg-white/10 rounded-xl p-3">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-white font-medium">EUR/USD</div>
                                <div className="text-green-400">+0.12%</div>
                              </div>
                              <div className="h-28 bg-black/20 rounded-lg mb-2 flex items-end p-2">
                                {/* Simplified chart representation */}
                                <div className="flex items-end w-full h-full space-x-0.5">
                                  {[40, 60, 50, 70, 55, 80, 65, 90, 75, 85, 70, 60, 80, 90, 100].map((height, i) => (
                                    <div
                                      key={i}
                                      className="flex-1 bg-gradient-to-t from-green-500 to-green-400"
                                      style={{ height: `${height}%` }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-3">
                                <button className="bg-green-500 text-white py-1.5 rounded-lg text-sm font-medium">
                                  BUY
                                </button>
                                <button className="bg-red-500 text-white py-1.5 rounded-lg text-sm font-medium">
                                  SELL
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 bg-white/10 rounded-xl p-3">
                              <div className="text-white font-medium mb-2 text-left">Market Overview</div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                  <div className="text-white text-sm">Gold</div>
                                  <div className="text-green-400 text-sm">$1,892.50</div>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                  <div className="text-white text-sm">Bitcoin</div>
                                  <div className="text-red-400 text-sm">$42,156.30</div>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                  <div className="text-white text-sm">NASDAQ</div>
                                  <div className="text-green-400 text-sm">15,630.60</div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 bg-white/10 rounded-xl p-3">
                              <div className="text-white font-medium mb-2 text-left">Coming Q3 2025</div>
                              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-3/4"></div>
                              </div>
                            </div>

                            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                              <div className="h-1 w-32 bg-white/30 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Glowing effect behind phone */}
                      <div className="absolute -bottom-6 -left-6 -right-6 h-40 bg-gradient-to-t from-purple-500/30 to-transparent blur-xl rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-500/30 rounded-full filter blur-xl"></div>
              </div>
            </div>
          </div>

          <div className="text-white">
            <div className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-sm text-purple-400 font-medium text-sm mb-6 border border-white/10 shadow-lg">
              Mobile Trading Experience
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">
              Quantis Mobile App{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                Coming Soon
              </span>
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Our powerful mobile trading app is in development. Be the first to know when it launches and get exclusive
              early access to trade on the go, monitor markets, and manage your portfolio from anywhere.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start">
                <div className="mt-1 bg-white/10 rounded-lg h-10 w-10 flex items-center justify-center">
                  <ArrowDownToLine className="h-5 w-5 text-purple-400" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Real-time Price Alerts</h3>
                  <p className="text-white/70 text-base mt-1">Get notified when markets reach your target prices.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 bg-white/10 rounded-lg h-10 w-10 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-purple-400" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Advanced Charts</h3>
                  <p className="text-white/70 text-base mt-1">
                    Perform technical analysis with multiple timeframes and indicators.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 bg-white/10 rounded-lg h-10 w-10 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-purple-400" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">Secure Biometric Login</h3>
                  <p className="text-white/70 text-base mt-1">
                    Access your account quickly and securely with fingerprint or face recognition.
                  </p>
                </div>
              </div>
            </div>

            {/* Email notification form */}
            <div className="mt-12 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-purple-400" />
                Get Notified When We Launch
              </h3>
              <p className="text-white/70 mb-4">
                Join our waiting list and be the first to know when our mobile app is ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-xl">
                  Notify Me
                </Button>
              </div>
              <div className="mt-4 text-white/50 text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Expected release: Q3 2025
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
    </div>
  )
}

export default MobileAppCTA
