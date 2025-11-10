'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { OrderService } from '@/lib/services/order-service';
import { formatPrice } from '@/lib/utils/format-price';
import { toast } from 'sonner';
import { CreditCard, Banknote, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [selectedMethod, setSelectedMethod] = useState<'CARD' | 'COD'>('CARD');
  const [notes, setNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const addressId = typeof window !== 'undefined'
    ? parseInt(sessionStorage.getItem('checkout_address_id') || '0')
    : 0;

  useEffect(() => {
    // Redirect if cart is empty or no address selected
    if (!cart || cart.items.length === 0) {
      router.push('/cart');
      return;
    }

    if (!addressId) {
      router.push('/checkout');
      return;
    }
  }, [cart, addressId]);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to complete your order');
      router.push('/auth/login');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const result = await OrderService.createOrder({
        addressId,
        paymentInfo: {
          paymentMethod: selectedMethod,
        },
        notes: notes.trim() || undefined,
      });

      if (result.success && result.order) {
        // Clear cart on success
        await clearCart();

        // Clear checkout data
        sessionStorage.removeItem('checkout_address_id');

        // Redirect to confirmation
        router.push(`/checkout/confirmation?orderId=${result.order.id}`);
      } else {
        toast.error(result.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!cart || !addressId) {
    return null;
  }

  const SHIPPING_COST = parseFloat(subtotal) >= 75 ? 0 : 9.99;
  const total = parseFloat(subtotal) + SHIPPING_COST;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1">
        {/* Progress Bar */}
        <div className="border-b-2 border-white/10 bg-zinc-950">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 h-0.5 bg-white w-1/2 -translate-y-1/2" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
                  ✓
                </div>
                <span className="mt-2 text-xs font-bold uppercase text-white">Shipping</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
                  2
                </div>
                <span className="mt-2 text-xs font-bold uppercase text-white">Payment</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold border-2 border-white/10">
                  3
                </div>
                <span className="mt-2 text-xs font-bold uppercase text-zinc-500">Confirm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-8">
            Payment Method
          </h1>

          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="space-y-4">
              {/* Card Payment */}
              <button
                onClick={() => setSelectedMethod('CARD')}
                className={`w-full text-left p-6 border-2 transition-colors ${
                  selectedMethod === 'CARD'
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold uppercase text-white text-sm">Credit / Debit Card</p>
                      <p className="text-zinc-500 text-xs">Pay securely with your card</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'CARD' ? 'bg-white border-white' : 'border-white/20'
                    }`}
                  >
                    {selectedMethod === 'CARD' && <div className="w-3 h-3 rounded-full bg-black" />}
                  </div>
                </div>
              </button>

              {/* COD */}
              <button
                onClick={() => setSelectedMethod('COD')}
                className={`w-full text-left p-6 border-2 transition-colors ${
                  selectedMethod === 'COD'
                    ? 'border-white bg-white/5'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Banknote className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold uppercase text-white text-sm">Cash on Delivery</p>
                      <p className="text-zinc-500 text-xs">Pay when you receive</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'COD' ? 'bg-white border-white' : 'border-white/20'
                    }`}
                  >
                    {selectedMethod === 'COD' && <div className="w-3 h-3 rounded-full bg-black" />}
                  </div>
                </div>
              </button>

              <p className="text-xs text-zinc-600 px-6">
                Note: Card payment processing will be implemented soon. Orders will be placed successfully.
              </p>
            </div>

            {/* Order Notes */}
            <div className="border-2 border-white/10 bg-zinc-950 p-6">
              <Label htmlFor="notes" className="text-white uppercase text-xs font-bold block mb-3">
                Order Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions for your order..."
                className="bg-zinc-900 border-white/20 text-white min-h-[100px]"
              />
            </div>

            {/* Order Summary */}
            <div className="border-2 border-white/10 bg-zinc-950 p-6">
              <h2 className="text-lg font-bold uppercase text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className="font-bold text-white">
                    {SHIPPING_COST === 0 ? 'FREE' : formatPrice(SHIPPING_COST.toString())}
                  </span>
                </div>
                <div className="pt-3 border-t-2 border-white/10 flex justify-between">
                  <span className="text-lg font-black uppercase text-white">Total</span>
                  <span className="text-2xl font-black text-white">{formatPrice(total.toString())}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                asChild
                className="flex-1 h-14 border-2 border-white/20 text-white hover:border-white hover:bg-white/5 font-bold uppercase"
              >
                <Link href="/checkout">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Link>
              </Button>

              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="flex-1 h-14 bg-white text-black hover:bg-zinc-200 font-black uppercase disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
