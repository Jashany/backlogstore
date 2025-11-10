'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductService, ProductListItem } from '@/lib/services/product-service';
import { toast } from 'sonner';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [category, selectedSize]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const filters: any = { category };
      if (selectedSize) filters.size = selectedSize;

      const data = await ProductService.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (productId: number) => {
    toast.info('Opening product page to select size...');
    window.location.href = `/shop/${productId}`;
  };

  const handleClearFilters = () => {
    setSelectedSize(null);
  };

  const categoryName = category.replace(/-/g, ' ');

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b-2 border-white/10 bg-zinc-950">
          <div className="container mx-auto max-w-7xl px-4 py-12">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">
              {categoryName}
            </h1>
            <p className="text-zinc-500 font-medium">
              {products.length} {products.length === 1 ? 'product' : 'products'}
              {selectedSize && ` • Size ${selectedSize}`}
            </p>
          </div>
        </div>

        {/* Products Grid with Filters */}
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="lg:flex lg:gap-8">
            {/* Filters Sidebar */}
            <ProductFilters
              selectedCategory={category}
              selectedSize={selectedSize}
              onCategoryChange={() => {}} // Category is fixed for this page
              onSizeChange={setSelectedSize}
              onClearFilters={handleClearFilters}
            />

            {/* Products */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="aspect-square bg-zinc-900 border-2 border-white/10 animate-pulse" />
                      <div className="h-4 bg-zinc-900 w-3/4 animate-pulse" />
                      <div className="h-6 bg-zinc-900 w-1/2 animate-pulse" />
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

      <Footer />
    </div>
  );
}
