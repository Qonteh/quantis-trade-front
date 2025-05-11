"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/UserContext"
import { Share, Copy, CheckCircle, Gift, Users, TrendingUp, RefreshCw, BarChart2, UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ReferralData {
  code: string
  url: string
  totalReferrals: number
  activeReferrals: number
  pendingReferrals: number
  earnings: number
  commission: string
  referralStats: {
    month: string
    referrals: number
    earnings: number
  }[]
  referrals: {
    id: number
    email: string
    status: string
    date: string
    earnings: number
  }[]
}

// Mock data generator function
const getMockReferralData = (userId: string): ReferralData => {
  const userIdHash = userId ? userId.split("").reduce((a, b) => a + b.charCodeAt(0), 0) : 12345
  const referralCode = `REF${userIdHash}`

  const mockMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const mockReferralStats = mockMonths.map((month, i) => {
    const base = (i + 1) * 2
    return {
      month,
      referrals: base,
      earnings: base * 50,
    }
  })

  const mockReferrals = Array.from({ length: 5 }, (_, i) => {
    const statusOptions = ["active", "pending", "active", "active", "expired"]
    return {
      id: 1000 + i,
      email: `user${i + 1}@example.com`,
      status: statusOptions[i],
      date: new Date(Date.now() - i * 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      earnings: (i + 1) * 25,
    }
  })

  return {
    code: referralCode,
    url: `https://${import.meta.env.VITE_BROKER_NAME || "quantisfx"}.com/register?ref=${referralCode}`,
    totalReferrals: mockReferrals.length,
    activeReferrals: mockReferrals.filter((r) => r.status === "active").length,
    pendingReferrals: mockReferrals.filter((r) => r.status === "pending").length,
    earnings: mockReferrals.reduce((sum, r) => sum + r.earnings, 0),
    commission: "20%",
    referralStats: mockReferralStats,
    referrals: mockReferrals,
  }
}

const ReferPage: React.FC = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, fetch from API
      // const response = await TradingService.getReferralData();
      // setReferralData(response.data);

      // Using mock data for now
      setTimeout(() => {
        setReferralData(getMockReferralData(user?.id.toString() || ""))
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching referral data:", error)
      setIsLoading(false)

      // Fallback to mock data on error
      setReferralData(getMockReferralData(user?.id.toString() || ""))
    }
  }

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true)
        toast({
          title: "Copied!",
          description: message,
        })

        setTimeout(() => {
          setCopySuccess(false)
        }, 3000)
      },
      (err) => {
        console.error("Failed to copy text: ", err)
        toast({
          title: "Copy failed",
          description: "Please try again",
          variant: "destructive",
        })
      },
    )
  }

  const handleShareReferral = async () => {
    if (!referralData) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${import.meta.env.VITE_BROKER_NAME || "Quantis"} Trading`,
          text: `Sign up for ${import.meta.env.VITE_BROKER_NAME || "Quantis"} using my referral link and get a bonus!`,
          url: referralData.url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
        copyToClipboard(referralData.url, "Referral link copied to clipboard!")
      }
    } else {
      copyToClipboard(referralData.url, "Referral link copied to clipboard!")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Simplified Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.jpg" alt="Logo" className="h-12 w-auto" />
            <span className="ml-3 text-sm font-medium text-gray-800">Referral Program</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs flex items-center text-gray-600 hover:text-gray-900"
            onClick={fetchReferralData}
            disabled={isLoading}
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        <div className="mb-5">
          <h1 className="text-base font-medium text-gray-800">Referral Program</h1>
          <p className="text-xs text-gray-500 mt-0.5">Invite friends and earn rewards</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 mx-auto animate-spin border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-600">Loading referral data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Referral Link Card */}
            <div className="md:col-span-1 space-y-5">
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-purple-50 flex items-center justify-center mr-2">
                      <Gift className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <CardTitle className="text-sm font-medium text-gray-800">Your Referral Link</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-500">
                    Share this link with friends to earn rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-md p-3 mb-4 border border-purple-100">
                    <div className="mb-3">
                      <Label htmlFor="referralCode" className="text-xs text-purple-700">
                        Your Unique Code
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="referralCode"
                          value={referralData?.code || ""}
                          readOnly
                          className="rounded-r-none h-8 text-xs bg-white border-purple-200"
                        />
                        <Button
                          className="rounded-l-none h-8 bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800 border border-purple-200"
                          onClick={() => copyToClipboard(referralData?.code || "", "Referral code copied!")}
                        >
                          {copySuccess ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="referralLink" className="text-xs text-purple-700">
                        Referral Link
                      </Label>
                      <div className="flex mt-1">
                        <Input
                          id="referralLink"
                          value={referralData?.url || ""}
                          readOnly
                          className="rounded-r-none h-8 text-xs bg-white border-purple-200"
                        />
                        <Button
                          className="rounded-l-none h-8 bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800 border border-purple-200"
                          onClick={() => copyToClipboard(referralData?.url || "", "Referral link copied!")}
                        >
                          {copySuccess ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-9 text-xs bg-purple-600 hover:bg-purple-700"
                    onClick={handleShareReferral}
                  >
                    <Share className="mr-1.5 h-3.5 w-3.5" />
                    Share Your Referral Link
                  </Button>

                  {/* Referral Program Info */}
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-xs font-medium mb-2 text-gray-700">How It Works</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="bg-purple-100 rounded-full h-4 w-4 flex items-center justify-center text-purple-700 text-[10px] font-medium mt-0.5 mr-2">
                          1
                        </div>
                        <p className="text-[10px] text-gray-600">Share your unique referral link with friends</p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-100 rounded-full h-4 w-4 flex items-center justify-center text-purple-700 text-[10px] font-medium mt-0.5 mr-2">
                          2
                        </div>
                        <p className="text-[10px] text-gray-600">Friends sign up and make a qualifying deposit</p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-100 rounded-full h-4 w-4 flex items-center justify-center text-purple-700 text-[10px] font-medium mt-0.5 mr-2">
                          3
                        </div>
                        <p className="text-[10px] text-gray-600">
                          You earn {referralData?.commission} commission on their trading fees
                        </p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Referral Stats Card */}
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-purple-50 flex items-center justify-center mr-2">
                      <BarChart2 className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <CardTitle className="text-sm font-medium text-gray-800">Referral Statistics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-50 p-2.5 rounded-md text-center border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-1">Total Referrals</p>
                      <p className="text-base font-semibold text-gray-800">{referralData?.totalReferrals || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-md text-center border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-1">Active</p>
                      <p className="text-base font-semibold text-green-600">{referralData?.activeReferrals || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-md text-center border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-1">Pending</p>
                      <p className="text-base font-semibold text-amber-600">{referralData?.pendingReferrals || 0}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-md border border-green-100 mb-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-green-800">Total Earnings</p>
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                        <p className="text-sm font-semibold text-green-700">
                          {formatCurrency(referralData?.earnings || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Monthly Performance</h4>
                    <div className="space-y-2.5">
                      {referralData?.referralStats.map((stat, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-gray-700">{stat.month}</span>
                            <span className="text-gray-500">{stat.referrals} referrals</span>
                          </div>
                          <Progress
                            value={(stat.referrals / 12) * 100}
                            className="h-1"
                            indicatorClassName={
                              stat.referrals > 8 ? "bg-green-500" : stat.referrals > 4 ? "bg-blue-500" : "bg-purple-500"
                            }
                          />
                          <div className="text-right text-[10px] text-green-600 font-medium">
                            {formatCurrency(stat.earnings)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referred Users & Marketing Materials */}
            <div className="md:col-span-2 space-y-5">
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-purple-50 flex items-center justify-center mr-2">
                      <Users className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <CardTitle className="text-sm font-medium text-gray-800">Your Referred Users</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-500">Track your referrals and earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  {referralData?.referrals && referralData.referrals.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px] text-[10px] text-gray-500">User</TableHead>
                            <TableHead className="text-[10px] text-gray-500">Status</TableHead>
                            <TableHead className="text-[10px] text-gray-500">Date</TableHead>
                            <TableHead className="text-right text-[10px] text-gray-500">Earnings</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {referralData.referrals.map((referral) => (
                            <TableRow key={referral.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <UserPlus className="h-3 w-3 mr-1.5 text-gray-400" />
                                  <span className="text-xs">{referral.email}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    referral.status === "active"
                                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-[9px]"
                                      : referral.status === "pending"
                                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-[9px]"
                                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 text-[9px]"
                                  }
                                >
                                  {referral.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs">{referral.date}</TableCell>
                              <TableCell className="text-right font-medium text-green-600 text-xs">
                                {formatCurrency(referral.earnings)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
                      <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-sm font-medium text-gray-600">No Referrals Yet</h3>
                      <p className="text-xs text-gray-500 mt-1 mb-4">Share your referral link to start earning</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShareReferral}
                        className="text-xs h-8 border-gray-200"
                      >
                        <Share className="mr-1.5 h-3 w-3" />
                        Share Link
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Marketing Materials */}
              <Card className="border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-purple-50 flex items-center justify-center mr-2">
                      <Gift className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <CardTitle className="text-sm font-medium text-gray-800">Marketing Materials</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-500">
                    Resources to help you promote your referral link
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="banners">
                    <TabsList className="grid w-full grid-cols-3 h-8 bg-gray-100 p-0.5">
                      <TabsTrigger
                        value="banners"
                        className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                      >
                        Banners
                      </TabsTrigger>
                      <TabsTrigger
                        value="emails"
                        className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                      >
                        Email Templates
                      </TabsTrigger>
                      <TabsTrigger
                        value="text"
                        className="text-xs data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                      >
                        Text Content
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="banners" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-gray-100 rounded-md p-2 shadow-sm">
                          <div className="aspect-[3/1] bg-purple-600 rounded-md flex items-center justify-center">
                            <div className="text-white text-center">
                              <p className="text-xs font-bold">Join {import.meta.env.VITE_BROKER_NAME || "Quantis"}!</p>
                              <p className="text-[10px]">Trade Smarter Today</p>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                              <Copy className="h-3 w-3 mr-1.5" />
                              Copy Code
                            </Button>
                          </div>
                        </div>
                        <div className="border border-gray-100 rounded-md p-2 shadow-sm">
                          <div className="aspect-[3/1] bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                            <div className="text-white text-center">
                              <p className="text-xs font-bold">Get Trading Bonus</p>
                              <p className="text-[10px]">Sign Up with My Link</p>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                              <Copy className="h-3 w-3 mr-1.5" />
                              Copy Code
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="h-7 text-[10px] border-gray-200">
                          View More Banners
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="emails" className="mt-4">
                      <div className="border border-gray-100 rounded-md p-3 shadow-sm">
                        <h3 className="text-xs font-medium mb-2 text-gray-700">Invitation Email</h3>
                        <div className="bg-gray-50 p-3 rounded-md text-[10px] leading-relaxed border border-gray-100">
                          <p>Hi there,</p>
                          <p className="mt-2">
                            I've been trading with {import.meta.env.VITE_BROKER_NAME || "Quantis"} and thought you might
                            be interested too. They offer great trading conditions, low spreads, and a user-friendly
                            platform.
                          </p>
                          <p className="mt-2">If you sign up using my referral link below, we both get benefits!</p>
                          <p className="mt-2 text-purple-600 font-medium">{referralData?.url}</p>
                          <p className="mt-2">Let me know if you have any questions about the platform.</p>
                          <p className="mt-2">Best regards,</p>
                          <p>{user?.firstName || "Your Name"}</p>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] border-gray-200"
                            onClick={() =>
                              copyToClipboard(
                                `Hi there,\n\nI've been trading with ${
                                  import.meta.env.VITE_BROKER_NAME || "Quantis"
                                } and thought you might be interested too. They offer great trading conditions, low spreads, and a user-friendly platform.\n\nIf you sign up using my referral link below, we both get benefits!\n\n${
                                  referralData?.url
                                }\n\nLet me know if you have any questions about the platform.\n\nBest regards,\n${
                                  user?.firstName || "Your Name"
                                }`,
                                "Email template copied!",
                              )
                            }
                          >
                            <Copy className="h-3 w-3 mr-1.5" />
                            Copy Template
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="text" className="mt-4 space-y-4">
                      <div className="border border-gray-100 rounded-md p-3 shadow-sm">
                        <h3 className="text-xs font-medium mb-2 text-gray-700">Social Media Post</h3>
                        <div className="bg-gray-50 p-3 rounded-md text-[10px] leading-relaxed border border-gray-100">
                          <p>
                            🚀 I've been loving my trading experience with{" "}
                            {import.meta.env.VITE_BROKER_NAME || "Quantis"}! If you're looking to get into forex
                            trading, use my referral link to get started and we'll both benefit! {referralData?.url}{" "}
                            #Trading #Forex #Investment
                          </p>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] border-gray-200"
                            onClick={() =>
                              copyToClipboard(
                                `🚀 I've been loving my trading experience with ${
                                  import.meta.env.VITE_BROKER_NAME || "Quantis"
                                }! If you're looking to get into forex trading, use my referral link to get started and we'll both benefit! ${
                                  referralData?.url
                                } #Trading #Forex #Investment`,
                                "Social media text copied!",
                              )
                            }
                          >
                            <Copy className="h-3 w-3 mr-1.5" />
                            Copy Text
                          </Button>
                        </div>
                      </div>

                      <div className="border border-gray-100 rounded-md p-3 shadow-sm">
                        <h3 className="text-xs font-medium mb-2 text-gray-700">WhatsApp/Messenger</h3>
                        <div className="bg-gray-50 p-3 rounded-md text-[10px] leading-relaxed border border-gray-100">
                          <p>
                            Hey! I thought you might be interested in this trading platform I'm using. If you sign up
                            with my link, you'll get some nice bonuses: {referralData?.url}
                          </p>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] border-gray-200"
                            onClick={() =>
                              copyToClipboard(
                                `Hey! I thought you might be interested in this trading platform I'm using. If you sign up with my link, you'll get some nice bonuses: ${referralData?.url}`,
                                "Messenger text copied!",
                              )
                            }
                          >
                            <Copy className="h-3 w-3 mr-1.5" />
                            Copy Text
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ReferPage
