'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductService, ProductListItem } from '@/lib/services/product-service';
import { toast } from 'sonner';
import {
  EditorialHeader,
  MenuOverlay,
  EditorialFooter,
} from '@/components/editorial';

export default function ShopPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedSize) filters.size = selectedSize;

      const data = await ProductService.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedSize]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleQuickAdd = (productId: number) => {
    toast.info('Opening product page to select size...');
    window.location.href = `/shop/${productId}`;
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) + (selectedSize ? 1 : 0);

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <EditorialHeader onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-1 pt-20">
        {/* Page Header */}
        <div className="border-b border-black/10">
          <div className="container mx-auto max-w-7xl px-4 md:px-12 py-12 md:py-16">
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black mb-2">
              All Products
            </h1>
            <p className="text-xs tracking-widest uppercase text-black/50">
              {products.length} {products.length === 1 ? 'product' : 'products'}
              {activeFiltersCount > 0 && ` · ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
            </p>
          </div>
        </div>

        {/* Products Grid with Filters */}
        <div className="container mx-auto max-w-7xl px-4 md:px-12 py-12">
          <div className="lg:flex lg:gap-12">
            {/* Filters Sidebar (Desktop) */}
            <ProductFilters
              selectedCategory={selectedCategory}
              selectedSize={selectedSize}
              onCategoryChange={setSelectedCategory}
              onSizeChange={setSelectedSize}
              onClearFilters={handleClearFilters}
            />

            {/* Products */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="aspect-3/4 bg-neutral-100 animate-pulse" />
                      <div className="h-3 bg-neutral-100 w-3/4 animate-pulse" />
                      <div className="h-3 bg-neutral-100 w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <ProductGrid products={products} onQuickAdd={handleQuickAdd} />
              )}
            </div>
          </div>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
