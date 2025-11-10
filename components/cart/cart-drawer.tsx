'use client';

import { useCart } from '@/hooks/use-cart';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CartItem } from './cart-item';
import { formatPrice } from '@/lib/utils/format-price';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeItem, subtotal } = useCart();
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
    onClose();
    router.push('/checkout');
  };

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-black border-white/20 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Cart ({cart?.totalItems || 0})
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <ShoppingCart className="h-16 w-16 text-zinc-700 mb-4" />
            <p className="text-xl font-bold uppercase text-zinc-500 mb-2">Your Cart is Empty</p>
            <p className="text-zinc-600 mb-6">Add some items to get started</p>
            <Button
              onClick={onClose}
              className="bg-white text-black hover:bg-zinc-200 font-bold uppercase border-2 border-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
              <div className="space-y-4">
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

            {/* Footer */}
            <div className="border-t-2 border-white/20 pt-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg">
                <span className="font-bold uppercase text-white">Subtotal</span>
                <span className="text-2xl font-bold text-white">{formatPrice(subtotal)}</span>
              </div>

              <p className="text-xs text-zinc-500 text-center">
                Shipping and taxes calculated at checkout
              </p>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold uppercase text-base border-2 border-white"
                >
                  Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full h-12 border-2 border-white/20 text-white hover:border-white hover:bg-white/5 font-bold uppercase"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
