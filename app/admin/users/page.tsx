'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Search,
  Calendar,
  ShoppingBag,
  Star,
  Mail,
  Eye,
} from 'lucide-react';
import { AdminAuthService } from '@/lib/admin-auth';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
    reviews: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = AdminAuthService.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.backlogstore.in/api'}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-zinc-400 text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-zinc-950">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Users</h1>
        <p className="text-sm text-zinc-500">Manage registered customers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Total Users</p>
                <p className="text-2xl font-semibold text-white">{users.length}</p>
              </div>
              <div className="rounded-md bg-zinc-800 p-2.5">
                <Users className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Total Orders</p>
                <p className="text-2xl font-semibold text-white">
                  {users.reduce((sum, user) => sum + user._count.orders, 0)}
                </p>
              </div>
              <div className="rounded-md bg-zinc-800 p-2.5">
                <ShoppingBag className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Total Reviews</p>
                <p className="text-2xl font-semibold text-white">
                  {users.reduce((sum, user) => sum + user._count.reviews, 0)}
                </p>
              </div>
              <div className="rounded-md bg-zinc-800 p-2.5">
                <Star className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">No users found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-white p-2.5 w-10 h-10 flex items-center justify-center">
                        <span className="text-black font-semibold text-sm">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className="bg-white text-black">
                          {user._count.orders} orders
                        </Badge>
                        <div className="text-xs text-zinc-500 mt-1">
                          {user._count.reviews} reviews
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <p>Showing {filteredUsers.length} of {users.length} users</p>
      </div>
    </div>
  );
}
