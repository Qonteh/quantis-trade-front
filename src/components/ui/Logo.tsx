
import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  darkMode?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  width = 120, 
  height = 40,
  darkMode = false
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/0849e0ac-05d2-4ae3-93fe-2421f554c675.png" 
        alt="QUANTIS Logo" 
        className={`object-contain ${darkMode ? 'brightness-0 invert' : ''}`}
        width={width} 
        height={height}
      />
    </div>
  );
};

export default Logo;
