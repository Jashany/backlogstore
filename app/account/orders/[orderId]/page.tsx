'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderService, Order, OrderStatus } from '@/lib/services/order-service';
import { formatPrice } from '@/lib/utils/format-price';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = parseInt(params.orderId as string);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await OrderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Order not found');
      router.push('/account/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsCancelling(true);

    try {
      const result = await OrderService.cancelOrder(orderId);

      if (result.success) {
        toast.success('Order cancelled successfully');
        await loadOrder(); // Reload order
      } else {
        toast.error(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500',
      CONFIRMED: 'text-blue-500 bg-blue-500/10 border-blue-500',
      PROCESSING: 'text-purple-500 bg-purple-500/10 border-purple-500',
      SHIPPED: 'text-cyan-500 bg-cyan-500/10 border-cyan-500',
      DELIVERED: 'text-green-500 bg-green-500/10 border-green-500',
      CANCELLED: 'text-red-500 bg-red-500/10 border-red-500',
      REFUNDED: 'text-orange-500 bg-orange-500/10 border-orange-500',
    };

    return colors[status] || 'text-zinc-500 bg-zinc-500/10 border-zinc-500';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 border-2 border-white border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const canCancel = OrderService.canCancelOrder(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase text-white mb-2">
              Order #{order.orderNumber}
            </h1>
            <p className="text-zinc-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </p>
          </div>

          <span
            className={`px-4 py-2 text-sm font-bold uppercase border-2 ${getStatusColor(
              order.status
            )}`}
          >
            {OrderService.getStatusText(order.status)}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="border-2 border-white/10 bg-zinc-950 p-6">
        <h2 className="text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Items
        </h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
              <div className="w-20 h-20 bg-zinc-800 border border-white/10 flex-shrink-0">
                {item.productImageUrl && (
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold uppercase text-white text-sm">
                  {item.productName}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {item.variantSize && `Size: ${item.variantSize}`}
                  {item.variantColor && ` • Color: ${item.variantColor}`}
                </p>
                <p className="text-xs text-zinc-500 mt-1">SKU: {item.variantSku}</p>
                <p className="text-sm text-zinc-400 mt-2">
                  Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-white">
                  {formatPrice(
                    (parseFloat(item.priceAtPurchase) * item.quantity).toString()
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t-2 border-white/10 mt-4">
          <div className="flex justify-between text-xl">
            <span className="font-black uppercase text-white">Total</span>
            <span className="font-black text-white">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border-2 border-white/10 bg-zinc-950 p-6">
        <h2 className="text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </h2>

        <div className="text-zinc-400 text-sm space-y-1">
          <p className="text-white font-bold">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.phoneNumber}</p>
        </div>
      </div>

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="border-2 border-white/10 bg-zinc-950 p-6">
          <h2 className="text-lg font-bold uppercase text-white mb-4">
            Tracking Information
          </h2>
          <p className="text-zinc-400 text-sm">
            Tracking Number:{' '}
            <span className="text-white font-mono">{order.trackingNumber}</span>
          </p>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="border-2 border-white/10 bg-zinc-950 p-6">
          <h2 className="text-lg font-bold uppercase text-white mb-4">Order Notes</h2>
          <p className="text-zinc-400 text-sm">{order.notes}</p>
        </div>
      )}

      {/* Actions */}
      {canCancel && (
        <div className="border-2 border-red-500/20 bg-red-500/5 p-6">
          <h3 className="text-sm font-bold uppercase text-white mb-2">Need to cancel?</h3>
          <p className="text-zinc-400 text-sm mb-4">
            You can cancel your order while it's still being processed.
          </p>
          <Button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            variant="outline"
            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold uppercase"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        </div>
      )}
    </div>
  );
}
