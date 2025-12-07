'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductService, ProductListItem } from '@/lib/services/product-service';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  EditorialHeader,
  MenuOverlay,
  EditorialFooter,
} from '@/components/editorial';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await ProductService.searchProducts(searchQuery);
      setProducts(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleQuickAdd = (productId: number) => {
    toast.info('Opening product page to select size...');
    window.location.href = `/shop/${productId}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <EditorialHeader onMenuClick={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-1 pt-20">
        {/* Search Header */}
        <div className="border-b border-black/10">
          <div className="container mx-auto max-w-7xl px-4 md:px-12 py-12 md:py-16">
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black mb-6">
              Search
            </h1>

            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                <input
                  type="search"
                  placeholder="SEARCH FOR PRODUCTS..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-transparent border border-black/20 text-black placeholder:text-black/40 focus:border-black focus:outline-none text-xs tracking-widest uppercase"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto max-w-7xl px-4 md:px-12 py-12">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-3/4 bg-neutral-100 animate-pulse" />
                  <div className="h-3 bg-neutral-100 w-3/4 animate-pulse" />
                  <div className="h-3 bg-neutral-100 w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <>
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-black/50">
                  {products.length} {products.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
                </p>
              </div>

              {products.length > 0 ? (
                <ProductGrid products={products} onQuickAdd={handleQuickAdd} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search className="h-12 w-12 text-black/20 mb-4" />
                  <h2 className="text-lg font-bold uppercase tracking-widest text-black/50 mb-2">
                    No Results Found
                  </h2>
                  <p className="text-sm text-black/40 max-w-md">
                    We couldn&apos;t find any products matching &quot;{query}&quot;. Try different keywords.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-12 w-12 text-black/20 mb-4" />
              <h2 className="text-lg font-bold uppercase tracking-widest text-black/50 mb-2">
                Start Searching
              </h2>
              <p className="text-sm text-black/40">
                Enter a search term to find products
              </p>
            </div>
          )}
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border border-black border-r-transparent mb-4" />
            <p className="text-black/50 uppercase tracking-widest text-xs">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
