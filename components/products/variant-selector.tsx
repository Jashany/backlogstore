'use client';

import { ProductVariant } from '@/lib/services/product-service';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
  groupBy: 'size' | 'color';
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
  groupBy,
}: VariantSelectorProps) {
  // Get unique values based on groupBy
  const uniqueValues = Array.from(
    new Set(
      variants.map((v) =>
        groupBy === 'size' ? v.size : v.colorName
      ).filter(Boolean)
    )
  );

  if (uniqueValues.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
        {groupBy === 'size' ? 'Select Size' : 'Select Color'}
      </h3>

      {groupBy === 'size' ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {uniqueValues.map((value) => {
            // Find variant with this size
            const variant = variants.find((v) => v.size === value);
            if (!variant) return null;

            const isSelected = selectedVariant?.size === value;
            const isOutOfStock = variant.stockQuantity === 0;

            return (
              <button
                key={value}
                onClick={() => onSelectVariant(variant)}
                disabled={isOutOfStock}
                className={`
                  px-4 py-3 border-2 font-bold uppercase text-sm transition-colors relative
                  ${
                    isSelected
                      ? 'border-white bg-white text-black'
                      : isOutOfStock
                      ? 'border-white/10 text-zinc-600 cursor-not-allowed'
                      : 'border-white/20 text-white hover:border-white hover:bg-white/5'
                  }
                `}
              >
                {value}
                {isSelected && (
                  <Check className="absolute top-1 right-1 h-3 w-3" />
                )}
                {isOutOfStock && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-full h-0.5 bg-zinc-600 rotate-45" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {uniqueValues.map((value) => {
            const variant = variants.find((v) => v.colorName === value);
            if (!variant) return null;

            const isSelected = selectedVariant?.colorName === value;
            const isOutOfStock = variant.stockQuantity === 0;

            return (
              <button
                key={value}
                onClick={() => onSelectVariant(variant)}
                disabled={isOutOfStock}
                className={`
                  px-4 py-2 border-2 font-bold uppercase text-xs transition-colors flex items-center gap-2
                  ${
                    isSelected
                      ? 'border-white bg-white text-black'
                      : isOutOfStock
                      ? 'border-white/10 text-zinc-600 cursor-not-allowed'
                      : 'border-white/20 text-white hover:border-white hover:bg-white/5'
                  }
                `}
              >
                {variant.colorHexCode && (
                  <span
                    className="w-4 h-4 border border-white/20"
                    style={{ backgroundColor: variant.colorHexCode }}
                  />
                )}
                {value}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
