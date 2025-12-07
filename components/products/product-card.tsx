'use client';

import { ProductListItem } from '@/lib/services/product-service';
import { formatPrice } from '@/lib/utils/format-price';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: ProductListItem;
  onQuickAdd?: (productId: number) => void;
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  return (
    <div className="group relative">
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-3/4 overflow-hidden bg-neutral-100">
          {product.mainImageUrl ? (
            <Image
              src={product.mainImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/20">
              <ShoppingCart className="h-8 w-8" />
            </div>
          )}

          {/* Quick add button on hover */}
          {onQuickAdd && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickAdd(product.id);
              }}
              className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm text-black py-3 text-xs uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white"
            >
              Quick Add
            </button>
          )}
        </div>
      </Link>

      <div className="mt-3 space-y-1">
        <Link href={`/shop/${product.id}`}>
          <h3 className="text-xs uppercase tracking-wider text-black group-hover:underline transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-black/70">
          {formatPrice(product.basePrice)}
        </p>
      </div>
    </div>
  );
}
