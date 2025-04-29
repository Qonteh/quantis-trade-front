"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  LineChart,
  CandlestickChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
  Filter,
  Star,
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2,
  ArrowRight,
  BarChart,
  Layers,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// Mock data for market instruments
const marketInstruments = [
  {
    id: 1,
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    bid: 1.0876,
    ask: 1.0878,
    spread: 0.0002,
    change: 0.05,
    trend: "up",
    category: "forex",
    favorite: true,
  },
  {
    id: 2,
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    bid: 1.2543,
    ask: 1.2546,
    spread: 0.0003,
    change: -0.12,
    trend: "down",
    category: "forex",
    favorite: false,
  },
  {
    id: 3,
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    bid: 153.67,
    ask: 153.7,
    spread: 0.03,
    change: 0.23,
    trend: "up",
    category: "forex",
    favorite: true,
  },
  {
    id: 4,
    symbol: "BTC/USD",
    name: "Bitcoin / US Dollar",
    bid: 63245.78,
    ask: 63275.32,
    spread: 29.54,
    change: 1.87,
    trend: "up",
    category: "crypto",
    favorite: true,
  },
  {
    id: 5,
    symbol: "ETH/USD",
    name: "Ethereum / US Dollar",
    bid: 3045.67,
    ask: 3048.21,
    spread: 2.54,
    change: 2.34,
    trend: "up",
    category: "crypto",
    favorite: false,
  },
  {
    id: 6,
    symbol: "AAPL",
    name: "Apple Inc.",
    bid: 175.23,
    ask: 175.25,
    spread: 0.02,
    change: -0.45,
    trend: "down",
    category: "stocks",
    favorite: false,
  },
  {
    id: 7,
    symbol: "MSFT",
    name: "Microsoft Corporation",
    bid: 402.56,
    ask: 402.6,
    spread: 0.04,
    change: 0.78,
    trend: "up",
    category: "stocks",
    favorite: false,
  },
  {
    id: 8,
    symbol: "GOLD",
    name: "Gold",
    bid: 2306.45,
    ask: 2307.15,
    spread: 0.7,
    change: 0.32,
    trend: "up",
    category: "commodities",
    favorite: true,
  },
]

// Mock data for open positions
const openPositions = [
  {
    id: 1,
    symbol: "EUR/USD",
    type: "Buy",
    openPrice: 1.0845,
    currentPrice: 1.0876,
    size: 0.5,
    openTime: "2025-04-25T14:30:00",
    profit: 155.0,
    profitPercentage: 1.43,
    sl: 1.08,
    tp: 1.09,
  },
  {
    id: 2,
    symbol: "BTC/USD",
    type: "Sell",
    openPrice: 64500.25,
    currentPrice: 63245.78,
    size: 0.02,
    openTime: "2025-04-26T10:15:00",
    profit: 250.89,
    profitPercentage: 1.95,
    sl: 65000.0,
    tp: 62000.0,
  },
  {
    id: 3,
    symbol: "GOLD",
    type: "Buy",
    openPrice: 2290.75,
    currentPrice: 2306.45,
    size: 0.1,
    openTime: "2025-04-26T11:45:00",
    profit: 156.7,
    profitPercentage: 0.68,
    sl: 2270.0,
    tp: 2350.0,
  },
]

// Mock data for order history
const orderHistory = [
  {
    id: 1,
    symbol: "EUR/USD",
    type: "Buy",
    openPrice: 1.082,
    closePrice: 1.0865,
    size: 0.5,
    openTime: "2025-04-20T09:30:00",
    closeTime: "2025-04-22T15:45:00",
    profit: 225.0,
    profitPercentage: 0.42,
    status: "Closed",
  },
  {
    id: 2,
    symbol: "GBP/USD",
    type: "Sell",
    openPrice: 1.258,
    closePrice: 1.253,
    size: 0.3,
    openTime: "2025-04-21T11:15:00",
    closeTime: "2025-04-23T14:20:00",
    profit: 150.0,
    profitPercentage: 0.4,
    status: "Closed",
  },
  {
    id: 3,
    symbol: "USD/JPY",
    type: "Buy",
    openPrice: 153.2,
    closePrice: 153.1,
    size: 0.4,
    openTime: "2025-04-22T10:30:00",
    closeTime: "2025-04-22T16:45:00",
    profit: -40.0,
    profitPercentage: -0.07,
    status: "Closed",
  },
  {
    id: 4,
    symbol: "BTC/USD",
    type: "Buy",
    openPrice: 61500.25,
    closePrice: 63200.5,
    size: 0.01,
    openTime: "2025-04-19T08:15:00",
    closeTime: "2025-04-24T09:30:00",
    profit: 170.25,
    profitPercentage: 2.76,
    status: "Closed",
  },
]

// Mock data for account summary
const accountSummary = {
  balance: 5250.75,
  equity: 6250.75,
  margin: 120.5,
  freeMargin: 6130.25,
  marginLevel: 5187.34,
  profitToday: 562.59,
  profitPercentage: 10.72,
}

// Type definitions for chart data
interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Generate historical price data for charts
const generateHistoricalData = (symbol: string, days = 30, interval = "1h"): CandleData[] => {
  const now = new Date()
  const data: CandleData[] = []
  let basePrice
  let volatility

  // Set base price and volatility based on symbol
  switch (symbol) {
    case "EUR/USD":
      basePrice = 1.08
      volatility = 0.0005
      break
    case "GBP/USD":
      basePrice = 1.25
      volatility = 0.0008
      break
    case "USD/JPY":
      basePrice = 153.5
      volatility = 0.05
      break
    case "BTC/USD":
      basePrice = 60000
      volatility = 500
      break
    case "ETH/USD":
      basePrice = 3000
      volatility = 50
      break
    case "AAPL":
      basePrice = 175
      volatility = 0.5
      break
    case "MSFT":
      basePrice = 400
      volatility = 1
      break
    case "GOLD":
      basePrice = 2300
      volatility = 5
      break
    default:
      basePrice = 100
      volatility = 1
  }

  // Calculate interval in milliseconds
  let intervalMs
  switch (interval) {
    case "1m":
      intervalMs = 60 * 1000
      break
    case "5m":
      intervalMs = 5 * 60 * 1000
      break
    case "15m":
      intervalMs = 15 * 60 * 1000
      break
    case "30m":
      intervalMs = 30 * 60 * 1000
      break
    case "1h":
      intervalMs = 60 * 60 * 1000
      break
    case "4h":
      intervalMs = 4 * 60 * 60 * 1000
      break
    case "1d":
      intervalMs = 24 * 60 * 60 * 1000
      break
    case "1w":
      intervalMs = 7 * 24 * 60 * 60 * 1000
      break
    default:
      intervalMs = 60 * 60 * 1000 // Default to 1h
  }

  // Calculate number of data points
  const totalIntervals = (days * 24 * 60 * 60 * 1000) / intervalMs

  // Generate data
  let price = basePrice
  for (let i = 0; i < totalIntervals; i++) {
    const time = new Date(now.getTime() - (totalIntervals - i) * intervalMs)

    // Random price movement with trend
    const trend = Math.sin(i / (totalIntervals / (Math.PI * 4))) * volatility * 0.5
    const random = (Math.random() - 0.5) * volatility
    price = price + trend + random

    // Ensure price doesn't go negative
    if (price <= 0) price = basePrice * 0.1

    // Calculate OHLC values
    const open = price
    const high = price * (1 + Math.random() * 0.002)
    const low = price * (1 - Math.random() * 0.002)
    const close = price * (1 + (Math.random() - 0.5) * 0.001)

    data.push({
      time: time.getTime() / 1000,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000) + 100,
    })

    // Update price for next interval
    price = close
  }

  return data
}

// Generate real-time price updates
const generateRealtimeUpdate = (lastCandle: CandleData, symbol: string): CandleData => {
  let volatility

  // Set volatility based on symbol
  switch (symbol) {
    case "EUR/USD":
      volatility = 0.0002
      break
    case "GBP/USD":
      volatility = 0.0003
      break
    case "USD/JPY":
      volatility = 0.02
      break
    case "BTC/USD":
      volatility = 50
      break
    case "ETH/USD":
      volatility = 10
      break
    case "AAPL":
      volatility = 0.2
      break
    case "MSFT":
      volatility = 0.3
      break
    case "GOLD":
      volatility = 1
      break
    default:
      volatility = 0.001
  }

  const lastClose = lastCandle.close
  const change = (Math.random() - 0.5) * volatility
  const newPrice = lastClose + change

  // Update the candle
  const updatedCandle = { ...lastCandle }

  if (newPrice > updatedCandle.high) {
    updatedCandle.high = newPrice
  }
  if (newPrice < updatedCandle.low) {
    updatedCandle.low = newPrice
  }
  updatedCandle.close = newPrice

  return updatedCandle
}

// Format currency
const formatCurrency = (value: number, currency = "USD", minimumFractionDigits = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value)
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Format percentage
const formatPercentage = (value: number) => {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
}

// Format price
const formatPrice = (value: number, minimumFractionDigits = 4) => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  })
}

export default function TradePage() {
  const [activeTab, setActiveTab] = useState("market-watch")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedInstrument, setSelectedInstrument] = useState(marketInstruments[0])
  const [chartType, setChartType] = useState("candles")
  const [timeframe, setTimeframe] = useState("1h")
  const [orderType, setOrderType] = useState("market")
  const [orderDirection, setOrderDirection] = useState("buy")
  const [orderSize, setOrderSize] = useState("0.01")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [isChartFullscreen, setIsChartFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [chartData, setChartData] = useState<CandleData[]>([])
  const [instruments, setInstruments] = useState(marketInstruments)
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 300 })
  const [isHovering, setIsHovering] = useState(false)
  const [hoverData, setHoverData] = useState<{ x: number; price: number; time: Date } | null>(null)

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)

  // Filter instruments based on search query and category
  const filteredInstruments = instruments.filter((instrument) => {
    const matchesSearch =
      searchQuery === "" ||
      instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instrument.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === "all" || instrument.category === filterCategory

    return matchesSearch && matchesCategory
  })

  // Initialize chart dimensions
  useEffect(() => {
    if (chartContainerRef.current) {
      const updateDimensions = () => {
        if (chartContainerRef.current) {
          setChartDimensions({
            width: chartContainerRef.current.clientWidth,
            height: 300,
          })
        }
      }

      updateDimensions()
      window.addEventListener("resize", updateDimensions)

      return () => {
        window.removeEventListener("resize", updateDimensions)
      }
    }
  }, [])

  // Load initial chart data
  useEffect(() => {
    if (selectedInstrument) {
      const data = generateHistoricalData(selectedInstrument.symbol, 30, timeframe)
      setChartData(data)
    }
  }, [selectedInstrument, timeframe])

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0 || chartDimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = chartDimensions.width
    canvas.height = chartDimensions.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate min and max values for scaling
    const prices = chartData.flatMap((candle) => [candle.high, candle.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    // Add some padding to the price range
    const paddedMinPrice = minPrice - priceRange * 0.05
    const paddedMaxPrice = maxPrice + priceRange * 0.05
    const paddedPriceRange = paddedMaxPrice - paddedMinPrice

    // Calculate scaling factors
    const xScale = canvas.width / (chartData.length - 1)
    const yScale = canvas.height / paddedPriceRange

    // Draw background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 1

    // Horizontal grid lines
    const numHorizontalLines = 5
    for (let i = 0; i <= numHorizontalLines; i++) {
      const y = i * (canvas.height / numHorizontalLines)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()

      // Price labels
      const price = paddedMaxPrice - (i / numHorizontalLines) * paddedPriceRange
      ctx.fillStyle = "#888888"
      ctx.font = "10px Arial"
      ctx.textAlign = "left"
      ctx.fillText(price.toFixed(4), 5, y - 5)
    }

    // Vertical grid lines
    const numVerticalLines = 6
    for (let i = 0; i <= numVerticalLines; i++) {
      const x = i * (canvas.width / numVerticalLines)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()

      // Time labels
      if (i < numVerticalLines) {
        const dataIndex = Math.floor((i / numVerticalLines) * chartData.length)
        const time = new Date(chartData[dataIndex].time * 1000)
        const timeLabel = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        ctx.fillStyle = "#888888"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(timeLabel, x, canvas.height - 5)
      }
    }

    // Draw chart based on chart type
    if (chartType === "line") {
      // Line chart
      ctx.strokeStyle = "#7C3AED"
      ctx.lineWidth = 2
      ctx.beginPath()

      chartData.forEach((candle, i) => {
        const x = i * xScale
        const y = canvas.height - (candle.close - paddedMinPrice) * yScale

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    } else if (chartType === "candles") {
      // Candlestick chart
      chartData.forEach((candle, i) => {
        const x = i * xScale
        const candleWidth = Math.max(xScale * 0.8, 1)

        const openY = canvas.height - (candle.open - paddedMinPrice) * yScale
        const closeY = canvas.height - (candle.close - paddedMinPrice) * yScale
        const highY = canvas.height - (candle.high - paddedMinPrice) * yScale
        const lowY = canvas.height - (candle.low - paddedMinPrice) * yScale

        // Draw wick
        ctx.strokeStyle = candle.close >= candle.open ? "#26a69a" : "#ef5350"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, highY)
        ctx.lineTo(x, lowY)
        ctx.stroke()

        // Draw candle body
        ctx.fillStyle = candle.close >= candle.open ? "#26a69a" : "#ef5350"
        const candleHeight = Math.abs(closeY - openY)
        const candleY = Math.min(openY, closeY)

        ctx.fillRect(x - candleWidth / 2, candleY, candleWidth, candleHeight)
      })
    } else if (chartType === "bar") {
      // Bar chart
      chartData.forEach((candle, i) => {
        const x = i * xScale
        const barWidth = Math.max(xScale * 0.8, 1)

        const y = canvas.height - (candle.close - paddedMinPrice) * yScale
        const barHeight = canvas.height - y

        ctx.fillStyle = candle.close >= candle.open ? "#26a69a" : "#ef5350"
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight)
      })
    }

    // Draw hover info if hovering
    if (isHovering && hoverData) {
      const { x, price, time } = hoverData

      // Draw vertical line
      ctx.strokeStyle = "#7C3AED"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw horizontal line at price
      const y = canvas.height - (price - paddedMinPrice) * yScale
      ctx.strokeStyle = "#7C3AED"
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()

      // Draw price tooltip
      ctx.fillStyle = "#7C3AED"
      ctx.fillRect(canvas.width - 80, y - 10, 75, 20)
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(price.toFixed(4), canvas.width - 42.5, y + 4)

      // Draw time tooltip
      const timeLabel = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      ctx.fillStyle = "#7C3AED"
      ctx.fillRect(x - 40, canvas.height - 25, 80, 20)
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(timeLabel, x, canvas.height - 12)
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [chartData, chartDimensions, chartType, isHovering, hoverData])

  // Handle mouse move on chart
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || chartData.length === 0) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    // Calculate which data point we're hovering over
    const xScale = canvas.width / (chartData.length - 1)
    const dataIndex = Math.min(Math.floor(x / xScale), chartData.length - 1)

    // Get the price and time at this point
    const candle = chartData[dataIndex]
    const price = candle.close
    const time = new Date(candle.time * 1000)

    setIsHovering(true)
    setHoverData({ x: dataIndex * xScale, price, time })
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false)
    setHoverData(null)
  }

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (chartData.length === 0 || !selectedInstrument) return

      // Update instrument prices
      setInstruments((prevInstruments) => {
        return prevInstruments.map((instrument) => {
          // Generate random price changes
          const volatility =
            instrument.category === "crypto" ? 10 : instrument.category === "commodities" ? 0.5 : 0.0002
          const change = (Math.random() - 0.5) * volatility * 2
          const newBid = instrument.bid + change
          const newAsk = newBid + instrument.spread

          // Calculate new change percentage
          const newChangePerc = instrument.change + (Math.random() - 0.5) * 0.01

          return {
            ...instrument,
            bid: newBid,
            ask: newAsk,
            change: newChangePerc,
            trend: change >= 0 ? "up" : "down",
          }
        })
      })

      // Update chart data
      if (chartData.length > 0) {
        const lastCandle = { ...chartData[chartData.length - 1] }
        const updatedCandle = generateRealtimeUpdate(lastCandle, selectedInstrument.symbol)

        // Update the last candle in state
        setChartData((prevData) => {
          const newData = [...prevData]
          newData[newData.length - 1] = updatedCandle
          return newData
        })
      }

      // Update selected instrument if it's the one being viewed
      setSelectedInstrument((prev) => {
        const updated = instruments.find((i) => i.id === prev.id)
        return updated || prev
      })
    }, 1000) // Update every second

    return () => clearInterval(updateInterval)
  }, [chartData, selectedInstrument])

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Handle order submission
  const handleOrderSubmit = () => {
    // In a real app, this would submit the order to the backend
    console.log("Order submitted:", {
      symbol: selectedInstrument.symbol,
      type: orderDirection,
      orderType: orderType,
      size: orderSize,
      stopLoss: stopLoss,
      takeProfit: takeProfit,
    })
    // Reset form
    setStopLoss("")
    setTakeProfit("")
  }

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    // In a real app, this would update the backend
    setInstruments((prevInstruments) =>
      prevInstruments.map((instrument) =>
        instrument.id === id ? { ...instrument, favorite: !instrument.favorite } : instrument,
      ),
    )
  }

  // Calculate potential profit/loss
  const calculatePotential = () => {
    const size = Number.parseFloat(orderSize) || 0
    const direction = orderDirection === "buy" ? 1 : -1
    const entryPrice = orderDirection === "buy" ? selectedInstrument.ask : selectedInstrument.bid

    let slValue = 0
    let tpValue = 0

    if (stopLoss) {
      const slPrice = Number.parseFloat(stopLoss)
      slValue = direction * (slPrice - entryPrice) * size * 100000
    }

    if (takeProfit) {
      const tpPrice = Number.parseFloat(takeProfit)
      tpValue = direction * (tpPrice - entryPrice) * size * 100000
    }

    return { slValue, tpValue }
  }

  const potential = calculatePotential()

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* Main Content */}
      <main className="flex-1 p-3 md:p-6">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Trading Platform</h1>
              <p className="text-sm text-gray-500">Trade forex, cryptocurrencies, stocks, and commodities</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="flex items-center text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Refresh
              </Button>
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] h-8 text-xs">
                <Wallet className="h-3.5 w-3.5 mr-1.5" />
                Deposit Funds
              </Button>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Sidebar - Market Watch */}
            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                <CardHeader className="relative z-10 p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Market Watch</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-xs cursor-pointer">Show Favorites Only</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs cursor-pointer">Show Spreads</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs cursor-pointer">Show Change %</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs cursor-pointer">Reset View</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 p-3">
                  <div className="space-y-3">
                    {/* Search and Filter */}
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search instruments..."
                          className="pl-8 h-7 text-xs"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="h-7 text-xs w-[100px]">
                          <div className="flex items-center">
                            <Filter className="mr-1.5 h-3 w-3" />
                            <span className="truncate">
                              {filterCategory === "all"
                                ? "All"
                                : filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}
                            </span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="forex">Forex</SelectItem>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="stocks">Stocks</SelectItem>
                          <SelectItem value="commodities">Commodities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Instruments List */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="text-[10px] font-medium py-1.5 w-6"></TableHead>
                            <TableHead className="text-[10px] font-medium py-1.5">Symbol</TableHead>
                            <TableHead className="text-[10px] font-medium py-1.5 text-right">Bid</TableHead>
                            <TableHead className="text-[10px] font-medium py-1.5 text-right">Ask</TableHead>
                            <TableHead className="text-[10px] font-medium py-1.5 text-right">Change</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInstruments.length > 0 ? (
                            filteredInstruments.map((instrument) => (
                              <TableRow
                                key={instrument.id}
                                className={`hover:bg-gray-50 cursor-pointer ${
                                  selectedInstrument.id === instrument.id ? "bg-[#7C3AED]/5" : ""
                                }`}
                                onClick={() => setSelectedInstrument(instrument)}
                              >
                                <TableCell className="py-1 px-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(instrument.id)
                                    }}
                                  >
                                    <Star
                                      className={`h-3.5 w-3.5 ${
                                        instrument.favorite ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                      }`}
                                    />
                                  </Button>
                                </TableCell>
                                <TableCell className="py-1">
                                  <div>
                                    <p className="text-xs font-medium">{instrument.symbol}</p>
                                    <p className="text-[10px] text-gray-500">{instrument.name}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="py-1 text-right">
                                  <p className="text-xs">{formatPrice(instrument.bid)}</p>
                                </TableCell>
                                <TableCell className="py-1 text-right">
                                  <p className="text-xs">{formatPrice(instrument.ask)}</p>
                                </TableCell>
                                <TableCell className="py-1 text-right">
                                  <p className={`text-xs ${instrument.change > 0 ? "text-green-600" : "text-red-600"}`}>
                                    {formatPercentage(instrument.change)}
                                  </p>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                    <Search className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <p className="text-sm text-gray-500">No instruments found</p>
                                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Chart and Order Form */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Chart Card */}
                <Card
                  className={`border-none shadow-sm overflow-hidden ${isChartFullscreen ? "fixed inset-4 z-50" : ""}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                  <CardHeader className="relative z-10 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CardTitle className="text-sm">{selectedInstrument.symbol}</CardTitle>
                        <Badge
                          variant={selectedInstrument.trend === "up" ? "default" : "outline"}
                          className={`ml-2 ${
                            selectedInstrument.trend === "up"
                              ? "bg-green-500 hover:bg-green-600"
                              : "border-red-500 text-red-500 bg-red-50"
                          } text-[10px] px-1.5 py-0`}
                        >
                          {formatPercentage(selectedInstrument.change)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-0.5">
                          <Button
                            variant={chartType === "candles" ? "default" : "ghost"}
                            size="icon"
                            className={`h-6 w-6 ${chartType === "candles" ? "bg-[#7C3AED] hover:bg-[#6D28D9]" : ""}`}
                            onClick={() => setChartType("candles")}
                          >
                            <CandlestickChart className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant={chartType === "line" ? "default" : "ghost"}
                            size="icon"
                            className={`h-6 w-6 ${chartType === "line" ? "bg-[#7C3AED] hover:bg-[#6D28D9]" : ""}`}
                            onClick={() => setChartType("line")}
                          >
                            <LineChart className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant={chartType === "bar" ? "default" : "ghost"}
                            size="icon"
                            className={`h-6 w-6 ${chartType === "bar" ? "bg-[#7C3AED] hover:bg-[#6D28D9]" : ""}`}
                            onClick={() => setChartType("bar")}
                          >
                            <BarChart className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Select value={timeframe} onValueChange={setTimeframe}>
                          <SelectTrigger className="h-6 text-xs w-[60px]">
                            <span>{timeframe}</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1m">1m</SelectItem>
                            <SelectItem value="5m">5m</SelectItem>
                            <SelectItem value="15m">15m</SelectItem>
                            <SelectItem value="30m">30m</SelectItem>
                            <SelectItem value="1h">1h</SelectItem>
                            <SelectItem value="4h">4h</SelectItem>
                            <SelectItem value="1d">1D</SelectItem>
                            <SelectItem value="1w">1W</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setIsChartFullscreen(!isChartFullscreen)}
                        >
                          {isChartFullscreen ? (
                            <Minimize2 className="h-3.5 w-3.5" />
                          ) : (
                            <Maximize2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 p-3 pt-0">
                    {/* Chart Container */}
                    <div ref={chartContainerRef} className="bg-white border border-gray-100 rounded-lg h-[300px]">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                    </div>

                    {/* Price Information */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div className="bg-white p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Bid</p>
                        <p className="text-sm font-semibold mt-0.5">{formatPrice(selectedInstrument.bid)}</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Ask</p>
                        <p className="text-sm font-semibold mt-0.5">{formatPrice(selectedInstrument.ask)}</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Spread</p>
                        <p className="text-sm font-semibold mt-0.5">{formatPrice(selectedInstrument.spread, 5)}</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-medium text-gray-500">Change</p>
                        <p
                          className={`text-sm font-semibold mt-0.5 ${
                            selectedInstrument.change > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatPercentage(selectedInstrument.change)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Form */}
                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                  <CardHeader className="relative z-10 p-3">
                    <CardTitle className="text-sm">New Order</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-3 pt-0">
                    <div className="space-y-3">
                      {/* Order Type Selection */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="order-type" className="text-xs">
                            Order Type
                          </Label>
                          <Select value={orderType} onValueChange={setOrderType}>
                            <SelectTrigger id="order-type" className="h-8 text-xs">
                              <SelectValue placeholder="Select order type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="market">Market</SelectItem>
                              <SelectItem value="limit">Limit</SelectItem>
                              <SelectItem value="stop">Stop</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="order-size" className="text-xs">
                            Size (Lots)
                          </Label>
                          <Input
                            id="order-size"
                            type="number"
                            placeholder="0.01"
                            className="h-8 text-xs"
                            value={orderSize}
                            onChange={(e) => setOrderSize(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Buy/Sell Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          className={`h-10 ${
                            orderDirection === "buy"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setOrderDirection("buy")}
                        >
                          <TrendingUp className="h-4 w-4 mr-1.5" />
                          Buy
                          <span className="ml-1.5 text-xs opacity-90">{formatPrice(selectedInstrument.ask)}</span>
                        </Button>
                        <Button
                          className={`h-10 ${
                            orderDirection === "sell"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setOrderDirection("sell")}
                        >
                          <TrendingDown className="h-4 w-4 mr-1.5" />
                          Sell
                          <span className="ml-1.5 text-xs opacity-90">{formatPrice(selectedInstrument.bid)}</span>
                        </Button>
                      </div>

                      {/* Stop Loss / Take Profit */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="stop-loss" className="text-xs">
                            Stop Loss
                          </Label>
                          <div className="relative">
                            <Input
                              id="stop-loss"
                              type="number"
                              placeholder="Optional"
                              className="h-8 text-xs"
                              value={stopLoss}
                              onChange={(e) => setStopLoss(e.target.value)}
                            />
                            {stopLoss && (
                              <div className="absolute right-2 top-1.5">
                                <Badge
                                  variant="outline"
                                  className="border-red-500 text-red-500 bg-red-50 text-[10px] px-1.5 py-0"
                                >
                                  {formatCurrency(potential.slValue, "USD")}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="take-profit" className="text-xs">
                            Take Profit
                          </Label>
                          <div className="relative">
                            <Input
                              id="take-profit"
                              type="number"
                              placeholder="Optional"
                              className="h-8 text-xs"
                              value={takeProfit}
                              onChange={(e) => setTakeProfit(e.target.value)}
                            />
                            {takeProfit && (
                              <div className="absolute right-2 top-1.5">
                                <Badge
                                  variant="outline"
                                  className="border-green-500 text-green-500 bg-green-50 text-[10px] px-1.5 py-0"
                                >
                                  {formatCurrency(potential.tpValue, "USD")}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Order Value:</span>
                          <span className="text-xs font-medium">
                            {formatCurrency(Number.parseFloat(orderSize) * selectedInstrument.ask * 100, "USD")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Commission:</span>
                          <span className="text-xs font-medium">{formatCurrency(0.7, "USD")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Required Margin:</span>
                          <span className="text-xs font-medium">
                            {formatCurrency(Number.parseFloat(orderSize) * selectedInstrument.ask, "USD")}
                          </span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        className={`w-full ${
                          orderDirection === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                        }`}
                        onClick={handleOrderSubmit}
                      >
                        {orderDirection === "buy" ? (
                          <>
                            <TrendingUp className="h-4 w-4 mr-1.5" />
                            Buy {selectedInstrument.symbol}
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 mr-1.5" />
                            Sell {selectedInstrument.symbol}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Sidebar - Account Info and Positions */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* Account Summary */}
                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
                  <CardHeader className="relative z-10 p-3 pb-0">
                    <CardTitle className="text-sm">Account Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Balance:</span>
                        <span className="text-sm font-medium">{formatCurrency(accountSummary.balance, "USD")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Equity:</span>
                        <span className="text-sm font-medium">{formatCurrency(accountSummary.equity, "USD")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Margin:</span>
                        <span className="text-sm font-medium">{formatCurrency(accountSummary.margin, "USD")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Free Margin:</span>
                        <span className="text-sm font-medium">{formatCurrency(accountSummary.freeMargin, "USD")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Margin Level:</span>
                        <span className="text-sm font-medium">{accountSummary.marginLevel.toFixed(2)}%</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Today's P/L:</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(accountSummary.profitToday, "USD")} (
                          {formatPercentage(accountSummary.profitPercentage)})
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Positions Tab */}
                <Tabs defaultValue="open-positions" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-3">
                    <TabsTrigger value="open-positions" className="text-xs">
                      Open Positions
                    </TabsTrigger>
                    <TabsTrigger value="order-history" className="text-xs">
                      Order History
                    </TabsTrigger>
                  </TabsList>

                  {/* Open Positions Tab */}
                  <TabsContent value="open-positions">
                    <Card className="border-none shadow-sm overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                      <CardContent className="relative z-10 p-3">
                        {openPositions.length > 0 ? (
                          <div className="space-y-3">
                            {openPositions.map((position) => (
                              <div
                                key={position.id}
                                className="bg-white p-2 rounded-lg border border-gray-100 hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 transition-colors"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center">
                                    <Badge
                                      className={`mr-2 ${
                                        position.type === "Buy"
                                          ? "bg-green-600 hover:bg-green-700"
                                          : "bg-red-600 hover:bg-red-700"
                                      } text-[10px] px-1.5 py-0`}
                                    >
                                      {position.type}
                                    </Badge>
                                    <span className="text-xs font-medium">{position.symbol}</span>
                                  </div>
                                  <span
                                    className={`text-xs font-medium ${
                                      position.profit > 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                  >
                                    {formatCurrency(position.profit, "USD")}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] text-gray-500">
                                    {position.size} lots @ {formatPrice(position.openPrice)}
                                  </span>
                                  <span
                                    className={`text-[10px] ${position.profit > 0 ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {formatPercentage(position.profitPercentage)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-gray-500">
                                  <span>SL: {position.sl ? formatPrice(position.sl) : "None"}</span>
                                  <span>TP: {position.tp ? formatPrice(position.tp) : "None"}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                              <Layers className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">No open positions</p>
                            <p className="text-xs text-gray-400 mt-1">Your positions will appear here</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Order History Tab */}
                  <TabsContent value="order-history">
                    <Card className="border-none shadow-sm overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
                      <CardContent className="relative z-10 p-3">
                        {orderHistory.length > 0 ? (
                          <div className="space-y-3">
                            {orderHistory.map((order) => (
                              <div
                                key={order.id}
                                className="bg-white p-2 rounded-lg border border-gray-100 hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 transition-colors"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center">
                                    <Badge
                                      className={`mr-2 ${
                                        order.type === "Buy"
                                          ? "bg-green-600 hover:bg-green-700"
                                          : "bg-red-600 hover:bg-red-700"
                                      } text-[10px] px-1.5 py-0`}
                                    >
                                      {order.type}
                                    </Badge>
                                    <span className="text-xs font-medium">{order.symbol}</span>
                                  </div>
                                  <span
                                    className={`text-xs font-medium ${
                                      order.profit > 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                  >
                                    {formatCurrency(order.profit, "USD")}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] text-gray-500">
                                    {order.size} lots @ {formatPrice(order.openPrice)} → {formatPrice(order.closePrice)}
                                  </span>
                                  <span
                                    className={`text-[10px] ${order.profit > 0 ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {formatPercentage(order.profitPercentage)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-gray-500">
                                  <span>{formatDate(order.openTime)}</span>
                                  <ArrowRight className="h-3 w-3" />
                                  <span>{formatDate(order.closeTime)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                              <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">No order history</p>
                            <p className="text-xs text-gray-400 mt-1">Your closed orders will appear here</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
