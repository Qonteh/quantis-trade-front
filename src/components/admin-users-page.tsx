
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, UserCheck, Mail, Phone, MapPin, Calendar, RefreshCw, Search, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminService } from '../services/api';
import Navigation from './Navigation';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string;
  is_verified: boolean;
  role: string;
  wallet_balance: number;
  demo_balance: number;
  account_status: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getUsers();
      
      if (response.success) {
        setUsers(response.data);
      } else {
        throw new Error(response.error);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (userId: string) => {
    try {
      const response = await AdminService.verifyUser(userId);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "User verified successfully",
        });
        fetchUsers(); // Refresh the data
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify user",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-2">View and manage all registered clients</p>
          </div>
          <Button 
            onClick={fetchUsers} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-gray-600">Total Clients</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.is_verified).length}
                  </p>
                  <p className="text-sm text-gray-600">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
            <CardDescription>
              Detailed information about all registered clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4">Loading clients...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No clients found matching your search' : 'No clients found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Info</TableHead>
                      <TableHead>Contact Details</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead>Balances</TableHead>
                      <TableHead>Registration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                            {user.role === 'admin' && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                {user.country_code}{user.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-2">
                            <Badge 
                              variant={user.is_verified ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {user.is_verified ? "✓ Verified" : "⚠ Unverified"}
                            </Badge>
                            <div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.account_status)}`}>
                                {user.account_status}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="font-medium">Live: </span>
                              <span className="text-green-600">
                                ${user.wallet_balance?.toLocaleString() || '0.00'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Demo: </span>
                              <span className="text-blue-600">
                                ${user.demo_balance?.toLocaleString() || '0.00'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                            {formatDate(user.created_at)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex space-x-2">
                            {!user.is_verified && (
                              <Button
                                size="sm"
                                onClick={() => verifyUser(user.id)}
                                variant="outline"
                                className="text-xs"
                              >
                                Verify
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedUser(user)}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Detail Modal/Panel could be added here */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Client Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4"
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                      <p><strong>Phone:</strong> {selectedUser.country_code}{selectedUser.phone}</p>
                      <p><strong>Role:</strong> {selectedUser.role}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Account Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Status:</strong> {selectedUser.account_status}</p>
                      <p><strong>Verified:</strong> {selectedUser.is_verified ? 'Yes' : 'No'}</p>
                      <p><strong>Live Balance:</strong> ${selectedUser.wallet_balance?.toLocaleString()}</p>
                      <p><strong>Demo Balance:</strong> ${selectedUser.demo_balance?.toLocaleString()}</p>
                      <p><strong>Registered:</strong> {formatDate(selectedUser.created_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
