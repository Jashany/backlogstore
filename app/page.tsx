'use client';

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Zap, ShoppingBag, TrendingUp, Lock } from "lucide-react"
import Hero from "@/components/hero"
import InventoryList from "@/components/inventory-list"
import Image from "next/image"

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col bg-[#090909]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Categories - Enhanced Cyberpunk Style */}
        <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 bg-[#050505] overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Gradient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] bg-[#CCFF00] opacity-10 blur-[100px] md:blur-[150px]" />

          <div className="container mx-auto max-w-7xl relative z-10">
            {/* Section Header */}
            <div className="mb-8 sm:mb-12 md:mb-16 text-center">
              <span className="text-backlog-accent font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-3 block">
                Collections_V4
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter text-white leading-none mb-3 sm:mb-4">
                Explore
              </h2>
              <p className="text-neutral-500 font-mono text-xs sm:text-sm max-w-xl md:max-w-2xl mx-auto px-4">
                Curated collections designed for the modern underground
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {/* Category 1 - Featured Large */}
              <Link
                href="/shop/category/T-SHIRTS"
                className="group relative sm:col-span-2 h-[300px] sm:h-[400px] md:h-[500px] border border-neutral-800 overflow-hidden bg-neutral-900/20 backdrop-blur-sm hover:border-backlog-accent transition-all duration-500"
              >
                {/* Corner Accents */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-l border-t border-white/20 group-hover:border-backlog-accent transition-colors z-20" />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-r border-t border-white/20 group-hover:border-backlog-accent transition-colors z-20" />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-l border-b border-white/20 group-hover:border-backlog-accent transition-colors z-20" />
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-r border-b border-white/20 group-hover:border-backlog-accent transition-colors z-20" />

                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop"
                    alt="T-Shirts Collection"
                    fill
                    className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                    unoptimized
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 z-20">
                  <div className="flex items-center gap-2 mb-2 sm:mb-4">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-backlog-accent rounded-full animate-pulse" />
                    <span className="text-backlog-accent font-mono text-[10px] sm:text-xs uppercase tracking-widest">Featured</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase text-white mb-2 sm:mb-3 leading-none">
                    Graphic Tees
                  </h3>
                  <p className="text-neutral-400 font-mono text-xs sm:text-sm mb-4 sm:mb-6 max-w-md hidden sm:block">
                    Bold prints. Premium cotton. Statement pieces for your rotation.
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 text-white font-bold uppercase text-xs sm:text-sm group-hover:text-backlog-accent transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform sm:w-[18px] sm:h-[18px]" />
                  </div>
                </div>
              </Link>

              {/* Category 2 */}
              <Link
                href="/shop/category/HOODIES"
                className="group relative h-[250px] sm:h-[300px] md:h-[500px] border border-neutral-800 overflow-hidden bg-neutral-900/20 backdrop-blur-sm hover:border-backlog-accent transition-all duration-500"
              >
                {/* Corner Accents */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-10 sm:h-10 border-l border-t border-white/20 group-hover:border-backlog-accent transition-colors z-20" />
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-10 sm:h-10 border-r border-b border-white/20 group-hover:border-backlog-accent transition-colors z-20" />

                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
                    alt="Hoodies Collection"
                    fill
                    className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                    unoptimized
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 z-20">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase text-white mb-1 sm:mb-2 leading-none">
                    Hoodies
                  </h3>
                  <p className="text-neutral-400 font-mono text-[10px] sm:text-xs mb-3 sm:mb-4">
                    Oversized comfort meets street style
                  </p>
                  <div className="flex items-center gap-2 text-white font-mono text-[10px] sm:text-xs uppercase group-hover:text-backlog-accent transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform sm:w-[14px] sm:h-[14px]" />
                  </div>
                </div>
              </Link>

              {/* Category 3 */}
              <Link
                href="/shop/category/ACCESSORIES"
                className="group relative h-[200px] sm:h-[220px] md:h-64 border border-neutral-800 overflow-hidden bg-neutral-900/20 backdrop-blur-sm hover:border-backlog-accent transition-all duration-500"
              >
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-5 h-5 sm:w-8 sm:h-8 border-l border-t border-white/20 group-hover:border-backlog-accent transition-colors z-20" />
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-5 h-5 sm:w-8 sm:h-8 border-r border-b border-white/20 group-hover:border-backlog-accent transition-colors z-20" />

                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=800&auto=format&fit=crop"
                    alt="Accessories"
                    fill
                    className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                    unoptimized
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 z-20">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold uppercase text-white mb-1 sm:mb-2 leading-none">
                    Accessories
                  </h3>
                  <div className="flex items-center gap-2 text-white font-mono text-[10px] sm:text-xs uppercase group-hover:text-backlog-accent transition-colors">
                    <span>View All</span>
                    <ArrowRight size={10} className="sm:w-[12px] sm:h-[12px]" />
                  </div>
                </div>
              </Link>

              {/* Category 4 */}
              <Link
                href="/shop/category/OUTERWEAR"
                className="group relative h-[200px] sm:h-[220px] md:h-64 border border-neutral-800 overflow-hidden bg-neutral-900/20 backdrop-blur-sm hover:border-backlog-accent transition-all duration-500"
              >
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-8 sm:h-8 border-r border-t border-white/20 group-hover:border-backlog-accent transition-colors z-20" />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-5 h-5 sm:w-8 sm:h-8 border-l border-b border-white/20 group-hover:border-backlog-accent transition-colors z-20" />

                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"
                    alt="Outerwear"
                    fill
                    className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                    unoptimized
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 z-20">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold uppercase text-white mb-1 sm:mb-2 leading-none">
                    Outerwear
                  </h3>
                  <div className="flex items-center gap-2 text-white font-mono text-[10px] sm:text-xs uppercase group-hover:text-backlog-accent transition-colors">
                    <span>Explore</span>
                    <ArrowRight size={10} className="sm:w-[12px] sm:h-[12px]" />
                  </div>
                </div>
              </Link>

              {/* Category 5 */}
              <Link
                href="/shop/category/FOOTWEAR"
                className="group relative h-[200px] sm:h-[220px] md:h-64 border border-neutral-800 overflow-hidden bg-neutral-900/20 backdrop-blur-sm hover:border-backlog-accent transition-all duration-500"
              >
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-5 h-5 sm:w-8 sm:h-8 border-l border-t border-white/20 group-hover:border-backlog-accent transition-colors z-20" />
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-5 h-5 sm:w-8 sm:h-8 border-r border-b border-white/20 group-hover:border-backlog-accent transition-colors z-20" />

                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop"
                    alt="Footwear"
                    fill
                    className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                    unoptimized
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 z-20">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold uppercase text-white mb-1 sm:mb-2 leading-none">
                    Footwear
                  </h3>
                  <div className="flex items-center gap-2 text-white font-mono text-[10px] sm:text-xs uppercase group-hover:text-backlog-accent transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight size={10} className="sm:w-[12px] sm:h-[12px]" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Inventory List */}
        <InventoryList />

        {/* Features Section */}
        <section className="relative py-12 sm:py-16 md:py-20 px-4 bg-[#080808] border-y border-neutral-900">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
              {/* Feature 1 */}
              <div className="group flex flex-col items-center text-center p-4 sm:p-5 md:p-6 border border-neutral-800 bg-neutral-900/10 hover:bg-neutral-900/30 hover:border-backlog-accent/50 transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-3 sm:mb-4 flex items-center justify-center border border-neutral-700 group-hover:border-backlog-accent transition-colors">
                  <Zap size={18} className="text-backlog-accent sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="font-display font-bold uppercase text-white mb-1 sm:mb-2 text-[10px] sm:text-xs md:text-sm tracking-wider">Fast Shipping</h3>
                <p className="text-neutral-500 font-mono text-[9px] sm:text-[10px] md:text-xs">2-3 day delivery on all orders</p>
              </div>

              {/* Feature 2 */}
              <div className="group flex flex-col items-center text-center p-4 sm:p-5 md:p-6 border border-neutral-800 bg-neutral-900/10 hover:bg-neutral-900/30 hover:border-backlog-accent/50 transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-3 sm:mb-4 flex items-center justify-center border border-neutral-700 group-hover:border-backlog-accent transition-colors">
                  <Lock size={18} className="text-backlog-accent sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="font-display font-bold uppercase text-white mb-1 sm:mb-2 text-[10px] sm:text-xs md:text-sm tracking-wider">Secure Payment</h3>
                <p className="text-neutral-500 font-mono text-[9px] sm:text-[10px] md:text-xs">Encrypted transactions</p>
              </div>

              {/* Feature 3 */}
              <div className="group flex flex-col items-center text-center p-4 sm:p-5 md:p-6 border border-neutral-800 bg-neutral-900/10 hover:bg-neutral-900/30 hover:border-backlog-accent/50 transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-3 sm:mb-4 flex items-center justify-center border border-neutral-700 group-hover:border-backlog-accent transition-colors">
                  <TrendingUp size={18} className="text-backlog-accent sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="font-display font-bold uppercase text-white mb-1 sm:mb-2 text-[10px] sm:text-xs md:text-sm tracking-wider">Limited Drops</h3>
                <p className="text-neutral-500 font-mono text-[9px] sm:text-[10px] md:text-xs">Exclusive releases weekly</p>
              </div>

              {/* Feature 4 */}
              <div className="group flex flex-col items-center text-center p-4 sm:p-5 md:p-6 border border-neutral-800 bg-neutral-900/10 hover:bg-neutral-900/30 hover:border-backlog-accent/50 transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-3 sm:mb-4 flex items-center justify-center border border-neutral-700 group-hover:border-backlog-accent transition-colors">
                  <ShoppingBag size={18} className="text-backlog-accent sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="font-display font-bold uppercase text-white mb-1 sm:mb-2 text-[10px] sm:text-xs md:text-sm tracking-wider">Easy Returns</h3>
                <p className="text-neutral-500 font-mono text-[9px] sm:text-[10px] md:text-xs">30-day return policy</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="relative py-16 sm:py-24 md:py-32 px-4 bg-[#050505] overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Gradient Blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-backlog-accent opacity-20 blur-[100px] md:blur-[150px] rounded-full" />

          <div className="container mx-auto max-w-4xl text-center relative z-10">
            {/* Corner Accents */}
            <div className="absolute -top-4 sm:-top-6 md:-top-8 -left-4 sm:-left-6 md:-left-8 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 border-l-2 border-t-2 border-backlog-accent/30" />
            <div className="absolute -top-4 sm:-top-6 md:-top-8 -right-4 sm:-right-6 md:-right-8 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 border-r-2 border-t-2 border-backlog-accent/30" />
            <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 -left-4 sm:-left-6 md:-left-8 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 border-l-2 border-b-2 border-backlog-accent/30" />
            <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 -right-4 sm:-right-6 md:-right-8 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 border-r-2 border-b-2 border-backlog-accent/30" />

            <div className="border border-neutral-800 bg-neutral-900/20 backdrop-blur-sm p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-backlog-accent rounded-full animate-pulse" />
                <span className="text-backlog-accent font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                  Subscribe_Now
                </span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-backlog-accent rounded-full animate-pulse" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter text-white mb-4 sm:mb-6 leading-none">
                Join The <span className="text-backlog-accent">Underground</span>
              </h2>

              <p className="text-neutral-400 mb-6 sm:mb-8 md:mb-10 max-w-xl md:max-w-2xl mx-auto font-mono text-xs sm:text-sm leading-relaxed px-2">
                Get early access to exclusive drops, member-only deals, and behind-the-scenes content.
                <span className="text-backlog-accent"> No spam. Just heat.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto px-2">
                <input
                  type="email"
                  placeholder="YOUR_EMAIL@DOMAIN.COM"
                  className="flex-1 h-12 sm:h-14 px-4 sm:px-6 bg-black border border-neutral-700 text-white placeholder:text-neutral-600 focus:border-backlog-accent focus:outline-none font-mono text-xs sm:text-sm uppercase tracking-wider transition-colors"
                />
                <button className="group h-12 sm:h-14 px-6 sm:px-8 md:px-10 bg-backlog-accent text-black font-display font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 relative overflow-hidden text-xs sm:text-sm">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Subscribe
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]" />
                  </span>
                </button>
              </div>

              <p className="text-neutral-600 font-mono text-[10px] sm:text-xs mt-4 sm:mt-6 uppercase tracking-wider">
                Join 10,000+ subscribers // No credit card required
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
