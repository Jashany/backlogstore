'use client';

import { ProductListItem } from '@/lib/services/product-service';
import { formatPrice } from '@/lib/utils/format-price';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: ProductListItem;
  onQuickAdd?: (productId: number) => void;
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  return (
    <div className="group relative">
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-zinc-900 border-2 border-white/10 hover:border-white transition-colors">
          {product.mainImageUrl ? (
            <Image
              src={product.mainImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
      </Link>

      <div className="mt-3 space-y-2">
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-bold text-sm uppercase tracking-wider text-white group-hover:text-zinc-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-white">
            {formatPrice(product.basePrice)}
          </p>

          {onQuickAdd && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                onQuickAdd(product.id);
              }}
              className="border-2 border-white text-white hover:bg-white hover:text-black transition-colors uppercase text-xs font-bold"
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
