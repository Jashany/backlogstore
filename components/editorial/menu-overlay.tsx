'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronRight } from 'lucide-react';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { name: 'NEW ARRIVALS', href: '/shop' },
  { name: 'T-SHIRTS', href: '/shop/category/T-SHIRTS' },
  { name: 'HOODIES', href: '/shop/category/HOODIES' },
  { name: 'OUTERWEAR', href: '/shop/category/OUTERWEAR' },
  { name: 'ACCESSORIES', href: '/shop/category/ACCESSORIES' },
  { name: 'FOOTWEAR', href: '/shop/category/FOOTWEAR' },
];

const subCategories = [
  'FEATURED',
  'BEST SELLERS',
  'LIMITED EDITION',
  'COLLABORATIONS',
  'SALE',
];

const previewCards = [
  {
    title: 'NEW DROP',
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    href: '/shop',
  },
  {
    title: 'GRAPHIC TEES',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    href: '/shop/category/T-SHIRTS',
  },
  {
    title: 'STREETWEAR',
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    href: '/shop/category/HOODIES',
  },
  {
    title: 'EXCLUSIVES',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    href: '/shop',
  },
];

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [displayState, setDisplayState] = useState<'hidden' | 'entering' | 'visible' | 'exiting'>('hidden');

  // Handle open state changes
  useEffect(() => {
    let animateTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    if (isOpen) {
      setDisplayState('entering');
      document.body.style.overflow = 'hidden';
      // Start animation after a small delay for mount
      animateTimeout = setTimeout(() => {
        setDisplayState('visible');
      }, 20);
    } else {
      if (displayState === 'visible' || displayState === 'entering') {
        setDisplayState('exiting');
        document.body.style.overflow = 'unset';
        // Hide after animation completes
        hideTimeout = setTimeout(() => {
          setDisplayState('hidden');
        }, 600);
      }
    }

    return () => {
      clearTimeout(animateTimeout);
      clearTimeout(hideTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const shouldRender = displayState !== 'hidden';
  const isAnimating = displayState === 'visible';

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Header of Menu */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 transition-all duration-500 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <button
          onClick={onClose}
          className="group flex items-center justify-center w-10 h-10 border border-black/20 hover:border-black hover:bg-black transition-all duration-300"
          aria-label="Close menu"
        >
          <X
            className="w-5 h-5 text-black group-hover:text-white group-hover:rotate-90 transition-all duration-300"
            strokeWidth={1.5}
          />
        </button>
        <Link
          href="/"
          onClick={onClose}
          className="text-2xl md:text-3xl font-black tracking-tighter absolute left-1/2 transform -translate-x-1/2 cursor-pointer text-black uppercase"
        >
          BACKLOG
        </Link>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <div className="flex h-full w-full pt-20 md:pt-24 pb-10 px-4 md:px-6 overflow-y-auto">
        {/* Left Column: Main Categories (Desktop) */}
        <div 
          className={`w-1/4 hidden md:flex flex-col space-y-4 pt-10 border-r border-black/10 pr-8 transition-all duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              onClick={onClose}
              onMouseEnter={() => setActiveCategory(cat.name)}
              className={`text-xl lg:text-2xl font-bold uppercase tracking-tight hover:pl-2 transition-all duration-300 text-black/70 hover:text-black`}
              style={{
                transitionDelay: isAnimating ? `${200 + idx * 50}ms` : '0ms',
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'translateX(0)' : 'translateX(-20px)',
              }}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Center/Right Content */}
        <div className="flex-1 flex flex-col md:pl-8 lg:pl-12">
          {/* Mobile Categories */}
          <div className="md:hidden flex flex-col space-y-4 mb-8">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={""}
                onClick={onClose}
                className={`flex justify-between items-center border-b border-black/10 pb-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                style={{
                  transitionDelay: isAnimating ? `${150 + idx * 60}ms` : '0ms',
                  opacity: isAnimating ? 1 : 0,
                  transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <span className="text-lg font-bold uppercase tracking-tight text-black">
                  {cat.name}
                </span>
                <ChevronRight className="w-4 h-4 text-black/40" />
              </Link>
            ))}
          </div>

          {/* Featured Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
            {previewCards.map((card, idx) => (
              <Link
                key={idx}
                href={card.href}
                onClick={onClose}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-3/4 mb-2 md:mb-3">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <p className="text-[10px] md:text-xs font-semibold tracking-widest text-black/50 group-hover:text-black transition-colors uppercase">
                  {card.title}
                </p>
              </Link>
            ))}
          </div>

          {/* Subcategories Grid */}
          <div className="mt-auto border-t border-black/10 pt-6 md:pt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {subCategories.map((sub, idx) => (
                <Link
                  key={idx}
                  href="/shop"
                  onClick={onClose}
                  className="text-[10px] md:text-xs font-medium tracking-widest text-black/40 hover:text-black transition-colors uppercase"
                >
                  {sub}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Links */}
          <div className="mt-8 md:mt-12 flex flex-wrap gap-4 md:gap-8 text-[10px] md:text-xs tracking-widest text-black/30">
            <Link
              href="/account"
              onClick={onClose}
              className="hover:text-black transition-colors uppercase"
            >
              My Account
            </Link>
            <Link
              href="/account/orders"
              onClick={onClose}
              className="hover:text-black transition-colors uppercase"
            >
              Orders
            </Link>
            <Link
              href="/search"
              onClick={onClose}
              className="hover:text-black transition-colors uppercase"
            >
              Search
            </Link>
            <a
              href="#"
              className="hover:text-black transition-colors uppercase"
            >
              Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;
