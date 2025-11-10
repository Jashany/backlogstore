'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/cart/cart-item';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils/format-price';
import { ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, subtotal, isLoading } = useCart();
  const router = useRouter();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    setUpdatingItemId(itemId);
    await updateQuantity(itemId, quantity);
    setUpdatingItemId(null);
  };

  const handleRemove = async (itemId: number) => {
    setUpdatingItemId(itemId);
    await removeItem(itemId);
    setUpdatingItemId(null);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const isEmpty = !cart || cart.items.length === 0;
  const SHIPPING_THRESHOLD = 75;
  const subtotalNum = parseFloat(subtotal);
  const needsForFreeShipping = SHIPPING_THRESHOLD - subtotalNum;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b-2 border-white/10">
          <div className="container mx-auto max-w-7xl px-4 py-12">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">
              Shopping Cart
            </h1>
            <p className="text-zinc-500 font-medium">
              {cart?.totalItems || 0} {cart?.totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-12">
          {isEmpty ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingCart className="h-24 w-24 text-zinc-800 mb-6" />
              <h2 className="text-3xl font-black uppercase text-zinc-500 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-zinc-600 mb-8 max-w-md">
                Looks like you haven't added anything yet. Start shopping to fill it up!
              </p>
              <Button
                size="lg"
                asChild
                className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-bold uppercase border-2 border-white"
              >
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="border-2 border-white/10 bg-zinc-950 p-6">
                  <div className="divide-y divide-white/10">
                    {cart.items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemove}
                        isUpdating={updatingItemId === item.id}
                      />
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/shop"
                    className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors font-bold uppercase"
                  >
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border-2 border-white/10 bg-zinc-950 p-6 sticky top-24">
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-400">
                      <span>Shipping</span>
                      <span className="font-bold text-white">
                        {subtotalNum >= SHIPPING_THRESHOLD ? 'FREE' : 'Calculated at checkout'}
                      </span>
                    </div>

                    {/* Free Shipping Progress */}
                    {subtotalNum < SHIPPING_THRESHOLD && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-zinc-500 mb-2">
                          Add {formatPrice(needsForFreeShipping)} more for free shipping
                        </p>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white transition-all"
                            style={{
                              width: `${Math.min(100, (subtotalNum / SHIPPING_THRESHOLD) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t-2 border-white/10 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold uppercase text-white">Total</span>
                      <span className="text-2xl font-black text-white">{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black uppercase text-base border-2 border-white"
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-xs text-zinc-600 text-center mt-4">
                    Taxes calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
