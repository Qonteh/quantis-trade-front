
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="py-4 px-6 md:px-12 bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-quantis-dark">
            <span className="text-quantis-purple">Q</span>uantis
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                Trading <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-white">
              <DropdownMenuItem>Forex</DropdownMenuItem>
              <DropdownMenuItem>Stocks</DropdownMenuItem>
              <DropdownMenuItem>Commodities</DropdownMenuItem>
              <DropdownMenuItem>Cryptocurrencies</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                Platforms <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-white">
              <DropdownMenuItem>MT5</DropdownMenuItem>
              <DropdownMenuItem>Quantis Web</DropdownMenuItem>
              <DropdownMenuItem>Mobile App</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/about" className="text-gray-700 hover:text-quantis-purple">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-quantis-purple">Contact</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-700">
            Log In
          </Button>
          <Button className="bg-quantis-purple hover:bg-quantis-secondary text-white">
            Open Account
          </Button>
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
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-md px-4 py-4 z-50">
          <div className="flex flex-col space-y-4">
            <Link to="/trading" className="text-gray-700 py-2 hover:text-quantis-purple">Trading</Link>
            <Link to="/platforms" className="text-gray-700 py-2 hover:text-quantis-purple">Platforms</Link>
            <Link to="/about" className="text-gray-700 py-2 hover:text-quantis-purple">About</Link>
            <Link to="/contact" className="text-gray-700 py-2 hover:text-quantis-purple">Contact</Link>
            <hr />
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="w-full">Log In</Button>
              <Button className="w-full bg-quantis-purple hover:bg-quantis-secondary text-white">
                Open Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
