'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Package,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { AdminAuthService } from '@/lib/admin-auth';

interface DashboardStats {
  totalSales: string;
  newOrders: number;
  newUsers: number;
  pendingReviews: number;
  lowStockProducts: number;
  totalProducts: number;
  totalCustomers: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await AdminAuthService.authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/dashboard/stats`
      );

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-zinc-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${parseFloat(stats?.totalSales || '0').toLocaleString()}`,
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'Orders',
      value: stats?.newOrders || 0,
      subtitle: 'Last 30 days',
      change: '+8.2%',
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: 'Customers',
      value: stats?.totalCustomers || 0,
      subtitle: 'Total registered',
      change: '+15.3%',
      isPositive: true,
      icon: Users,
    },
    {
      title: 'Products',
      value: stats?.totalProducts || 0,
      subtitle: 'Active listings',
      icon: Package,
    },
  ];

  const alertCards = [
    {
      title: 'Pending Reviews',
      value: stats?.pendingReviews || 0,
      icon: Star,
      color: 'text-zinc-400',
    },
    {
      title: 'Low Stock',
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-zinc-400',
    },
    {
      title: 'New Users',
      value: stats?.newUsers || 0,
      icon: TrendingUp,
      color: 'text-zinc-400',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-zinc-950">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-zinc-500">Welcome back to your admin panel</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
                <div className="rounded-md bg-zinc-800 p-2">
                  <stat.icon className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-white mb-1">
                  {stat.value}
                </div>
                {stat.change && (
                  <div className="flex items-center gap-1 text-xs">
                    {stat.isPositive ? (
                      <ArrowUp className="h-3 w-3 text-white" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-zinc-500" />
                    )}
                    <span className={stat.isPositive ? 'text-white' : 'text-zinc-500'}>
                      {stat.change}
                    </span>
                    {stat.subtitle && (
                      <span className="text-zinc-500">· {stat.subtitle}</span>
                    )}
                  </div>
                )}
                {!stat.change && stat.subtitle && (
                  <p className="text-xs text-zinc-500">{stat.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {alertCards.map((card, index) => (
          <Card
            key={index}
            className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">{card.title}</p>
                  <p className="text-2xl font-semibold text-white">{card.value}</p>
                </div>
                <div className="rounded-md bg-zinc-800 p-2.5">
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="text-white text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-zinc-800 p-2 mt-0.5">
                <ShoppingCart className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">New order received</p>
                <p className="text-xs text-zinc-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-zinc-800 p-2 mt-0.5">
                <Users className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">New user registered</p>
                <p className="text-xs text-zinc-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-zinc-800 p-2 mt-0.5">
                <Star className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">New review submitted</p>
                <p className="text-xs text-zinc-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-zinc-800 p-2 mt-0.5">
                <Package className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">Product updated</p>
                <p className="text-xs text-zinc-500">2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="text-white text-base font-medium">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Conversion Rate</span>
                <span className="text-white font-medium">3.2%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Average Order Value</span>
                <span className="text-white font-medium">$127.50</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Customer Retention</span>
                <span className="text-white font-medium">68%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Stock Availability</span>
                <span className="text-white font-medium">92%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: '92%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
