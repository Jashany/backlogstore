'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ShoppingCart,
  Search,
  Calendar,
  User,
  Package,
} from 'lucide-react';
import { AdminAuthService } from '@/lib/admin-auth';

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  items: any[];
}

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

const statusStyles: Record<string, string> = {
  PENDING: 'bg-zinc-700 text-zinc-300',
  CONFIRMED: 'bg-zinc-700 text-white',
  PROCESSING: 'bg-zinc-700 text-white',
  SHIPPED: 'bg-zinc-700 text-white',
  DELIVERED: 'bg-white text-black',
  CANCELLED: 'bg-zinc-800 text-zinc-500',
  REFUNDED: 'bg-zinc-800 text-zinc-500',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const token = AdminAuthService.getToken();
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/orders`;

      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber('');
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      const token = AdminAuthService.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/orders/${selectedOrder.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            trackingNumber: trackingNumber || undefined,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchOrders();
        setIsDialogOpen(false);
        alert('Order status updated successfully!');
      } else {
        alert(data.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-zinc-400 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-zinc-950">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Orders</h1>
        <p className="text-sm text-zinc-500">View and manage customer orders</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="border-b border-zinc-800">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 w-full focus:border-zinc-600"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(null)}
                className={filterStatus === null ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-400'}
              >
                All
              </Button>
              {ORDER_STATUSES.map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-400'}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">No orders found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">#{order.orderNumber}</h3>
                          <Badge className={statusStyles[order.status] || statusStyles.PENDING}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.user.firstName} {order.user.lastName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {order.items.length} items
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold text-white">
                          ${parseFloat(order.totalAmount).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openUpdateDialog(order)}
                        className="bg-white hover:bg-zinc-200 text-black"
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Update Order Status</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update the status for order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Order Status *</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status} className="text-white hover:bg-zinc-700">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Tracking Number (Optional)</Label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                disabled={isUpdating || !newStatus}
                className="bg-white hover:bg-zinc-200 text-black"
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <p>Showing {filteredOrders.length} of {orders.length} orders</p>
      </div>
    </div>
  );
}
