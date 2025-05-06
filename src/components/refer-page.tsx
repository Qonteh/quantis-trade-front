
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { 
  Share, Copy, CheckCircle, Gift, Users, Loader, 
  TrendingUp, RefreshCw, BarChart2, UserPlus
} from "lucide-react";
import DashboardHeader from "./dashboard/dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TradingService } from "@/services/api";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ReferralData {
  code: string;
  url: string;
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  earnings: number;
  commission: string;
  referralStats: {
    month: string;
    referrals: number;
    earnings: number;
  }[];
  referrals: {
    id: number;
    email: string;
    status: string;
    date: string;
    earnings: number;
  }[];
}

// Mock data generator function
const getMockReferralData = (userId: string): ReferralData => {
  const userIdHash = userId ? userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 12345;
  const referralCode = `REF${userIdHash}`;
  
  const mockMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const mockReferralStats = mockMonths.map((month, i) => {
    const base = (i + 1) * 2;
    return {
      month,
      referrals: base,
      earnings: base * 50
    };
  });
  
  const mockReferrals = Array.from({length: 5}, (_, i) => {
    const statusOptions = ['active', 'pending', 'active', 'active', 'expired'];
    return {
      id: 1000 + i,
      email: `user${i + 1}@example.com`,
      status: statusOptions[i],
      date: new Date(Date.now() - (i * 15 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      earnings: (i + 1) * 25
    };
  });
  
  return {
    code: referralCode,
    url: `https://${import.meta.env.VITE_BROKER_NAME || 'quantisfx'}.com/register?ref=${referralCode}`,
    totalReferrals: mockReferrals.length,
    activeReferrals: mockReferrals.filter(r => r.status === 'active').length,
    pendingReferrals: mockReferrals.filter(r => r.status === 'pending').length,
    earnings: mockReferrals.reduce((sum, r) => sum + r.earnings, 0),
    commission: "20%",
    referralStats: mockReferralStats,
    referrals: mockReferrals
  };
};

const ReferPage: React.FC = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    fetchReferralData();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const fetchReferralData = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, fetch from API
      // const response = await TradingService.getReferralData();
      // setReferralData(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setReferralData(getMockReferralData(user?.id.toString() || ''));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      setIsLoading(false);
      
      // Fallback to mock data on error
      setReferralData(getMockReferralData(user?.id.toString() || ''));
    }
  };
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        toast({
          title: "Copied!",
          description: message,
        });
        
        setTimeout(() => {
          setCopySuccess(false);
        }, 3000);
      },
      (err) => {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Copy failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    );
  };
  
  const handleShareReferral = async () => {
    if (!referralData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${import.meta.env.VITE_BROKER_NAME || 'Quantis'} Trading`,
          text: `Sign up for ${import.meta.env.VITE_BROKER_NAME || 'Quantis'} using my referral link and get a bonus!`,
          url: referralData.url
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(referralData.url, "Referral link copied to clipboard!");
      }
    } else {
      copyToClipboard(referralData.url, "Referral link copied to clipboard!");
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar isMobile={isMobile} />
        
        <div className={`flex-1 ${!isMobile ? 'md:ml-64' : ''}`}>
          {/* Header */}
          <DashboardHeader
            marketData={[
              { pair: "EUR/USD", price: "1.0873", change: "-0.01%" },
              { pair: "GBP/USD", price: "1.2543", change: "-0.02%" },
              { pair: "USD/JPY", price: "153.6569", change: "+0.01%" },
              { pair: "BTC/USD", price: "63,154.43", change: "-0.03%" },
            ]}
            isMobile={isMobile}
          />

          {/* Page Title */}
          <div className="bg-white py-3 px-4 md:px-6 border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium">Referral Program</h2>
                <p className="text-xs text-gray-500">Invite friends and earn rewards</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex items-center"
                onClick={fetchReferralData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-3 w-3 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="relative">
                    <div className="h-16 w-16 mx-auto animate-spin border-4 border-[#7C3AED]/20 border-t-[#9D6FFF] rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-[#7C3AED]" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-600">Loading referral data...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Referral Link Card */}
                <div className="md:col-span-1 space-y-5">
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <Gift className="h-4 w-4 mr-2 text-[#7C3AED]" />
                        Your Referral Link
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Share this link with friends to earn rewards
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-md p-4 mb-4 border border-violet-100">
                        <div className="mb-3">
                          <Label htmlFor="referralCode" className="text-xs text-violet-700">Your Unique Code</Label>
                          <div className="flex mt-1">
                            <Input
                              id="referralCode"
                              value={referralData?.code || ""}
                              readOnly
                              className="rounded-r-none bg-white border-violet-200"
                            />
                            <Button 
                              className="rounded-l-none bg-violet-100 text-violet-700 hover:bg-violet-200 hover:text-violet-800 border border-violet-200"
                              onClick={() => copyToClipboard(referralData?.code || "", "Referral code copied!")}
                            >
                              {copySuccess ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="referralLink" className="text-xs text-violet-700">Referral Link</Label>
                          <div className="flex mt-1">
                            <Input
                              id="referralLink"
                              value={referralData?.url || ""}
                              readOnly
                              className="rounded-r-none text-xs bg-white border-violet-200"
                            />
                            <Button 
                              className="rounded-l-none bg-violet-100 text-violet-700 hover:bg-violet-200 hover:text-violet-800 border border-violet-200"
                              onClick={() => copyToClipboard(referralData?.url || "", "Referral link copied!")}
                            >
                              {copySuccess ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white"
                        onClick={handleShareReferral}
                      >
                        <Share className="mr-2 h-4 w-4" />
                        Share Your Referral Link
                      </Button>
                      
                      {/* Referral Program Info */}
                      <div className="mt-4 border-t pt-4">
                        <h3 className="text-sm font-medium mb-2">How It Works</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-violet-100 rounded-full h-5 w-5 flex items-center justify-center text-violet-700 text-xs font-medium mt-0.5 mr-2">1</div>
                            <p className="text-xs text-gray-600">Share your unique referral link with friends</p>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-violet-100 rounded-full h-5 w-5 flex items-center justify-center text-violet-700 text-xs font-medium mt-0.5 mr-2">2</div>
                            <p className="text-xs text-gray-600">Friends sign up and make a qualifying deposit</p>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-violet-100 rounded-full h-5 w-5 flex items-center justify-center text-violet-700 text-xs font-medium mt-0.5 mr-2">3</div>
                            <p className="text-xs text-gray-600">You earn {referralData?.commission} commission on their trading fees</p>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Referral Stats Card */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <BarChart2 className="h-4 w-4 mr-2 text-[#7C3AED]" />
                        Referral Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-gray-50 p-3 rounded-md text-center">
                          <p className="text-[10px] text-gray-500 mb-1">Total Referrals</p>
                          <p className="text-lg font-semibold text-gray-800">{referralData?.totalReferrals || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md text-center">
                          <p className="text-[10px] text-gray-500 mb-1">Active</p>
                          <p className="text-lg font-semibold text-green-600">{referralData?.activeReferrals || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md text-center">
                          <p className="text-[10px] text-gray-500 mb-1">Pending</p>
                          <p className="text-lg font-semibold text-amber-600">{referralData?.pendingReferrals || 0}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-md border border-green-100 mb-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-green-800">Total Earnings</p>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                            <p className="text-sm font-semibold text-green-700">{formatCurrency(referralData?.earnings || 0)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t mt-4 pt-4">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Monthly Performance</h4>
                        <div className="space-y-3">
                          {referralData?.referralStats.map((stat, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{stat.month}</span>
                                <span className="text-gray-500">{stat.referrals} referrals</span>
                              </div>
                              <Progress value={(stat.referrals / 12) * 100} className="h-1" />
                              <div className="text-right text-xs text-green-600 font-medium">
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
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <Users className="h-4 w-4 mr-2 text-[#7C3AED]" />
                        Your Referred Users
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Track your referrals and earnings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {referralData?.referrals && referralData.referrals.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Earnings</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {referralData.referrals.map((referral) => (
                                <TableRow key={referral.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center">
                                      <UserPlus className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                      <span className="text-xs">{referral.email}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={
                                      referral.status === 'active' 
                                        ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-[10px]' 
                                        : referral.status === 'pending'
                                          ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 text-[10px]'
                                          : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100 text-[10px]'
                                    }>
                                      {referral.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-xs">{referral.date}</TableCell>
                                  <TableCell className="text-right font-medium text-green-600">
                                    {formatCurrency(referral.earnings)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-sm font-medium text-gray-600">No Referrals Yet</h3>
                          <p className="text-xs text-gray-500 mt-1 mb-4">Share your referral link to start earning</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleShareReferral}
                            className="text-xs"
                          >
                            <Share className="mr-2 h-3.5 w-3.5" />
                            Share Link
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Marketing Materials */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center">
                        <Gift className="h-4 w-4 mr-2 text-[#7C3AED]" />
                        Marketing Materials
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Resources to help you promote your referral link
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="banners">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="banners" className="text-xs">Banners</TabsTrigger>
                          <TabsTrigger value="emails" className="text-xs">Email Templates</TabsTrigger>
                          <TabsTrigger value="text" className="text-xs">Text Content</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="banners" className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-md p-2">
                              <div className="aspect-[3/1] bg-[#7C3AED] rounded-md flex items-center justify-center">
                                <div className="text-white text-center">
                                  <p className="text-xs font-bold">Join {import.meta.env.VITE_BROKER_NAME || "Quantis"}!</p>
                                  <p className="text-[10px]">Trade Smarter Today</p>
                                </div>
                              </div>
                              <div className="flex justify-end mt-2">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <Copy className="h-3 w-3 mr-1.5" />
                                  Copy Code
                                </Button>
                              </div>
                            </div>
                            <div className="border rounded-md p-2">
                              <div className="aspect-[3/1] bg-gradient-to-r from-blue-600 to-violet-600 rounded-md flex items-center justify-center">
                                <div className="text-white text-center">
                                  <p className="text-xs font-bold">Get Trading Bonus</p>
                                  <p className="text-[10px]">Sign Up with My Link</p>
                                </div>
                              </div>
                              <div className="flex justify-end mt-2">
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  <Copy className="h-3 w-3 mr-1.5" />
                                  Copy Code
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              View More Banners
                            </Button>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="emails" className="mt-4">
                          <div className="border rounded-md p-4">
                            <h3 className="text-sm font-medium mb-2">Invitation Email</h3>
                            <div className="bg-gray-50 p-3 rounded-md text-xs leading-relaxed">
                              <p>Hi there,</p>
                              <p className="mt-2">
                                I've been trading with {import.meta.env.VITE_BROKER_NAME || "Quantis"} and thought you might be interested too. 
                                They offer great trading conditions, low spreads, and a user-friendly platform.
                              </p>
                              <p className="mt-2">
                                If you sign up using my referral link below, we both get benefits!
                              </p>
                              <p className="mt-2 text-[#7C3AED] font-medium">
                                {referralData?.url}
                              </p>
                              <p className="mt-2">
                                Let me know if you have any questions about the platform.
                              </p>
                              <p className="mt-2">Best regards,</p>
                              <p>{user?.firstName || "Your Name"}</p>
                            </div>
                            <div className="flex justify-end mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={() => copyToClipboard(
                                  `Hi there,\n\nI've been trading with ${import.meta.env.VITE_BROKER_NAME || "Quantis"} and thought you might be interested too. They offer great trading conditions, low spreads, and a user-friendly platform.\n\nIf you sign up using my referral link below, we both get benefits!\n\n${referralData?.url}\n\nLet me know if you have any questions about the platform.\n\nBest regards,\n${user?.firstName || "Your Name"}`,
                                  "Email template copied!"
                                )}
                              >
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                                Copy Template
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="text" className="mt-4 space-y-4">
                          <div className="border rounded-md p-4">
                            <h3 className="text-sm font-medium mb-2">Social Media Post</h3>
                            <div className="bg-gray-50 p-3 rounded-md text-xs leading-relaxed">
                              <p>
                                🚀 I've been loving my trading experience with {import.meta.env.VITE_BROKER_NAME || "Quantis"}! 
                                If you're looking to get into forex trading, use my referral link to get started and we'll both benefit! 
                                {referralData?.url} #Trading #Forex #Investment
                              </p>
                            </div>
                            <div className="flex justify-end mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={() => copyToClipboard(
                                  `🚀 I've been loving my trading experience with ${import.meta.env.VITE_BROKER_NAME || "Quantis"}! If you're looking to get into forex trading, use my referral link to get started and we'll both benefit! ${referralData?.url} #Trading #Forex #Investment`,
                                  "Social media text copied!"
                                )}
                              >
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                                Copy Text
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border rounded-md p-4">
                            <h3 className="text-sm font-medium mb-2">WhatsApp/Messenger</h3>
                            <div className="bg-gray-50 p-3 rounded-md text-xs leading-relaxed">
                              <p>
                                Hey! I thought you might be interested in this trading platform I'm using. 
                                If you sign up with my link, you'll get some nice bonuses: {referralData?.url}
                              </p>
                            </div>
                            <div className="flex justify-end mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={() => copyToClipboard(
                                  `Hey! I thought you might be interested in this trading platform I'm using. If you sign up with my link, you'll get some nice bonuses: ${referralData?.url}`,
                                  "Messenger text copied!"
                                )}
                              >
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
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
      </div>
    </div>
  );
};

export default ReferPage;
