'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shuffle, ShoppingBag, ArrowRight, Check } from 'lucide-react';

// Sample data - in production, this would come from your API/database
const uppers = [
  {
    id: 'upper-1',
    name: 'Oversized Graphic Tee',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop',
    category: 'T-SHIRTS',
    slug: 'oversized-graphic-tee'
  },
  {
    id: 'upper-2',
    name: 'Tech Fleece Hoodie',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    category: 'HOODIES',
    slug: 'tech-fleece-hoodie'
  },
  {
    id: 'upper-3',
    name: 'Minimal Logo Tee',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
    category: 'T-SHIRTS',
    slug: 'minimal-logo-tee'
  },
  {
    id: 'upper-4',
    name: 'Vintage Wash Crewneck',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop',
    category: 'HOODIES',
    slug: 'vintage-wash-crewneck'
  },
  {
    id: 'upper-5',
    name: 'Street Logo Hoodie',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
    category: 'HOODIES',
    slug: 'street-logo-hoodie'
  },
];

const lowers = [
  {
    id: 'lower-1',
    name: 'Cargo Joggers',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
    category: 'PANTS',
    slug: 'cargo-joggers'
  },
  {
    id: 'lower-2',
    name: 'Relaxed Fit Jeans',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
    category: 'PANTS',
    slug: 'relaxed-fit-jeans'
  },
  {
    id: 'lower-3',
    name: 'Tech Shorts',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop',
    category: 'SHORTS',
    slug: 'tech-shorts'
  },
  {
    id: 'lower-4',
    name: 'Wide Leg Trousers',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop',
    category: 'PANTS',
    slug: 'wide-leg-trousers'
  },
  {
    id: 'lower-5',
    name: 'Slim Cargo Pants',
    price: 84.99,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600&auto=format&fit=crop',
    category: 'PANTS',
    slug: 'slim-cargo-pants'
  },
];

export default function PairUp() {
  const [upperIndex, setUpperIndex] = useState(0);
  const [lowerIndex, setLowerIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const currentUpper = uppers[upperIndex];
  const currentLower = lowers[lowerIndex];
  const totalPrice = currentUpper.price + currentLower.price;

  const shuffleOutfit = () => {
    setIsShuffling(true);
    
    let shuffleCount = 0;
    const maxShuffles = 8;
    const shuffleInterval = setInterval(() => {
      setUpperIndex(Math.floor(Math.random() * uppers.length));
      setLowerIndex(Math.floor(Math.random() * lowers.length));
      shuffleCount++;
      
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        setIsShuffling(false);
      }
    }, 100);
  };

  return (
    <section className="relative py-24 md:py-32 px-4 bg-[#070707] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Gradient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFF00] opacity-5 blur-[150px] rounded-full" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="text-backlog-accent font-mono text-xs uppercase tracking-[0.3em] mb-3 block">
            Style_Builder
          </span>
          <h2 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tighter text-white leading-none mb-4">
            Pair Up
          </h2>
          <p className="text-neutral-500 font-mono text-sm max-w-2xl mx-auto">
            Select your top and bottom to create the perfect outfit combination
          </p>
        </div>

        {/* Main Layout: Preview (30%) | Selection (70%) */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Side - Outfit Preview (30%) */}
          <div className="lg:w-[30%] flex-shrink-0">
            <div className="sticky top-24">
              <div className="relative border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm overflow-hidden">
                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-l border-t border-backlog-accent/50 z-30" />
                <div className="absolute top-3 right-3 w-8 h-8 border-r border-t border-backlog-accent/50 z-30" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-l border-b border-backlog-accent/50 z-30" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-r border-b border-backlog-accent/50 z-30" />

                {/* Preview Label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
                  <span className="text-backlog-accent font-mono text-[10px] uppercase tracking-[0.2em] bg-black/80 px-2 py-1 border border-backlog-accent/30">
                    Your Outfit
                  </span>
                </div>

                {/* Outfit Stack Preview */}
                <div className="flex flex-col">
                  {/* Upper Preview */}
                  <div className="relative h-[200px] md:h-[240px]">
                    <Image
                      src={currentUpper.image}
                      alt={currentUpper.name}
                      fill
                      className={`object-cover transition-all duration-300 ${isShuffling ? 'blur-sm scale-105' : ''}`}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10" />
                    <div className="absolute bottom-2 left-3 z-20">
                      <p className="text-white font-mono text-xs truncate max-w-[150px]">{currentUpper.name}</p>
                      <p className="text-backlog-accent font-bold text-sm">${currentUpper.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-backlog-accent/30 relative z-20" />

                  {/* Lower Preview */}
                  <div className="relative h-[200px] md:h-[240px]">
                    <Image
                      src={currentLower.image}
                      alt={currentLower.name}
                      fill
                      className={`object-cover transition-all duration-300 ${isShuffling ? 'blur-sm scale-105' : ''}`}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/70 z-10" />
                    <div className="absolute bottom-2 left-3 z-20">
                      <p className="text-white font-mono text-xs truncate max-w-[150px]">{currentLower.name}</p>
                      <p className="text-backlog-accent font-bold text-sm">${currentLower.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Shuffle Button */}
                <button
                  onClick={shuffleOutfit}
                  disabled={isShuffling}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-backlog-accent text-black flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 rounded-full"
                >
                  <Shuffle size={20} className={isShuffling ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* Total & Add to Cart */}
              <div className="mt-4 border border-neutral-800 bg-neutral-900/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-neutral-500 font-mono text-xs uppercase">Total</span>
                  <span className="text-2xl font-display font-bold text-backlog-accent">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full h-12 bg-backlog-accent text-black font-display font-bold uppercase tracking-wider text-sm hover:bg-white transition-all flex items-center justify-center gap-2">
                  <ShoppingBag size={18} />
                  <span>Add Both</span>
                </button>
                <p className="text-center text-neutral-600 font-mono text-[10px] mt-2 uppercase">
                  {uppers.length * lowers.length} combinations available
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Selection Grid (70%) */}
          <div className="lg:w-[70%] flex flex-col gap-8">
            
            {/* Uppers Row */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-backlog-accent rounded-full" />
                <h3 className="text-white font-display font-bold uppercase tracking-wider text-sm">Select Upper</h3>
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="text-neutral-600 font-mono text-xs">{uppers.length} items</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {uppers.map((upper, idx) => (
                  <button
                    key={upper.id}
                    onClick={() => setUpperIndex(idx)}
                    className={`group relative aspect-[3/4] border overflow-hidden transition-all duration-300 ${
                      idx === upperIndex 
                        ? 'border-backlog-accent ring-1 ring-backlog-accent' 
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <Image
                      src={upper.image}
                      alt={upper.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Selected Indicator */}
                    {idx === upperIndex && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-backlog-accent flex items-center justify-center">
                        <Check size={14} className="text-black" />
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white font-mono text-[10px] truncate">{upper.name}</p>
                      <p className="text-backlog-accent font-bold text-xs">${upper.price.toFixed(2)}</p>
                    </div>

                    {/* Category Tag */}
                    <span className="absolute top-2 left-2 text-[8px] font-mono text-backlog-accent bg-black/70 px-1.5 py-0.5 border border-backlog-accent/30">
                      {upper.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lowers Row */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-backlog-accent rounded-full" />
                <h3 className="text-white font-display font-bold uppercase tracking-wider text-sm">Select Lower</h3>
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="text-neutral-600 font-mono text-xs">{lowers.length} items</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {lowers.map((lower, idx) => (
                  <button
                    key={lower.id}
                    onClick={() => setLowerIndex(idx)}
                    className={`group relative aspect-[3/4] border overflow-hidden transition-all duration-300 ${
                      idx === lowerIndex 
                        ? 'border-backlog-accent ring-1 ring-backlog-accent' 
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <Image
                      src={lower.image}
                      alt={lower.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Selected Indicator */}
                    {idx === lowerIndex && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-backlog-accent flex items-center justify-center">
                        <Check size={14} className="text-black" />
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white font-mono text-[10px] truncate">{lower.name}</p>
                      <p className="text-backlog-accent font-bold text-xs">${lower.price.toFixed(2)}</p>
                    </div>

                    {/* Category Tag */}
                    <span className="absolute top-2 left-2 text-[8px] font-mono text-backlog-accent bg-black/70 px-1.5 py-0.5 border border-backlog-accent/30">
                      {lower.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <button 
                onClick={shuffleOutfit}
                disabled={isShuffling}
                className="flex items-center gap-2 text-neutral-400 font-mono text-xs uppercase hover:text-backlog-accent transition-colors disabled:opacity-50"
              >
                <Shuffle size={14} />
                <span>Surprise Me</span>
              </button>
              
              <Link 
                href="/shop"
                className="flex items-center gap-2 text-neutral-400 font-mono text-xs uppercase hover:text-backlog-accent transition-colors"
              >
                <span>Browse All Items</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
