import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Globe, Clock, Shield } from "lucide-react"
import Logo from "./ui/Logo"
import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* Top wave decoration */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12 transform rotate-180"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-gray-100"
          ></path>
        </svg>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and about section */}
          <div>
            <div className="mb-6 bg-white inline-block p-3 rounded-xl shadow-sm">
              <Logo width={150} height={200} />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your trusted partner for online trading, providing access to global markets with advanced tools and
              exceptional support.
            </p>
            <div className="flex space-x-3 mt-6">
              <a
                href="#"
                className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors"
              >
                <Facebook className="h-5 w-5 text-purple-700" />
              </a>
              <a
                href="#"
                className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
              >
                <Twitter className="h-5 w-5 text-blue-700" />
              </a>
              <a
                href="#"
                className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
              >
                <Instagram className="h-5 w-5 text-pink-700" />
              </a>
              <a
                href="#"
                className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-blue-800" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-gray-900 border-b border-gray-200 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Trading Platforms", path: "/platform" },
                { name: "Account Types", path: "/accounts" },
                { name: "Trading Instruments", path: "/markets" },
                { name: "Education", path: "/education" },
                { name: "Contact Us", path: "/contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-purple-700 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trading */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-gray-900 border-b border-gray-200 pb-2">Trading</h4>
            <ul className="space-y-3">
              {[
                { name: "Forex", path: "/markets/forex" },
                { name: "Stocks", path: "/markets/stocks" },
                { name: "Indices", path: "/markets/indices" },
                { name: "Commodities", path: "/markets/commodities" },
                { name: "Cryptocurrencies", path: "/markets/crypto" },
                { name: "ETFs", path: "/markets/etfs" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-purple-700 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-gray-900 border-b border-gray-200 pb-2">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-purple-700" />
                </div>
                <span className="text-gray-600 mt-1">1234 Trading Street, Financial District, 10001</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="h-4 w-4 text-green-700" />
                </div>
                <a href="tel:+18001234567" className="text-gray-600 hover:text-purple-700 transition-colors">
                  +1 (800) 123-4567
                </a>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-700" />
                </div>
                <a href="mailto:info@quantis.com" className="text-gray-600 hover:text-purple-700 transition-colors">
                  info@quantis.com
                </a>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Globe className="h-4 w-4 text-amber-700" />
                </div>
                <a href="https://quantis.com" className="text-gray-600 hover:text-purple-700 transition-colors">
                  www.quantis.com
                </a>
              </li>
            </ul>

            <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                <Clock className="h-4 w-4 text-purple-700 mr-2" />
                Trading Hours
              </h5>
              <p className="text-gray-600 text-sm">Monday to Friday: 24/5</p>
              <p className="text-gray-600 text-sm">Weekend: Crypto only</p>
            </div>
          </div>
        </div>

        {/* Account types highlight */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h5 className="font-semibold text-gray-900 mb-2">Standard Account</h5>
            <p className="text-gray-600 text-sm mb-2">Start trading with just $10 minimum deposit</p>
            <p className="text-purple-700 text-sm font-medium">Premium signals included</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h5 className="font-semibold text-gray-900 mb-2">Premium Account</h5>
            <p className="text-gray-600 text-sm mb-2">Enhanced trading with $100 minimum deposit</p>
            <p className="text-purple-700 text-sm font-medium">Dedicated account manager</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h5 className="font-semibold text-gray-900 mb-2">VIP Account</h5>
            <p className="text-gray-600 text-sm mb-2">Professional trading with $1,000 minimum deposit</p>
            <p className="text-purple-700 text-sm font-medium">Automated Expert Advisor included</p>
          </div>
        </div>

        <hr className="border-gray-200 my-10" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between">
          <p className="text-gray-600 text-sm">&copy; {currentYear} Quantis. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-600 text-sm hover:text-purple-700 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-600 text-sm hover:text-purple-700 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/risk" className="text-gray-600 text-sm hover:text-purple-700 transition-colors">
              Risk Disclosure
            </Link>
            <Link to="/cookies" className="text-gray-600 text-sm hover:text-purple-700 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Risk warning */}
        <div className="mt-8 text-xs text-gray-600 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-gray-900">Risk Warning:</strong> Trading derivatives and leveraged products
              carries a high level of risk, including the risk of losing substantially more than your initial
              investment. It is not suitable for all investors. Before you make any decision in relation to a financial
              product you should obtain and consider our Product Disclosure Statement (PDS) and Financial Services Guide
              (FSG) available on our website and seek independent advice if necessary.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-gray-200"
          ></path>
        </svg>
      </div>
    </footer>
  )
}

export default Footer
