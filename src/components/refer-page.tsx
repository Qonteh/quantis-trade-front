
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Users, DollarSign, Trophy, Share2, Gift, CheckCircle, Clock, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navigation from "./Navigation"

interface ReferralData {
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  pendingEarnings: number
  referralCode: string
  referralLink: string
  recentReferrals: Array<{
    id: string
    email: string
    joinDate: string
    status: string
    earnings: number
  }>
  commissionHistory: Array<{
    id: string
    type: string
    amount: number
    date: string
    status: string
  }>
}

const ReferPage: React.FC = () => {
  const { toast } = useToast()
  const [referralData, setReferralData] = useState<ReferralData>({
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 2450.50,
    pendingEarnings: 150.00,
    referralCode: "QFX-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    referralLink: "",
    recentReferrals: [
      {
        id: "1",
        email: "john.doe@example.com",
        joinDate: "2024-01-15",
        status: "Active",
        earnings: 250.00
      },
      {
        id: "2", 
        email: "jane.smith@example.com",
        joinDate: "2024-01-10",
        status: "Pending",
        earnings: 0.00
      }
    ],
    commissionHistory: [
      {
        id: "1",
        type: "Registration Bonus",
        amount: 50.00,
        date: "2024-01-15",
        status: "Paid"
      },
      {
        id: "2",
        type: "Trading Commission",
        amount: 125.50,
        date: "2024-01-12",
        status: "Paid"
      }
    ]
  })

  useEffect(() => {
    const baseUrl = window.location.origin
    setReferralData(prev => ({
      ...prev,
      referralLink: `${baseUrl}/register?ref=${prev.referralCode}`
    }))
  }, [])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
        variant: "default",
      })
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually",
        variant: "destructive",
      })
    })
  }

  const shareOptions = [
    { name: "WhatsApp", icon: Share2, action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Join Quantis FX with my referral link: ${referralData.referralLink}`)}`) },
    { name: "Telegram", icon: Share2, action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralData.referralLink)}&text=${encodeURIComponent('Join Quantis FX with my referral link')}`) },
    { name: "Twitter", icon: Share2, action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join Quantis FX with my referral link: ${referralData.referralLink}`)}`) },
    { name: "Facebook", icon: Share2, action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.referralLink)}`) }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
          <p className="text-gray-600 mt-2">Earn commissions by referring new traders to Quantis FX</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralData.totalReferrals}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">↗</span>
                +2 this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralData.activeReferrals}</div>
              <div className="text-xs text-gray-500">
                {Math.round((referralData.activeReferrals / referralData.totalReferrals) * 100)}% conversion rate
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${referralData.totalEarnings.toLocaleString()}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">↗</span>
                +$125 this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${referralData.pendingEarnings.toLocaleString()}</div>
              <div className="text-xs text-gray-500">
                Will be paid next cycle
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Tools */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5" />
                  Your Referral Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="referral-code" className="text-sm font-medium">Referral Code</Label>
                  <div className="flex mt-1">
                    <Input
                      id="referral-code"
                      value={referralData.referralCode}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button
                      size="sm"
                      className="ml-2"
                      onClick={() => copyToClipboard(referralData.referralCode, "Referral code")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="referral-link" className="text-sm font-medium">Referral Link</Label>
                  <div className="flex mt-1">
                    <Input
                      id="referral-link"
                      value={referralData.referralLink}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button
                      size="sm"
                      className="ml-2"
                      onClick={() => copyToClipboard(referralData.referralLink, "Referral link")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Share on Social Media</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {shareOptions.map((option) => (
                      <Button
                        key={option.name}
                        variant="outline"
                        size="sm"
                        onClick={option.action}
                        className="justify-start"
                      >
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Commission Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Registration Bonus</p>
                      <p className="text-sm text-green-600">When someone signs up</p>
                    </div>
                    <div className="text-lg font-bold text-green-800">$50</div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">Trading Commission</p>
                      <p className="text-sm text-blue-600">From their trading volume</p>
                    </div>
                    <div className="text-lg font-bold text-blue-800">15%</div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-800">Deposit Bonus</p>
                      <p className="text-sm text-purple-600">When they make first deposit</p>
                    </div>
                    <div className="text-lg font-bold text-purple-800">$25</div>
                  </div>
                </div>

                {/* Monthly Progress */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Monthly Progress</span>
                    <span className="text-sm text-gray-600">8/15 referrals</span>
                  </div>
                  <Progress 
                    value={(8/15) * 100} 
                    className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    7 more referrals to unlock Gold tier (20% commission)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Referral Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="referrals" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="referrals">Recent Referrals</TabsTrigger>
                    <TabsTrigger value="commissions">Commission History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="referrals" className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Earnings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referralData.recentReferrals.map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell className="font-medium">{referral.email}</TableCell>
                            <TableCell>{new Date(referral.joinDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={referral.status === 'Active' ? 'default' : 'secondary'}>
                                {referral.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">${referral.earnings.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="commissions" className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referralData.commissionHistory.map((commission) => (
                          <TableRow key={commission.id}>
                            <TableCell className="font-medium">{commission.type}</TableCell>
                            <TableCell>${commission.amount.toFixed(2)}</TableCell>
                            <TableCell>{new Date(commission.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={commission.status === 'Paid' ? 'default' : 'secondary'}>
                                {commission.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Referral Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Share Your Experience</h3>
                <p className="text-sm text-blue-600">
                  Tell your friends about your positive trading experience with Quantis FX
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Use Social Media</h3>
                <p className="text-sm text-green-600">
                  Share your referral link on social media platforms to reach more people
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Help Them Start</h3>
                <p className="text-sm text-purple-600">
                  Guide your referrals through the registration and verification process
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ReferPage
