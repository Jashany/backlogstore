'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';
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

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">
          Category
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() =>
                onCategoryChange(selectedCategory === category ? null : category)
              }
              className={`w-full text-left px-4 py-2 border-2 transition-colors uppercase text-sm font-bold ${
                selectedCategory === category
                  ? 'border-white bg-white text-black'
                  : 'border-white/20 text-white hover:border-white/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">
          Size
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(selectedSize === size ? null : size)}
              className={`px-4 py-2 border-2 transition-colors uppercase text-sm font-bold ${
                selectedSize === size
                  ? 'border-white bg-white text-black'
                  : 'border-white/20 text-white hover:border-white/50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="w-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white uppercase font-bold"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 sticky top-24 h-fit">
        <div className="border-2 border-white/10 p-6 bg-zinc-950">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6 text-white">
            Filters
          </h2>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-white text-black hover:bg-zinc-200 shadow-lg border-2 border-black relative"
            >
              <SlidersHorizontal className="h-6 w-6" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-black" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black border-white/20">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold uppercase tracking-wider text-white">
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
