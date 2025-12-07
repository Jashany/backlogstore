'use client';

import { ProductListItem } from '@/lib/services/product-service';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: ProductListItem[];
  onQuickAdd?: (productId: number) => void;
}

export function ProductGrid({ products, onQuickAdd }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-black/50 mb-2">
          No Products Found
        </p>
        <p className="text-xs text-black/40">
          Try adjusting your filters or check back soon
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  );
}
