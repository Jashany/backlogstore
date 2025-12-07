'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EditorialSectionProps {
  imageSrc: string;
  imageSrc2?: string;
  title: string;
  subtitle: string;
  isHero?: boolean;
  href?: string;
  darkText?: boolean;
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({
  imageSrc,
  imageSrc2,
  title,
  subtitle,
  isHero = false,
  href = '/shop',
  darkText = true,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far the element is from the center
      const distanceFromCenter = rect.top + rect.height / 2 - windowHeight / 2;

      // Normalize to a value (roughly -1 to 1)
      const norm = distanceFromCenter / windowHeight;

      setProgress(norm);

      // Visibility check for fade in
      if (rect.top < windowHeight * 0.9 && rect.bottom > 0) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Styles
  const scale = isHero
    ? 1 + Math.max(0, -progress * 0.3)
    : Math.max(0.95, 1.05 - Math.abs(progress) * 0.15);

  const opacity = isHero
    ? Math.max(0, 1 + progress * 2)
    : Math.min(1, 1.2 - Math.abs(progress));

  const translateY = isHero ? 0 : progress * 50;

  const textColor = darkText ? 'text-neutral-900' : 'text-white';
  const bgColor = darkText ? 'bg-white' : 'bg-black';

  const content = (
    <div
      ref={sectionRef}
      className={`relative w-full overflow-hidden flex items-center justify-center ${
        isHero ? 'h-screen' : 'min-h-screen md:min-h-[120vh] py-16 md:py-24'
      }`}
    >
      <div
        className="relative w-full h-full transition-opacity duration-1000 ease-out flex gap-2 md:gap-4 px-2 md:px-12 items-center justify-center"
        style={{
          opacity: isHero ? opacity : isVisible ? 1 : 0.2,
        }}
      >
        {/* Main Image Container with Transform Effects */}
        <div
          className={`relative overflow-hidden ${
            isHero
              ? 'w-full h-full absolute inset-0'
              : 'w-full md:w-[90%] aspect-3/4 md:aspect-video'
          }`}
          style={{
            transform: `scale(${scale}) translateY(${translateY}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          {isHero ? (
            <>
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {/* Hero Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20" />
            </>
          ) : (
            <div className="flex w-full h-full gap-2 md:gap-4">
              <div className={`relative h-full ${imageSrc2 ? 'w-full md:w-1/2' : 'w-full'}`}>
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {imageSrc2 && (
                <div className="relative h-full w-1/2 hidden md:block">
                  <Image
                    src={imageSrc2}
                    alt={`${title} - 2`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Text Overlay */}
        <div
          className={`absolute z-20 ${
            isHero
              ? 'bottom-8 right-4 md:bottom-12 md:right-12'
              : 'bottom-20 md:bottom-32 right-4 md:right-12'
          } ${textColor}`}
        >
          <div
            className="flex flex-col items-end text-right"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : 30}px)`,
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              transitionDelay: '0.3s',
            }}
          >
            <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-1">
              {title}
            </h2>
            <p className="text-[10px] md:text-xs tracking-wide opacity-80">{subtitle}</p>
          </div>
        </div>

        {/* Scroll indicator for hero */}
        {isHero && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-pulse">
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-white/40" />
          </div>
        )}
      </div>
    </div>
  );

  if (href && !isHero) {
    return (
      <Link href={href} className="block cursor-pointer group">
        {content}
      </Link>
    );
  }

  return content;
};

export default EditorialSection;
