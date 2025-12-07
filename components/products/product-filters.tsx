'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface ProductFiltersProps {
  selectedCategory: string | null;
  selectedSize: string | null;
  onCategoryChange: (category: string | null) => void;
  onSizeChange: (size: string | null) => void;
  onClearFilters: () => void;
}

const CATEGORIES = ['T-SHIRTS', 'HOODIES'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductFilters({
  selectedCategory,
  selectedSize,
  onCategoryChange,
  onSizeChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false);

  const hasActiveFilters = selectedCategory || selectedSize;

  const filterContent = (
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-widest mb-4 text-black/50">
          Category
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() =>
                onCategoryChange(selectedCategory === category ? null : category)
              }
              className={`w-full text-left px-4 py-2 border transition-colors uppercase text-xs tracking-wider ${
                selectedCategory === category
                  ? 'border-black bg-black text-white'
                  : 'border-black/20 text-black hover:border-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-widest mb-4 text-black/50">
          Size
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(selectedSize === size ? null : size)}
              className={`px-4 py-2 border transition-colors uppercase text-xs tracking-wider ${
                selectedSize === size
                  ? 'border-black bg-black text-white'
                  : 'border-black/20 text-black hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full text-xs uppercase tracking-widest text-black/50 hover:text-black transition-colors underline underline-offset-4"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24">
          <h2 className="text-xs font-medium uppercase tracking-widest mb-6 text-black/50">
            Filters
          </h2>
          {filterContent}
        </div>
      </div>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-12 w-12 rounded-none bg-black text-white hover:bg-black/80 shadow-lg relative"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-white border border-black" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white border-r border-black/10">
            <SheetHeader>
              <SheetTitle className="text-xs font-medium uppercase tracking-widest text-black/50">
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
