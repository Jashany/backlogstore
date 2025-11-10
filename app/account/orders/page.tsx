'use client';

import { useState, useEffect } from 'react';
import { OrderService, Order, OrderStatus } from '@/lib/services/order-service';
import { formatPrice } from '@/lib/utils/format-price';
import { Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await OrderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
      CONFIRMED: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      PROCESSING: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      SHIPPED: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      DELIVERED: 'text-green-500 bg-green-500/10 border-green-500/20',
      CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
      REFUNDED: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    };

    return colors[status] || 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 border-2 border-white border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-16 w-16 text-zinc-700 mb-4" />
        <h2 className="text-2xl font-black uppercase text-zinc-500 mb-2">
          No Orders Yet
        </h2>
        <p className="text-zinc-600 mb-6">
          When you place orders, they'll appear here
        </p>
        <Button asChild className="bg-white text-black hover:bg-zinc-200 font-bold uppercase">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black uppercase text-white mb-1">Order History</h2>
          <p className="text-zinc-500 text-sm">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block border-2 border-white/10 hover:border-white/30 transition-colors p-6 bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <p className="font-bold uppercase text-white text-sm">
                    Order #{order.orderNumber}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-bold uppercase border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {OrderService.getStatusText(order.status)}
                  </span>
                </div>

                <p className="text-zinc-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <ChevronRight className="h-5 w-5 text-zinc-500 flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <p className="text-zinc-400 text-sm">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </p>
              <p className="font-bold text-white text-lg">{formatPrice(order.totalAmount)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
