'use client';

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { ProductService, ProductListItem } from "@/lib/services/product-service"
import { ProductGrid } from "@/components/products/product-grid"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await ProductService.getProducts({ limit: 4 });
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleQuickAdd = async (productId: number) => {
    // For quick add, we'll add the first variant
    // In a real scenario, you'd fetch product details to get the first available variant
    toast.info('Opening product page to select size...');
    window.location.href = `/shop/${productId}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden border-b-2 border-white/10">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 border-2 border-white/20 bg-white/5">
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                New Arrivals Now Live
              </p>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
              Street
              <br />
              Culture
            </h1>

            <p className="text-base md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto font-medium">
              Bold designs for those who make noise. Premium streetwear essentials crafted for the culture.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-bold uppercase text-base border-2 border-white"
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 border-2 border-white text-white hover:bg-white hover:text-black font-bold uppercase text-base"
              >
                <Link href="/shop/category/HOODIES">
                  View Hoodies
                </Link>
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full" />
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                  Featured
                </h2>
                <p className="text-zinc-500 font-medium">Essential pieces for your rotation</p>
              </div>

              <Button
                variant="outline"
                asChild
                className="border-2 border-white/20 text-white hover:border-white hover:bg-white/5 font-bold uppercase"
              >
                <Link href="/shop">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-zinc-900 border-2 border-white/10 animate-pulse" />
                    <div className="h-4 bg-zinc-900 w-3/4 animate-pulse" />
                    <div className="h-6 bg-zinc-900 w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={featuredProducts} onQuickAdd={handleQuickAdd} />
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-24 px-4 bg-zinc-950 border-y-2 border-white/10">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-12 text-center">
              Shop By Category
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* T-Shirts */}
              <Link
                href="/shop/category/T-SHIRTS"
                className="group relative h-80 md:h-96 border-2 border-white/10 overflow-hidden hover:border-white transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-zinc-800 group-hover:scale-105 transition-transform duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-2">
                    Tees
                  </h3>
                  <p className="text-zinc-400 font-medium mb-4">Graphic & Essential Styles</p>
                  <div className="flex items-center text-white font-bold uppercase text-sm">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Hoodies */}
              <Link
                href="/shop/category/HOODIES"
                className="group relative h-80 md:h-96 border-2 border-white/10 overflow-hidden hover:border-white transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-zinc-800 group-hover:scale-105 transition-transform duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-2">
                    Hoodies
                  </h3>
                  <p className="text-zinc-400 font-medium mb-4">Premium Comfort & Style</p>
                  <div className="flex items-center text-white font-bold uppercase text-sm">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
              Join The Movement
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Sign up for early access to drops, exclusive deals, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 bg-zinc-900 border-2 border-white/20 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none font-medium"
              />
              <Button
                size="lg"
                className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-bold uppercase border-2 border-white"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
