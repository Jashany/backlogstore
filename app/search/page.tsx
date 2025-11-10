'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductService, ProductListItem } from '@/lib/services/product-service';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <div className="border-b-2 border-white/10 bg-zinc-950">
          <div className="container mx-auto max-w-7xl px-4 py-12">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
              Search
            </h1>

            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-14 pl-12 bg-zinc-900 border-2 border-white/20 text-white placeholder:text-zinc-600 focus:border-white text-lg font-medium"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-zinc-900 border-2 border-white/10 animate-pulse" />
                  <div className="h-4 bg-zinc-900 w-3/4 animate-pulse" />
                  <div className="h-6 bg-zinc-900 w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <>
              <div className="mb-6">
                <p className="text-zinc-500 font-medium">
                  {products.length} {products.length === 1 ? 'result' : 'results'} for "{query}"
                </p>
              </div>

              {products.length > 0 ? (
                <ProductGrid products={products} onQuickAdd={handleQuickAdd} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search className="h-16 w-16 text-zinc-700 mb-4" />
                  <h2 className="text-2xl font-black uppercase text-zinc-500 mb-2">
                    No Results Found
                  </h2>
                  <p className="text-zinc-600 max-w-md">
                    We couldn't find any products matching "{query}". Try different keywords.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-16 w-16 text-zinc-700 mb-4" />
              <h2 className="text-2xl font-black uppercase text-zinc-500 mb-2">
                Start Searching
              </h2>
              <p className="text-zinc-600">
                Enter a search term to find products
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
