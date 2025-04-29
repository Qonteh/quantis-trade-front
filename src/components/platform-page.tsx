"use client"

import { useState } from "react"
import { Download, Laptop, Smartphone, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// MetaTrader 5 Logo Component
const MT5Logo = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className} fill="none">
    <path
      d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z"
      fill="#4A89DC"
    />
    <path
      d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40C32.837 40 40 32.837 40 24C40 15.163 32.837 8 24 8Z"
      fill="#5D9CEC"
    />
    <path d="M14 18H18V32H14V18ZM22 18H26V32H22V18ZM30 18H34V32H30V18Z" fill="white" />
    <path d="M14 16H34V18H14V16Z" fill="white" />
  </svg>
)

// MetaTrader 4 Logo Component
const MT4Logo = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className} fill="none">
    <path
      d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z"
      fill="#ED5565"
    />
    <path
      d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40C32.837 40 40 32.837 40 24C40 15.163 32.837 8 24 8Z"
      fill="#FF6B6B"
    />
    <path d="M14 18H18V32H14V18ZM22 18H26V32H22V18ZM30 18H34V32H30V18Z" fill="white" />
    <path d="M14 16H34V18H14V16Z" fill="white" />
  </svg>
)

// MT5 Platform Interface SVG
const MT5Interface = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 800 450" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="800" height="450" fill="#1E1E1E" />

    {/* Top toolbar */}
    <rect width="800" height="30" fill="#2D2D2D" />
    <text x="10" y="20" fill="#FFFFFF" fontSize="14">
      MetaTrader 5
    </text>

    {/* Left sidebar - Navigator */}
    <rect x="0" y="30" width="200" height="420" fill="#252525" />
    <text x="10" y="50" fill="#FFFFFF" fontSize="12">
      Navigator
    </text>
    <rect x="10" y="60" width="180" height="20" fill="#303030" />
    <text x="15" y="75" fill="#FFFFFF" fontSize="11">
      Accounts
    </text>
    <rect x="10" y="85" width="180" height="20" fill="#303030" />
    <text x="15" y="100" fill="#FFFFFF" fontSize="11">
      Indicators
    </text>
    <rect x="10" y="110" width="180" height="20" fill="#303030" />
    <text x="15" y="125" fill="#FFFFFF" fontSize="11">
      Expert Advisors
    </text>

    {/* Main chart area */}
    <rect x="200" y="30" width="600" height="300" fill="#0E0E0E" />

    {/* Chart grid lines */}
    <line x1="200" y1="80" x2="800" y2="80" stroke="#333333" strokeWidth="1" />
    <line x1="200" y1="130" x2="800" y2="130" stroke="#333333" strokeWidth="1" />
    <line x1="200" y1="180" x2="800" y2="180" stroke="#333333" strokeWidth="1" />
    <line x1="200" y1="230" x2="800" y2="230" stroke="#333333" strokeWidth="1" />
    <line x1="200" y1="280" x2="800" y2="280" stroke="#333333" strokeWidth="1" />

    <line x1="250" y1="30" x2="250" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="300" y1="30" x2="300" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="350" y1="30" x2="350" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="400" y1="30" x2="400" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="450" y1="30" x2="450" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="500" y1="30" x2="500" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="550" y1="30" x2="550" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="600" y1="30" x2="600" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="650" y1="30" x2="650" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="700" y1="30" x2="700" y2="330" stroke="#333333" strokeWidth="1" />
    <line x1="750" y1="30" x2="750" y2="330" stroke="#333333" strokeWidth="1" />

    {/* Chart candlesticks */}
    <rect x="220" y="100" width="10" height="40" fill="#4CAF50" />
    <line x1="225" y1="90" x2="225" y2="100" stroke="#4CAF50" strokeWidth="2" />
    <line x1="225" y1="140" x2="225" y2="150" stroke="#4CAF50" strokeWidth="2" />

    <rect x="245" y="130" width="10" height="30" fill="#F44336" />
    <line x1="250" y1="120" x2="250" y2="130" stroke="#F44336" strokeWidth="2" />
    <line x1="250" y1="160" x2="250" y2="170" stroke="#F44336" strokeWidth="2" />

    <rect x="270" y="110" width="10" height="50" fill="#4CAF50" />
    <line x1="275" y1="100" x2="275" y2="110" stroke="#4CAF50" strokeWidth="2" />
    <line x1="275" y1="160" x2="275" y2="170" stroke="#4CAF50" strokeWidth="2" />

    <rect x="295" y="140" width="10" height="20" fill="#F44336" />
    <line x1="300" y1="130" x2="300" y2="140" stroke="#F44336" strokeWidth="2" />
    <line x1="300" y1="160" x2="300" y2="180" stroke="#F44336" strokeWidth="2" />

    <rect x="320" y="120" width="10" height="40" fill="#4CAF50" />
    <line x1="325" y1="110" x2="325" y2="120" stroke="#4CAF50" strokeWidth="2" />
    <line x1="325" y1="160" x2="325" y2="170" stroke="#4CAF50" strokeWidth="2" />

    <rect x="345" y="100" width="10" height="60" fill="#4CAF50" />
    <line x1="350" y1="90" x2="350" y2="100" stroke="#4CAF50" strokeWidth="2" />
    <line x1="350" y1="160" x2="350" y2="180" stroke="#4CAF50" strokeWidth="2" />

    <rect x="370" y="150" width="10" height="30" fill="#F44336" />
    <line x1="375" y1="140" x2="375" y2="150" stroke="#F44336" strokeWidth="2" />
    <line x1="375" y1="180" x2="375" y2="190" stroke="#F44336" strokeWidth="2" />

    <rect x="395" y="130" width="10" height="40" fill="#F44336" />
    <line x1="400" y1="120" x2="400" y2="130" stroke="#F44336" strokeWidth="2" />
    <line x1="400" y1="170" x2="400" y2="180" stroke="#F44336" strokeWidth="2" />

    <rect x="420" y="110" width="10" height="50" fill="#4CAF50" />
    <line x1="425" y1="100" x2="425" y2="110" stroke="#4CAF50" strokeWidth="2" />
    <line x1="425" y1="160" x2="425" y2="170" stroke="#4CAF50" strokeWidth="2" />

    <rect x="445" y="90" width="10" height="70" fill="#4CAF50" />
    <line x1="450" y1="80" x2="450" y2="90" stroke="#4CAF50" strokeWidth="2" />
    <line x1="450" y1="160" x2="450" y2="170" stroke="#4CAF50" strokeWidth="2" />

    <rect x="470" y="120" width="10" height="40" fill="#F44336" />
    <line x1="475" y1="110" x2="475" y2="120" stroke="#F44336" strokeWidth="2" />
    <line x1="475" y1="160" x2="475" y2="170" stroke="#F44336" strokeWidth="2" />

    <rect x="495" y="140" width="10" height="30" fill="#F44336" />
    <line x1="500" y1="130" x2="500" y2="140" stroke="#F44336" strokeWidth="2" />
    <line x1="500" y1="170" x2="500" y2="180" stroke="#F44336" strokeWidth="2" />

    <rect x="520" y="110" width="10" height="60" fill="#4CAF50" />
    <line x1="525" y1="100" x2="525" y2="110" stroke="#4CAF50" strokeWidth="2" />
    <line x1="525" y1="170" x2="525" y2="180" stroke="#4CAF50" strokeWidth="2" />

    <rect x="545" y="130" width="10" height="40" fill="#4CAF50" />
    <line x1="550" y1="120" x2="550" y2="130" stroke="#4CAF50" strokeWidth="2" />
    <line x1="550" y1="170" x2="550" y2="180" stroke="#4CAF50" strokeWidth="2" />

    <rect x="570" y="150" width="10" height="20" fill="#F44336" />
    <line x1="575" y1="140" x2="575" y2="150" stroke="#F44336" strokeWidth="2" />
    <line x1="575" y1="170" x2="575" y2="180" stroke="#F44336" strokeWidth="2" />

    <rect x="595" y="120" width="10" height="50" fill="#4CAF50" />
    <line x1="600" y1="110" x2="600" y2="120" stroke="#4CAF50" strokeWidth="2" />
    <line x1="600" y1="170" x2="600" y2="180" stroke="#4CAF50" strokeWidth="2" />

    {/* Moving average line */}
    <path
      d="M220,180 Q250,170 280,160 T340,150 T400,160 T460,140 T520,150 T580,160 T640,150"
      stroke="#3F51B5"
      strokeWidth="2"
      fill="none"
    />

    {/* Bottom panel - Terminal */}
    <rect x="200" y="330" width="600" height="120" fill="#252525" />
    <text x="210" y="350" fill="#FFFFFF" fontSize="12">
      Terminal
    </text>

    {/* Terminal tabs */}
    <rect x="210" y="360" width="80" height="20" fill="#3F51B5" />
    <text x="220" y="375" fill="#FFFFFF" fontSize="11">
      Trade
    </text>
    <rect x="290" y="360" width="80" height="20" fill="#303030" />
    <text x="300" y="375" fill="#FFFFFF" fontSize="11">
      Account History
    </text>
    <rect x="370" y="360" width="80" height="20" fill="#303030" />
    <text x="380" y="375" fill="#FFFFFF" fontSize="11">
      News
    </text>
    <rect x="450" y="360" width="80" height="20" fill="#303030" />
    <text x="460" y="375" fill="#FFFFFF" fontSize="11">
      Alerts
    </text>

    {/* Terminal content */}
    <rect x="210" y="380" width="580" height="60" fill="#1A1A1A" />
    <text x="220" y="400" fill="#FFFFFF" fontSize="11">
      Symbol
    </text>
    <text x="300" y="400" fill="#FFFFFF" fontSize="11">
      Type
    </text>
    <text x="380" y="400" fill="#FFFFFF" fontSize="11">
      Volume
    </text>
    <text x="460" y="400" fill="#FFFFFF" fontSize="11">
      Price
    </text>
    <text x="540" y="400" fill="#FFFFFF" fontSize="11">
      S/L
    </text>
    <text x="620" y="400" fill="#FFFFFF" fontSize="11">
      T/P
    </text>
    <text x="700" y="400" fill="#FFFFFF" fontSize="11">
      Profit
    </text>

    <text x="220" y="420" fill="#FFFFFF" fontSize="11">
      EURUSD
    </text>
    <text x="300" y="420" fill="#4CAF50" fontSize="11">
      Buy
    </text>
    <text x="380" y="420" fill="#FFFFFF" fontSize="11">
      0.10
    </text>
    <text x="460" y="420" fill="#FFFFFF" fontSize="11">
      1.0876
    </text>
    <text x="540" y="420" fill="#FFFFFF" fontSize="11">
      1.0850
    </text>
    <text x="620" y="420" fill="#FFFFFF" fontSize="11">
      1.0900
    </text>
    <text x="700" y="420" fill="#4CAF50" fontSize="11">
      +26.00
    </text>

    <text x="220" y="440" fill="#FFFFFF" fontSize="11">
      GBPUSD
    </text>
    <text x="300" y="440" fill="#F44336" fontSize="11">
      Sell
    </text>
    <text x="380" y="440" fill="#FFFFFF" fontSize="11">
      0.05
    </text>
    <text x="460" y="440" fill="#FFFFFF" fontSize="11">
      1.2543
    </text>
    <text x="540" y="440" fill="#FFFFFF" fontSize="11">
      1.2570
    </text>
    <text x="620" y="440" fill="#FFFFFF" fontSize="11">
      1.2500
    </text>
    <text x="700" y="440" fill="#F44336" fontSize="11">
      -13.50
    </text>

    {/* MT5 Logo in corner */}
    <g transform="translate(750, 10) scale(0.5)">
      <path
        d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z"
        fill="#4A89DC"
      />
      <path
        d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40C32.837 40 40 32.837 40 24C40 15.163 32.837 8 24 8Z"
        fill="#5D9CEC"
      />
      <path d="M14 18H18V32H14V18ZM22 18H26V32H22V18ZM30 18H34V32H30V18Z" fill="white" />
      <path d="M14 16H34V18H14V16Z" fill="white" />
    </g>
  </svg>
)

// MT4 Platform Interface SVG
const MT4Interface = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 800 450" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="800" height="450" fill="#F0F0F0" />

    {/* Top toolbar */}
    <rect width="800" height="30" fill="#D9D9D9" />
    <text x="10" y="20" fill="#333333" fontSize="14">
      MetaTrader 4
    </text>

    {/* Left sidebar - Navigator */}
    <rect x="0" y="30" width="200" height="420" fill="#E6E6E6" />
    <text x="10" y="50" fill="#333333" fontSize="12">
      Market Watch
    </text>
    <rect x="10" y="60" width="180" height="20" fill="#F5F5F5" />
    <text x="15" y="75" fill="#333333" fontSize="11">
      EURUSD
    </text>
    <rect x="10" y="85" width="180" height="20" fill="#F5F5F5" />
    <text x="15" y="100" fill="#333333" fontSize="11">
      GBPUSD
    </text>
    <rect x="10" y="110" width="180" height="20" fill="#F5F5F5" />
    <text x="15" y="125" fill="#333333" fontSize="11">
      USDJPY
    </text>
    <rect x="10" y="135" width="180" height="20" fill="#F5F5F5" />
    <text x="15" y="150" fill="#333333" fontSize="11">
      AUDUSD
    </text>
    <rect x="10" y="160" width="180" height="20" fill="#F5F5F5" />
    <text x="15" y="175" fill="#333333" fontSize="11">
      USDCAD
    </text>

    {/* Main chart area */}
    <rect x="200" y="30" width="600" height="300" fill="#FFFFFF" />

    {/* Chart grid lines */}
    <line x1="200" y1="80" x2="800" y2="80" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="200" y1="130" x2="800" y2="130" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="200" y1="180" x2="800" y2="180" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="200" y1="230" x2="800" y2="230" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="200" y1="280" x2="800" y2="280" stroke="#E0E0E0" strokeWidth="1" />

    <line x1="250" y1="30" x2="250" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="300" y1="30" x2="300" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="350" y1="30" x2="350" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="400" y1="30" x2="400" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="450" y1="30" x2="450" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="500" y1="30" x2="500" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="550" y1="30" x2="550" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="600" y1="30" x2="600" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="650" y1="30" x2="650" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="700" y1="30" x2="700" y2="330" stroke="#E0E0E0" strokeWidth="1" />
    <line x1="750" y1="30" x2="750" y2="330" stroke="#E0E0E0" strokeWidth="1" />

    {/* Chart bars */}
    <rect x="220" y="100" width="10" height="40" fill="#4CAF50" />
    <rect x="245" y="130" width="10" height="30" fill="#F44336" />
    <rect x="270" y="110" width="10" height="50" fill="#4CAF50" />
    <rect x="295" y="140" width="10" height="20" fill="#F44336" />
    <rect x="320" y="120" width="10" height="40" fill="#4CAF50" />
    <rect x="345" y="100" width="10" height="60" fill="#4CAF50" />
    <rect x="370" y="150" width="10" height="30" fill="#F44336" />
    <rect x="395" y="130" width="10" height="40" fill="#F44336" />
    <rect x="420" y="110" width="10" height="50" fill="#4CAF50" />
    <rect x="445" y="90" width="10" height="70" fill="#4CAF50" />
    <rect x="470" y="120" width="10" height="40" fill="#F44336" />
    <rect x="495" y="140" width="10" height="30" fill="#F44336" />
    <rect x="520" y="110" width="10" height="60" fill="#4CAF50" />
    <rect x="545" y="130" width="10" height="40" fill="#4CAF50" />
    <rect x="570" y="150" width="10" height="20" fill="#F44336" />
    <rect x="595" y="120" width="10" height="50" fill="#4CAF50" />

    {/* Moving average line */}
    <path
      d="M220,180 Q250,170 280,160 T340,150 T400,160 T460,140 T520,150 T580,160 T640,150"
      stroke="#FF6B6B"
      strokeWidth="2"
      fill="none"
    />

    {/* Bottom panel - Terminal */}
    <rect x="200" y="330" width="600" height="120" fill="#E6E6E6" />
    <text x="210" y="350" fill="#333333" fontSize="12">
      Terminal
    </text>

    {/* Terminal tabs */}
    <rect x="210" y="360" width="80" height="20" fill="#FF6B6B" />
    <text x="220" y="375" fill="#FFFFFF" fontSize="11">
      Trade
    </text>
    <rect x="290" y="360" width="80" height="20" fill="#F0F0F0" />
    <text x="300" y="375" fill="#333333" fontSize="11">
      Account History
    </text>
    <rect x="370" y="360" width="80" height="20" fill="#F0F0F0" />
    <text x="380" y="375" fill="#333333" fontSize="11">
      News
    </text>
    <rect x="450" y="360" width="80" height="20" fill="#F0F0F0" />
    <text x="460" y="375" fill="#333333" fontSize="11">
      Alerts
    </text>

    {/* Terminal content */}
    <rect x="210" y="380" width="580" height="60" fill="#FFFFFF" />
    <text x="220" y="400" fill="#333333" fontSize="11">
      Symbol
    </text>
    <text x="300" y="400" fill="#333333" fontSize="11">
      Type
    </text>
    <text x="380" y="400" fill="#333333" fontSize="11">
      Volume
    </text>
    <text x="460" y="400" fill="#333333" fontSize="11">
      Price
    </text>
    <text x="540" y="400" fill="#333333" fontSize="11">
      S/L
    </text>
    <text x="620" y="400" fill="#333333" fontSize="11">
      T/P
    </text>
    <text x="700" y="400" fill="#333333" fontSize="11">
      Profit
    </text>

    <text x="220" y="420" fill="#333333" fontSize="11">
      EURUSD
    </text>
    <text x="300" y="420" fill="#4CAF50" fontSize="11">
      Buy
    </text>
    <text x="380" y="420" fill="#333333" fontSize="11">
      0.10
    </text>
    <text x="460" y="420" fill="#333333" fontSize="11">
      1.0876
    </text>
    <text x="540" y="420" fill="#333333" fontSize="11">
      1.0850
    </text>
    <text x="620" y="420" fill="#333333" fontSize="11">
      1.0900
    </text>
    <text x="700" y="420" fill="#4CAF50" fontSize="11">
      +26.00
    </text>

    <text x="220" y="440" fill="#333333" fontSize="11">
      GBPUSD
    </text>
    <text x="300" y="440" fill="#F44336" fontSize="11">
      Sell
    </text>
    <text x="380" y="440" fill="#333333" fontSize="11">
      0.05
    </text>
    <text x="460" y="440" fill="#333333" fontSize="11">
      1.2543
    </text>
    <text x="540" y="440" fill="#333333" fontSize="11">
      1.2570
    </text>
    <text x="620" y="440" fill="#333333" fontSize="11">
      1.2500
    </text>
    <text x="700" y="440" fill="#F44336" fontSize="11">
      -13.50
    </text>

    {/* MT4 Logo in corner */}
    <g transform="translate(750, 10) scale(0.5)">
      <path
        d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z"
        fill="#ED5565"
      />
      <path
        d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40C32.837 40 40 32.837 40 24C40 15.163 32.837 8 24 8Z"
        fill="#FF6B6B"
      />
      <path d="M14 18H18V32H14V18ZM22 18H26V32H22V18ZM30 18H34V32H30V18Z" fill="white" />
      <path d="M14 16H34V18H14V16Z" fill="white" />
    </g>
  </svg>
)

export default function PlatformPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("mt5")
  const [selectedDevice, setSelectedDevice] = useState("desktop")

  // Update the platform versions interface definitions to be more specific
  const platforms = {
    mt5: {
      title: "MetaTrader 5",
      description:
        "The next-generation multi-asset platform for trading forex, CFDs, stocks, and futures with advanced technical analysis, algorithmic trading, and a flexible trading system.",
      features: [
        "Multi-asset trading platform",
        "Advanced technical analysis with 38 built-in indicators",
        "21 timeframes for charts",
        "Algorithmic trading with MQL5",
        "Economic calendar integration",
        "Market depth and DOM trading",
      ],
      versions: {
        desktop: {
          requirements: "Windows 7/8/10/11 or macOS 10.15+",
          downloadSize: "85 MB",
          version: "5.0.45",
          type: "desktop" as const,
          downloadLinks: {
            windows: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe",
            mac: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg",
          },
        },
        web: {
          requirements: "Modern web browser (Chrome, Firefox, Safari, Edge)",
          downloadSize: "N/A",
          version: "Web",
          type: "web" as const,
          webLink: "https://trade.mql5.com/trade",
        },
        mobile: {
          requirements: "iOS 14+ or Android 8+",
          downloadSize: "45 MB",
          version: "5.0.45",
          type: "mobile" as const,
          downloadLinks: {
            ios: "https://apps.apple.com/us/app/metatrader-5/id413251709",
            android: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5",
          },
        },
      },
    },
    mt4: {
      title: "MetaTrader 4",
      description:
        "The world's most popular trading platform for forex and CFDs, known for its reliability, simplicity, and extensive features for technical analysis.",
      features: [
        "Forex and CFD trading platform",
        "30 built-in technical indicators",
        "9 timeframes for charts",
        "Algorithmic trading with MQL4",
        "One-click trading functionality",
        "Extensive Expert Advisor support",
      ],
      versions: {
        desktop: {
          requirements: "Windows XP/7/8/10/11",
          downloadSize: "75 MB",
          version: "4.0.0.1380",
          type: "desktop" as const,
          downloadLinks: {
            windows: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt4/mt4setup.exe",
            mac: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt4/MetaTrader4.dmg",
          },
        },
        web: {
          requirements: "Modern web browser (Chrome, Firefox, Safari, Edge)",
          downloadSize: "N/A",
          version: "Web",
          type: "web" as const,
          webLink: "https://trade.mql5.com/trade?servers=MetaQuotes-Demo,MetaQuotes-Demo2",
        },
        mobile: {
          requirements: "iOS 12+ or Android 7+",
          downloadSize: "40 MB",
          version: "4.0.0.1380",
          type: "mobile" as const,
          downloadLinks: {
            ios: "https://apps.apple.com/us/app/metatrader-4/id496212596",
            android: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader4",
          },
        },
      },
    },
  }

  const deviceIcons = {
    desktop: <Laptop className="h-4 w-4" />,
    web: <ExternalLink className="h-4 w-4" />,
    mobile: <Smartphone className="h-4 w-4" />,
  }

  const deviceLabels = {
    desktop: "Desktop",
    web: "Web",
    mobile: "Mobile",
  }

  const handleDownload = (platform, deviceType) => {
    const platformData = platforms[platform]
    const deviceData = platformData.versions[deviceType]

    if (deviceType === "web") {
      window.open(deviceData.webLink, "_blank")
    } else if (deviceType === "desktop") {
      // For desktop, we'll show both Windows and Mac options
      const windowsLink = deviceData.downloadLinks.windows
      window.open(windowsLink, "_blank")
    } else if (deviceType === "mobile") {
      // For mobile, we'll just open the appropriate store based on device
      // In a real app, you might want to detect the device OS
      const androidLink = deviceData.downloadLinks.android
      window.open(androidLink, "_blank")
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Trading Platforms</h2>
        <p className="text-muted-foreground">Choose your preferred MetaTrader platform to access the markets</p>
      </div>

      <Tabs defaultValue="mt5" className="w-full" onValueChange={setSelectedPlatform}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="mt5" className="flex items-center gap-2">
            <MT5Logo className="h-5 w-5" />
            <span>MetaTrader 5</span>
          </TabsTrigger>
          <TabsTrigger value="mt4" className="flex items-center gap-2">
            <MT4Logo className="h-5 w-5" />
            <span>MetaTrader 4</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(platforms).map(([key, platform]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            <Tabs defaultValue="desktop" onValueChange={setSelectedDevice}>
              <TabsList className="w-full md:w-auto mb-6">
                <TabsTrigger value="desktop" className="flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  <span>Desktop</span>
                </TabsTrigger>
                <TabsTrigger value="web" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Web</span>
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Mobile</span>
                </TabsTrigger>
              </TabsList>

              {Object.entries(platform.versions).map(([deviceType, deviceDetails]) => (
                <TabsContent key={deviceType} value={deviceType}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {key === "mt5" ? (
                                  <MT5Logo className="h-6 w-6 mr-2" />
                                ) : (
                                  <MT4Logo className="h-6 w-6 mr-2" />
                                )}
                                <CardTitle>
                                  {platform.title} for {deviceLabels[deviceType]}
                                </CardTitle>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                v{deviceDetails.version}
                              </Badge>
                            </div>
                            <CardDescription className="mt-2">{platform.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-muted rounded-md overflow-hidden mb-4">
                          {key === "mt5" ? <MT5Interface /> : <MT4Interface />}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">System Requirements</h4>
                            <p className="text-sm text-muted-foreground">{deviceDetails.requirements}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Download Size</h4>
                            <p className="text-sm text-muted-foreground">{deviceDetails.downloadSize}</p>
                          </div>
                        </div>
                      </CardContent>
                      {/* Update the CardFooter section to use type checking */}
                      <CardFooter>
                        {deviceDetails.type === "web" ? (
                          <Button className="w-full" onClick={() => window.open(deviceDetails.webLink, "_blank")}>
                            Launch {platform.title} Web Terminal
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        ) : deviceDetails.type === "desktop" ? (
                          <div className="w-full space-y-2">
                            <Button
                              className="w-full"
                              onClick={() => window.open(deviceDetails.downloadLinks.windows, "_blank")}
                            >
                              Download for Windows
                              <Download className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => window.open(deviceDetails.downloadLinks.mac, "_blank")}
                            >
                              Download for macOS
                              <Download className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full space-y-2">
                            <Button
                              className="w-full"
                              onClick={() => window.open(deviceDetails.downloadLinks.android, "_blank")}
                            >
                              Download for Android
                              <Download className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => window.open(deviceDetails.downloadLinks.ios, "_blank")}
                            >
                              Download for iOS
                              <Download className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Features</CardTitle>
                        <CardDescription>What makes {platform.title} stand out</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {platform.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            window.open(
                              key === "mt5"
                                ? "https://www.metatrader5.com/en/terminal/help"
                                : "https://www.metatrader4.com/en/trading-platform/help",
                              "_blank",
                            )
                          }
                        >
                          View Documentation
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  {/* Update the mobile section to use type checking */}
                  {deviceType === "mobile" && deviceDetails.type === "mobile" && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg mt-6">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                          <a
                            href={deviceDetails.downloadLinks.ios}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:opacity-80"
                          >
                            <img src="/placeholder.svg?height=40&width=120" alt="App Store" className="h-10" />
                            <span className="text-xs text-muted-foreground mt-1">iOS App Store</span>
                          </a>
                        </div>
                        <div className="flex flex-col items-center">
                          <a
                            href={deviceDetails.downloadLinks.android}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:opacity-80"
                          >
                            <img src="/placeholder.svg?height=40&width=120" alt="Google Play" className="h-10" />
                            <span className="text-xs text-muted-foreground mt-1">Google Play</span>
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Scan QR code or search for "{platform.title}" in app stores
                        </span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  {key === "mt5" ? <MT5Logo className="h-6 w-6" /> : <MT4Logo className="h-6 w-6" />}
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    New to {platform.title}? Follow our step-by-step guide to set up your trading environment.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(
                        key === "mt5"
                          ? "https://www.metatrader5.com/en/terminal/help/start_advanced/installation"
                          : "https://www.metatrader4.com/en/trading-platform/help/start/installation",
                        "_blank",
                      )
                    }
                  >
                    View Guide
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  {key === "mt5" ? <MT5Logo className="h-6 w-6" /> : <MT4Logo className="h-6 w-6" />}
                  <CardTitle className="text-lg">Video Tutorials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Watch our comprehensive video tutorials to master {platform.title} features.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(
                        key === "mt5"
                          ? "https://www.youtube.com/playlist?list=PLltlMLQ7OLeLZpxDnCMKz1tivLMQTX9Ps"
                          : "https://www.youtube.com/playlist?list=PLltlMLQ7OLeKMxPEMAQiYIbthg1IsTgGz",
                        "_blank",
                      )
                    }
                  >
                    Watch Videos
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  {key === "mt5" ? <MT5Logo className="h-6 w-6" /> : <MT4Logo className="h-6 w-6" />}
                  <CardTitle className="text-lg">Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Need help with {platform.title}? Our support team is available 24/7 to assist you.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open("https://www.mql5.com/en/forum", "_blank")}
                  >
                    Contact Support
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <MT4Logo className="h-8 w-8" />
            <span className="text-lg font-semibold">vs</span>
            <MT5Logo className="h-8 w-8" />
          </div>
          <div>
            <CardTitle>Platform Comparison</CardTitle>
            <CardDescription>Compare features between MetaTrader 4 and MetaTrader 5</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <MT4Logo className="h-5 w-5" />
                      <span>MetaTrader 4</span>
                    </div>
                  </th>
                  <th className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <MT5Logo className="h-5 w-5" />
                      <span>MetaTrader 5</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Trading Assets</td>
                  <td className="text-center py-3 px-4">Forex, CFDs</td>
                  <td className="text-center py-3 px-4">Forex, CFDs, Stocks, Futures</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Timeframes</td>
                  <td className="text-center py-3 px-4">9</td>
                  <td className="text-center py-3 px-4">21</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Technical Indicators</td>
                  <td className="text-center py-3 px-4">30</td>
                  <td className="text-center py-3 px-4">38</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Graphical Objects</td>
                  <td className="text-center py-3 px-4">31</td>
                  <td className="text-center py-3 px-4">44</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Order Types</td>
                  <td className="text-center py-3 px-4">4</td>
                  <td className="text-center py-3 px-4">6</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Economic Calendar</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Market Depth</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Programming Language</td>
                  <td className="text-center py-3 px-4">MQL4</td>
                  <td className="text-center py-3 px-4">MQL5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <MT4Logo className="h-6 w-6" />
            <MT5Logo className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Trading Account Details</CardTitle>
            <CardDescription>Your Quantis FX trading account credentials</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MT5Logo className="h-5 w-5" />
                <h3 className="font-medium">Live Account</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Login ID:</span>
                  <span className="text-sm font-medium">7654321</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Server:</span>
                  <span className="text-sm font-medium">Quantis FX-Live</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Password:</span>
                  <span className="text-sm font-medium">••••••••</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MT4Logo className="h-5 w-5" />
                <h3 className="font-medium">Demo Account</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Login ID:</span>
                  <span className="text-sm font-medium">9876543</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Server:</span>
                  <span className="text-sm font-medium">Quantis FX-Demo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Password:</span>
                  <span className="text-sm font-medium">••••••••</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
