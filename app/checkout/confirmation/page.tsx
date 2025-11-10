'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { OrderService, Order } from '@/lib/services/order-service';
import { formatPrice } from '@/lib/utils/format-price';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder(parseInt(orderId));
    }
  }, [orderId]);

  const loadOrder = async (id: number) => {
    try {
      const data = await OrderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-white border-r-transparent mb-4" />
            <p className="text-zinc-500 uppercase font-bold text-sm">Loading order...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-500 text-lg mb-6">Order not found</p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
              Order Confirmed!
            </h1>

            <p className="text-xl text-zinc-400 mb-2">
              Thank you for your order
            </p>

            <p className="text-zinc-500">
              Order #{order.orderNumber}
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Items */}
            <div className="border-2 border-white/10 bg-zinc-950 p-6">
              <h2 className="text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
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
                      <p className="font-bold uppercase text-white text-sm truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {item.variantSize && `Size: ${item.variantSize}`}
                        {item.variantColor && ` • Color: ${item.variantColor}`}
                      </p>
                      <p className="text-sm text-zinc-400 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-white">
                        {formatPrice(item.priceAtPurchase)}
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
              <h2 className="text-lg font-bold uppercase text-white mb-4">
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                asChild
                className="flex-1 h-14 border-2 border-white/20 text-white hover:border-white hover:bg-white/5 font-bold uppercase"
              >
                <Link href="/account/orders">
                  View All Orders
                </Link>
              </Button>

              <Button
                asChild
                className="flex-1 h-14 bg-white text-black hover:bg-zinc-200 font-black uppercase"
              >
                <Link href="/shop">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Email Confirmation Note */}
            <p className="text-center text-sm text-zinc-600">
              A confirmation email has been sent to your email address.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-black">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-white border-r-transparent mb-4" />
            <p className="text-zinc-500 uppercase font-bold text-sm">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
