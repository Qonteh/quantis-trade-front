
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Get saved language from localStorage if available
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    // Here you would typically call a function to change the app's language
    // For now we'll just save it to localStorage
  };

  return (
    <nav className={`py-4 px-6 md:px-12 fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-display font-bold">
            <span className="text-quantis-purple">Q</span>uantis
            <span className="text-xs text-quantis-purple ml-1 align-top font-medium">FX</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center font-medium">
                Trading <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-lg rounded-xl p-2 w-48">
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3">Forex</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3">Stocks</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3">Commodities</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3">Cryptocurrencies</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center font-medium">
                Platforms <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-lg rounded-xl p-2 w-48">
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3">MT5</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3">Quantis Web</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3">Mobile App</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/about" className="text-gray-700 hover:text-quantis-purple font-medium">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-quantis-purple font-medium">Contact</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-lg rounded-xl p-2 w-36">
              <DropdownMenuItem 
                className={`rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3 ${currentLanguage === 'English' ? 'bg-gray-50 font-medium' : ''}`}
                onClick={() => handleLanguageChange('English')}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3 ${currentLanguage === 'Español' ? 'bg-gray-50 font-medium' : ''}`}
                onClick={() => handleLanguageChange('Español')}
              >
                Español
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`rounded-lg cursor-pointer hover:bg-gray-50 py-2 px-3 ${currentLanguage === 'Français' ? 'bg-gray-50 font-medium' : ''}`}
                onClick={() => handleLanguageChange('Français')}
              >
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <a href="/login" className="font-medium text-[#7C3AED] hover:underline">
            <Button variant="ghost" className="text-gray-700 font-medium">
              Log In
            </Button>
          </a>
          <a href="/register" className="font-medium text-[#7C3AED] hover:underline">
            <Button className="bg-quantis-purple hover:bg-quantis-secondary text-white font-medium">
              Open Account
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white/95 backdrop-blur-md shadow-lg px-4 py-4 z-50 border-t border-gray-100">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-1 pb-2">
              <div className="text-sm font-semibold text-gray-500 px-2">Trading</div>
              <Link to="/forex" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">Forex</Link>
              <Link to="/stocks" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">Stocks</Link>
              <Link to="/commodities" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">Commodities</Link>
              <Link to="/crypto" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">Cryptocurrencies</Link>
            </div>
            
            <div className="flex flex-col space-y-1 pb-2">
              <div className="text-sm font-semibold text-gray-500 px-2">Platforms</div>
              <Link to="/mt5" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">MT5</Link>
              <Link to="/web" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">Quantis Web</Link>
              <Link to="/mobile" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">Mobile App</Link>
            </div>
            
            <Link to="/about" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">About</Link>
            <Link to="/contact" className="text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md">Contact</Link>
            
            <div className="flex flex-col space-y-1 pb-2">
              <div className="text-sm font-semibold text-gray-500 px-2">Language</div>
              <button 
                className={`text-left text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md ${currentLanguage === 'English' ? 'bg-gray-50 font-medium' : ''}`}
                onClick={() => handleLanguageChange('English')}
              >
                English
              </button>
              <button 
                className={`text-left text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md ${currentLanguage === 'Español' ? 'bg-gray-50 font-medium' : ''}`}
                onClick={() => handleLanguageChange('Español')}
              >
                Español
              </button>
              <button 
                className={`text-left text-gray-800 py-2 px-2 hover:bg-gray-50 rounded-md ${currentLanguage === 'Français' ? 'bg-gray-50 font-medium' : ''}`}
                onClick={() => handleLanguageChange('Français')}
              >
                Français
              </button>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button className="w-full bg-quantis-purple hover:bg-quantis-secondary text-white" asChild>
                <Link to="/register">Open Account</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
