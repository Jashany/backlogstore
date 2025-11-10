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
    <div className="flex gap-4 py-4 border-b border-white/10 last:border-0">
      {/* Product Image */}
      <Link href={`/shop/${product.id}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 border-2 border-white/20 overflow-hidden">
          {product.mainImageUrl ? (
            <Image
              src={product.mainImageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800" />
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/shop/${product.id}`}>
              <h3 className="font-bold uppercase text-sm sm:text-base text-white truncate hover:text-zinc-300 transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="mt-1 space-y-0.5 text-xs sm:text-sm text-zinc-400">
              {variant.size && <p>Size: {variant.size}</p>}
              {variant.colorName && (
                <div className="flex items-center gap-2">
                  <span>Color: {variant.colorName}</span>
                  {variant.colorHexCode && (
                    <span
                      className="w-4 h-4 border border-white/20 inline-block"
                      style={{ backgroundColor: variant.colorHexCode }}
                    />
                  )}
                </div>
              )}
            </div>

            <p className="mt-2 font-bold text-white text-sm sm:text-base">
              {formatPrice(product.basePrice)}
            </p>
          </div>

          {/* Remove Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(item.id)}
            disabled={isUpdating}
            className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, quantity - 1))}
              disabled={isUpdating || quantity <= 1}
              className="h-8 w-8 border-2 border-white/20 text-white hover:border-white hover:bg-white hover:text-black"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-12 text-center font-bold text-white">{quantity}</span>

            <Button
              size="icon"
              variant="outline"
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
              disabled={isUpdating || quantity >= variant.stockQuantity}
              className="h-8 w-8 border-2 border-white/20 text-white hover:border-white hover:bg-white hover:text-black"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Item Total */}
          <p className="font-bold text-white text-sm sm:text-base">
            {formatPrice(itemTotal)}
          </p>
        </div>

        {/* Stock Warning */}
        {quantity >= variant.stockQuantity && (
          <p className="mt-2 text-xs text-yellow-500">
            Max stock reached ({variant.stockQuantity} available)
          </p>
        )}
      </div>
    </div>
  );
}
