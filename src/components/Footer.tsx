
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-quantis-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">
              <span className="text-quantis-purple">Q</span>uantis
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for online trading, providing access to global markets with advanced tools and exceptional support.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Trading Platforms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Account Types</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Trading Instruments</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Education</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Trading</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Forex</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Stocks</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Indices</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Commodities</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cryptocurrencies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">ETFs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-quantis-purple mr-3 mt-0.5" />
                <span className="text-gray-400">1234 Trading Street, Financial District, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-quantis-purple mr-3" />
                <a href="tel:+18001234567" className="text-gray-400 hover:text-white">+1 (800) 123-4567</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-quantis-purple mr-3" />
                <a href="mailto:info@quantis.com" className="text-gray-400 hover:text-white">info@quantis.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Quantis. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 text-sm hover:text-white">Terms of Service</a>
            <a href="#" className="text-gray-400 text-sm hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 text-sm hover:text-white">Risk Disclosure</a>
            <a href="#" className="text-gray-400 text-sm hover:text-white">Cookie Policy</a>
          </div>
        </div>
        
        <div className="mt-8 text-xs text-gray-500">
          <p>Risk Warning: Trading derivatives and leveraged products carries a high level of risk, including the risk of losing substantially more than your initial investment. It is not suitable for all investors. Before you make any decision in relation to a financial product you should obtain and consider our Product Disclosure Statement (PDS) and Financial Services Guide (FSG) available on our website and seek independent advice if necessary.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
