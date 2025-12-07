'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import {
  EditorialSection,
  EditorialHeader,
  MenuOverlay,
  EditorialFooter,
} from '@/components/editorial';
import { ProductCarousel } from '@/components/products/product-carousel';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Image assets (Unsplash - high fashion/streetwear vibe)
  const heroImage =
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop';
  const section1Image =
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop';
  const section1Image2 =
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop';
  const section2Image =
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop';
  const section3Image =
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop';

  // Hoodie products for carousel (using transparent/cutout style images)
  const hoodieProducts = [
    {
      id: 1,
      name: 'Classic Black Hoodie',
      price: '$89.00',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop&bg=remove',
    },
    {
      id: 2,
      name: 'Oversized Grey Hoodie',
      price: '$95.00',
      image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Essential White Hoodie',
      price: '$89.00',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Vintage Wash Hoodie',
      price: '$110.00',
      image: 'https://images.unsplash.com/photo-1542406775-ade58c52d2e4?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 5,
      name: 'Tech Fleece Hoodie',
      price: '$120.00',
      image: 'https://images.unsplash.com/photo-1614975059251-992f11792571?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 6,
      name: 'Zip-Up Hoodie',
      price: '$99.00',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 7,
      name: 'Cropped Hoodie',
      price: '$79.00',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 8,
      name: 'Premium Cotton Hoodie',
      price: '$135.00',
      image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-black selection:bg-black selection:text-white font-sans">
      <EditorialHeader onMenuClick={() => setIsMenuOpen(true)} />

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main>
        {/* Hero Section */}
        <EditorialSection
          imageSrc={heroImage}
          title="THE NEW DROP"
          subtitle="WINTER 2025 · LIMITED EDITION"
          isHero={true}
        />

        {/* Editorial Feed */}
        <EditorialSection
          imageSrc={section1Image}
          imageSrc2={section1Image2}
          title="GRAPHIC COLLECTION"
          subtitle="BOLD STATEMENTS"
          href="/shop/category/T-SHIRTS"
        />

        <EditorialSection
          imageSrc={section2Image}
          title="STREET ESSENTIALS"
          subtitle="COMFORT REDEFINED"
          href="/shop/category/HOODIES"
        />

        <EditorialSection
          imageSrc={section3Image}
          title="OUTERWEAR"
          subtitle="LAYER UP"
          href="/shop/category/OUTERWEAR"
        />


        {/* Hoodie Product Carousel */}
        <ProductCarousel 
          products={hoodieProducts} 
          title="Featured Hoodies"
          speed={40}
        />

        {/* Newsletter Section */}
        <section className="relative py-20 md:py-32 px-4 md:px-12 bg-white text-black border-t border-black/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xs font-medium tracking-[0.3em] uppercase mb-4 text-black/50">
              Newsletter
            </h2>
            <p className="text-2xl md:text-4xl font-bold uppercase tracking-tight mb-6">
              Join the Movement
            </p>
            <p className="text-sm text-black/60 mb-8 max-w-md mx-auto">
              Subscribe for early access to drops, exclusive offers, and behind-the-scenes
              content.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="flex-1 h-12 px-4 bg-transparent border border-black/20 text-black placeholder:text-black/40 focus:border-black focus:outline-none text-xs tracking-widest uppercase"
              />
              <button
                type="submit"
                className="h-12 px-8 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-black/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <EditorialFooter />
    </div>
  );
}
