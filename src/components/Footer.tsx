
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-quantis-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-6 font-display">
              <span className="text-quantis-purple">Q</span>uantis
              <span className="text-xs text-quantis-purple ml-1 align-top font-medium">FX</span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for online trading, providing access to global markets with advanced tools and exceptional support.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Trading Platforms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Account Types</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Trading Instruments</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Education</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Trading</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Forex</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Stocks</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Indices</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Commodities</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">Cryptocurrencies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors inline-block">ETFs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-quantis-purple mr-3 mt-0.5" />
                <span className="text-gray-400">1234 Trading Street, Financial District, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-quantis-purple mr-3" />
                <a href="tel:+18001234567" className="text-gray-400 hover:text-white transition-colors">+1 (800) 123-4567</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-quantis-purple mr-3" />
                <a href="mailto:info@quantis.com" className="text-gray-400 hover:text-white transition-colors">info@quantis.com</a>
              </li>
            </ul>
            
            <div className="mt-8 bg-white/5 p-4 rounded-lg">
              <h5 className="font-medium text-white mb-2">Trading Hours</h5>
              <p className="text-gray-400 text-sm">Monday to Friday: 24/5</p>
              <p className="text-gray-400 text-sm">Weekend: Crypto only</p>
            </div>
          </div>
        </div>
        
        <hr className="border-white/10 my-10" />
        
        <div className="flex flex-col md:flex-row justify-between">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Quantis. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Risk Disclosure</a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
        
        <div className="mt-8 text-xs text-gray-500 p-4 bg-white/5 rounded-lg">
          <p className="leading-relaxed">
            <strong className="text-gray-400">Risk Warning:</strong> Trading derivatives and leveraged products carries a high level of risk, including the risk of losing substantially more than your initial investment. It is not suitable for all investors. Before you make any decision in relation to a financial product you should obtain and consider our Product Disclosure Statement (PDS) and Financial Services Guide (FSG) available on our website and seek independent advice if necessary.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
