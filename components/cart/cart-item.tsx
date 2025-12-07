'use client';

import { CartItem as CartItemType } from '@/lib/services/cart-service';
import { formatPrice, calculateTotal } from '@/lib/utils/format-price';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating?: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const { product, variant, quantity } = item;
  const itemTotal = calculateTotal(product.basePrice, quantity);

  return (
    <div className="flex gap-4 py-4 border-b border-black/10 last:border-0">
      {/* Product Image */}
      <Link href={`/shop/${product.id}`} className="shrink-0">
        <div className="relative w-20 h-24 overflow-hidden bg-neutral-100">
          {product.mainImageUrl ? (
            <Image
              src={product.mainImageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100" />
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/shop/${product.id}`}>
              <h3 className="text-xs font-medium uppercase tracking-wider text-black truncate hover:underline transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="mt-1 space-y-0.5 text-[10px] text-black/50 uppercase tracking-wider">
              {variant.size && <p>Size: {variant.size}</p>}
              {variant.colorName && (
                <div className="flex items-center gap-2">
                  <span>Color: {variant.colorName}</span>
                  {variant.colorHexCode && (
                    <span
                      className="w-3 h-3 border border-black/10 inline-block"
                      style={{ backgroundColor: variant.colorHexCode }}
                    />
                  )}
                </div>
              )}
            </div>

            <p className="mt-2 text-xs font-medium text-black">
              {formatPrice(product.basePrice)}
            </p>
          </div>

          {/* Remove Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(item.id)}
            disabled={isUpdating}
            className="text-black/40 hover:text-black hover:bg-transparent h-6 w-6 shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, quantity - 1))}
              disabled={isUpdating || quantity <= 1}
              className="h-8 w-8 border border-black/20 text-black hover:border-black hover:bg-transparent rounded-none"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-10 h-8 flex items-center justify-center border-y border-black/20 text-xs font-medium text-black">
              {quantity}
            </span>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              disabled={isUpdating || quantity >= variant.stockQuantity}
              className="h-8 w-8 border border-black/20 text-black hover:border-black hover:bg-transparent rounded-none"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Item Total */}
          <p className="text-xs font-medium text-black">
            {formatPrice(itemTotal)}
          </p>
        </div>

        {/* Stock Warning */}
        {quantity >= variant.stockQuantity && (
          <p className="mt-2 text-[10px] text-amber-600 uppercase tracking-wider">
            Max stock reached ({variant.stockQuantity} available)
          </p>
        )}
      </div>
    </div>
  );
}
