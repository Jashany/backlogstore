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
      <SheetContent side="right" className="w-full sm:max-w-md bg-white border-l border-black/10 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart ({cart?.totalItems || 0})
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <ShoppingCart className="h-12 w-12 text-black/20 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-black/50 mb-2">Your Cart is Empty</p>
            <p className="text-xs text-black/40 mb-6">Add some items to get started</p>
            <Button
              onClick={onClose}
              className="bg-black text-white hover:bg-black/80 text-xs font-medium uppercase tracking-widest h-10 px-6"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
              <div className="space-y-0">
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
            <div className="border-t border-black/10 pt-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-black/50">Subtotal</span>
                <span className="text-base font-bold text-black">{formatPrice(subtotal)}</span>
              </div>

              <p className="text-[10px] text-black/40 text-center uppercase tracking-wider">
                Shipping and taxes calculated at checkout
              </p>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-black text-white hover:bg-black/80 text-xs font-medium uppercase tracking-widest"
                >
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full h-12 border border-black/20 text-black hover:border-black hover:bg-transparent text-xs font-medium uppercase tracking-widest"
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
