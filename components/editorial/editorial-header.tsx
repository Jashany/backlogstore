'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart, Search, X, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { CartDrawer } from '@/components/cart/cart-drawer';

interface EditorialHeaderProps {
  onMenuClick: () => void;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({ onMenuClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300 mix-blend-difference text-white">
        <div className="flex justify-between items-center px-4 md:px-8 py-5 md:py-6">
          {/* Left: Hamburger & Logo */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={onMenuClick}
              className="hover:opacity-70 transition-opacity p-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>
            <Link href="/" className="block">
              <h1
              style={{
                letterSpacing: '-0.07em',
                // fontWeight: '400'
              }} className="text-3xl md:text-5xl lg:text-[6rem] leading-none select-none cursor-pointer uppercase">
                BACKLOG
              </h1>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-6 text-xs font-medium tracking-widest">
            <Link
              href="/search"
              className="hidden md:block hover:underline underline-offset-4 decoration-1 uppercase"
            >
              Search
            </Link>
            {isAuthenticated ? (
              <Link
                href="/account"
                className="hidden md:block hover:underline underline-offset-4 decoration-1 uppercase"
              >
                Account
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:block hover:underline underline-offset-4 decoration-1 uppercase"
              >
                Log In
              </Link>
            )}
            <Link
              href="/shop"
              className="hidden md:block hover:underline underline-offset-4 decoration-1 uppercase"
            >
              Shop
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <span className="hidden md:inline uppercase">Cart</span>
              <span className="md:hidden">
                <ShoppingCart className="w-5 h-5" />
              </span>
              <span>({itemCount})</span>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default EditorialHeader;
