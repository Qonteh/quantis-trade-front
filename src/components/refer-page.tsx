"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Copy, Share2, Gift, Award, ChevronRight, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function ReferPage() {
  const [copied, setCopied] = useState(false)

  // Sample referral data
  const referralCode = "JOHN25"
  const referralLink = "https://quantisfx.com/register?ref=JOHN25"

  const referralStats = {
    totalReferrals: 5,
    pendingReferrals: 2,
    completedReferrals: 3,
    totalEarnings: 150.0,
    pendingEarnings: 100.0,
  }

  const referralHistory = [
    {
      id: 1,
      name: "Alex Smith",
      email: "alex.s@example.com",
      status: "Completed",
      date: "2025-04-15T14:30:00",
      reward: 50.0,
    },
    {
      id: 2,
      name: "Maria Johnson",
      email: "maria.j@example.com",
      status: "Completed",
      date: "2025-04-10T10:15:00",
      reward: 50.0,
    },
    {
      id: 3,
      name: "James Wilson",
      email: "james.w@example.com",
      status: "Completed",
      date: "2025-04-05T16:45:00",
      reward: 50.0,
    },
    {
      id: 4,
      name: "Sarah Brown",
      email: "sarah.b@example.com",
      status: "Pending",
      date: "2025-04-20T09:30:00",
      reward: 50.0,
    },
    {
      id: 5,
      name: "Robert Davis",
      email: "robert.d@example.com",
      status: "Pending",
      date: "2025-04-22T11:20:00",
      reward: 50.0,
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Quantis FX",
        text: "Sign up for Quantis FX using my referral code and get a bonus!",
        url: referralLink,
      })
    }
  }

  const handleNavigation = (path: string) => {
    window.location.href = path
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#9D6FFF]/20 to-[#7C3AED]/20 flex items-center justify-center mr-3">
            <Users className="h-5 w-5 text-[#7C3AED]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Refer Friends</h1>
            <p className="text-sm text-gray-500">Invite friends and earn rewards</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5 h-9 text-sm rounded-lg"
          onClick={() => handleNavigation("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Referral Program Overview */}
      <Card className="border-none shadow-sm mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
        <CardHeader className="relative z-10 p-4">
          <CardTitle className="text-lg">Referral Program</CardTitle>
          <CardDescription>Earn $50 for each friend who joins and deposits</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 mb-4">
                <p className="text-sm font-medium mb-2">Your Referral Code</p>
                <div className="flex items-center">
                  <Input value={referralCode} readOnly className="bg-gray-50 border-gray-200" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
                    onClick={() => copyToClipboard(referralCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm font-medium mb-2">Your Referral Link</p>
                <div className="flex items-center">
                  <Input value={referralLink} readOnly className="bg-gray-50 border-gray-200 text-xs" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5"
                    onClick={() => copyToClipboard(referralLink)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] h-9 text-sm rounded-lg"
                  onClick={shareReferral}
                >
                  <Share2 className="mr-1.5 h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5 h-9 text-sm rounded-lg"
                >
                  <Mail className="mr-1.5 h-4 w-4" />
                  Email Invite
                </Button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium mb-3">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-medium text-[#7C3AED]">1</span>
                  </div>
                  <p className="text-sm text-gray-600">Share your unique referral code or link with friends</p>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-medium text-[#7C3AED]">2</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your friend signs up and makes a qualifying deposit of $500 or more
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-medium text-[#7C3AED]">3</span>
                  </div>
                  <p className="text-sm text-gray-600">You both receive a $50 bonus credited to your accounts</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-[#7C3AED]/2 to-transparent rounded-xl"></div>
          <CardHeader className="relative z-10 p-4 pb-2">
            <CardTitle className="text-sm text-gray-700">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-4 pt-0">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mr-3">
                <Gift className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(referralStats.totalEarnings)}</p>
                <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-blue-500/2 to-transparent rounded-xl"></div>
          <CardHeader className="relative z-10 p-4 pb-2">
            <CardTitle className="text-sm text-gray-700">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-4 pt-0">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{referralStats.totalReferrals}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {referralStats.completedReferrals} completed, {referralStats.pendingReferrals} pending
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-amber-500/2 to-transparent rounded-xl"></div>
          <CardHeader className="relative z-10 p-4 pb-2">
            <CardTitle className="text-sm text-gray-700">Pending Earnings</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-4 pt-0">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(referralStats.pendingEarnings)}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral History */}
      <Card className="border-none shadow-sm mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/50 to-transparent rounded-xl"></div>
        <CardHeader className="relative z-10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Referral History</CardTitle>
              <CardDescription>Your referred friends</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 p-4 pt-0">
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-xs font-medium py-2">Name</TableHead>
                  <TableHead className="text-xs font-medium py-2">Email</TableHead>
                  <TableHead className="text-xs font-medium py-2">Date</TableHead>
                  <TableHead className="text-xs font-medium py-2">Status</TableHead>
                  <TableHead className="text-xs font-medium py-2 text-right">Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralHistory.map((referral) => (
                  <TableRow key={referral.id} className="hover:bg-gray-50">
                    <TableCell className="py-2 text-sm font-medium">{referral.name}</TableCell>
                    <TableCell className="py-2 text-sm">{referral.email}</TableCell>
                    <TableCell className="py-2 text-sm">{formatDate(referral.date)}</TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className={
                          referral.status === "Completed"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-amber-500 text-amber-600 bg-amber-50"
                        }
                      >
                        <span className="text-xs">{referral.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm font-medium">
                      {referral.status === "Completed" ? (
                        formatCurrency(referral.reward)
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Invite More Friends */}
      <Card className="border-none shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 via-[#7C3AED]/5 to-transparent rounded-xl"></div>
        <CardContent className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold text-gray-800">Invite More Friends</h3>
              <p className="text-sm text-gray-600 mt-1">The more friends you invite, the more rewards you earn!</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] h-9 text-sm rounded-lg">
                <MessageSquare className="mr-1.5 h-4 w-4" />
                Message Friends
              </Button>
              <Button
                variant="outline"
                className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/5 h-9 text-sm rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
                View Leaderboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
