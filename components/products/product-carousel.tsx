'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  speed?: number; // pixels per second
}

export function ProductCarousel({ 
  products, 
  title = "Featured Products",
  speed = 50 
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const scrollPositionRef = useRef<number>(0);

  // Duplicate products for seamless infinite scroll
  const duplicatedProducts = [...products, ...products, ...products];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const totalWidth = scrollContainer.scrollWidth / 3;

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (!isPaused) {
        scrollPositionRef.current += speed * deltaTime;

        // Reset position for seamless loop
        if (scrollPositionRef.current >= totalWidth) {
          scrollPositionRef.current = scrollPositionRef.current - totalWidth;
        }

        if (scrollContainer) {
          scrollContainer.style.transform = `translateX(-${scrollPositionRef.current}px)`;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, speed]);

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-white">
      {/* Section Header */}
      {title && (
        <div className="px-4 md:px-12 mb-8 md:mb-12">
          <h2 className="text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-black/50">
            {title}
          </h2>
        </div>
      )}

      {/* Carousel Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredId(null);
        }}
      >
        {/* Scrolling Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-10 will-change-transform"
          style={{ width: 'fit-content' }}
        >
          {duplicatedProducts.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              href={`/shop/${product.id}`}
              className="group shrink-0 w-[200px] md:w-[280px]"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Product Image */}
              <div className="relative aspect-square mb-4 overflow-hidden">
                <div
                  className={`relative w-full h-full transition-transform duration-500 ease-out ${
                    hoveredId === product.id ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 200px, 280px"
                    unoptimized
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 
                  className={`text-xs uppercase tracking-wider mb-1 transition-all duration-300 ${
                    hoveredId === product.id ? 'text-black' : 'text-black/70'
                  }`}
                >
                  {product.name}
                </h3>
                <p className="text-xs text-black/50">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductCarousel;
