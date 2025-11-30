'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, MoveDown, Globe, Maximize2, Sparkles } from 'lucide-react';

const clamp = (v: number, a = -1, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Targets & current lerped positions (-1 .. 1)
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  // Layer refs for direct DOM transforms (fast)
  const gradRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const personRef = useRef<HTMLDivElement | null>(null);
  const acidMaskRef = useRef<HTMLDivElement | null>(null);

  // Animation loop config
  const ease = 0.12; // smoothing (0.02 very soft, 0.2 snappier)
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Pointer handler: set target normalized to -1..1 relative to container center
    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      // Normalize -1 .. 1 (centered)
      const nx = clamp((px / rect.width) * 2 - 1, -1, 1);
      const ny = clamp((py / rect.height) * 2 - 1, -1, 1);

      target.current.x = nx;
      target.current.y = ny;
    };

    // Touch fallback (touch move)
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches?.length) return;
      const t = e.touches[0];
      onPointerMove(new PointerEvent('pointermove', { clientX: t.clientX, clientY: t.clientY }));
    };

    // Reset to center when leaving container
    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('mouseleave', onLeave);

    // RAF loop: lerp current -> target and apply transforms
    const loop = () => {
      current.current.x = lerp(current.current.x, target.current.x, ease);
      current.current.y = lerp(current.current.y, target.current.y, ease);

      const cx = current.current.x;
      const cy = current.current.y;

      // Map layer transforms (adjust multipliers to taste)
      // Background grid (far) - small opposite movement
      if (gridRef.current) {
        const gx = cx * -10; // px
        const gy = cy * -10;
        gridRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        gridRef.current.style.willChange = 'transform';
      }

      // Gradient blobs (mid/back) - more pronounced
      if (gradRef.current) {
        const gx = cx * 40; // px
        const gy = cy * 30;
        gradRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        gradRef.current.style.willChange = 'transform';
      }

      // Logo text (far-mid) - large subtle translation
      if (logoRef.current) {
        // we want text to move noticeably but not too much
        const lx = cx * -40; // px
        const ly = cy * -20;
        // Use translateZ(0) to force GPU and prevent paint jank from background-clip
        logoRef.current.style.transform = `translate3d(${lx}px, ${ly}px, 0) translateZ(0)`;
        logoRef.current.style.willChange = 'transform';
      }

      // Person (front) - moves with pointer (same direction)
      if (personRef.current) {
        const px = cx * 30;
        const py = cy * 12;
        personRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        personRef.current.style.willChange = 'transform';
      }

      // Acid grid mask center (for radial mask position) - convert to percents
      if (acidMaskRef.current) {
        const percX = 50 + cx * 18; // center shift
        const percY = 50 + cy * 18;
        const mask = `radial-gradient(600px circle at ${percX}% ${percY}%, black, transparent)`;
        acidMaskRef.current.style.maskImage = mask;
        acidMaskRef.current.style.webkitMaskImage = mask;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener('pointermove', onPointerMove as any);
      el.removeEventListener('touchmove', onTouchMove as any);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      // container needs to accept pointer events
      className="relative w-full h-[90vh] bg-[#090909] overflow-hidden flex flex-col items-center justify-center text-white cursor-crosshair perspective-1000 pointer-events-auto"
    >

      {/* Animated Gradient Orbs (mid layer) */}
      <div
        ref={gradRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
        aria-hidden
        style={{ transition: 'transform 0.02s linear' }}
      >
        {/* Acid Green Blob */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[120px] mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, #CCFF00 0%, transparent 60%)',
            top: '0%',
            left: '50%',
            transform: 'translate(-50%, -20%)',
          }}
        />
        {/* Pink/Magenta Blob */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-20 blur-[100px] mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, #FF006E 0%, transparent 60%)',
            bottom: '0%',
            left: '10%',
          }}
        />
        {/* Cyan Blob */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[90px] mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, #00D4FF 0%, transparent 60%)',
            top: '40%',
            right: '10%',
          }}
        />
      </div>

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* BACKGROUND GRID (furthest) */}
      <div
        ref={gridRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-[0]"
        aria-hidden
        style={{ transition: 'transform 0.02s linear' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            opacity: 0.3,
          }}
        />
        <div
          ref={acidMaskRef}
          className="absolute inset-0 opacity-60 mix-blend-overlay"
          style={{
            backgroundImage:
              'linear-gradient(#CCFF00 1px, transparent 1px), linear-gradient(90deg, #CCFF00 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: `radial-gradient(600px circle at 50% 50%, black, transparent)`,
            WebkitMaskImage: `radial-gradient(600px circle at 50% 50%, black, transparent)`,
          }}
        />
      </div>

      {/* LOGO / BIG TEXT */}
      <div
        ref={logoRef}
        className="absolute z-[2] flex items-center justify-center w-full h-full pointer-events-none select-none"
        aria-hidden
        // big text should be blendy & GPU accelerated; we move it with translate3d in RAF
        style={{
          // no CSS transition here — we rely on RAF updates
          // keep text rendering fast
          willChange: 'transform',
        }}
      >
        <h1
          className="text-[18vw] font-display font-bold uppercase tracking-tighter leading-none whitespace-nowrap"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 60px rgba(204, 255, 0, 0.15))',
            transform: 'translateZ(0)',
            // hint to browser that transform will change frequently
            willChange: 'transform',
            pointerEvents: 'none',
          }}
        >
          Backlog
        </h1>
      </div>

      {/* PERSON (front/mid) */}
      <div
        ref={personRef}
        className="absolute bottom-0 z-[10] w-full flex justify-center items-end pointer-events-none"
        aria-hidden
        style={{ transition: 'transform 0.02s linear' }}
      >
        <div className="relative w-[800px] max-w-full h-[85vh]">
          {/* <div
            className="absolute inset-0 blur-3xl opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center bottom, #CCFF00 0%, transparent 60%)',
              transform: 'scale(0.8) translateY(10%)',
            }}
          /> */}
          <Image
            src="/man.png"
            alt="Model"
            fill
            className="object-cover drop-shadow-2xl"
            style={{
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              filter: 'contrast(1.1) brightness(1.05)',
            }}
            draggable={false}
            priority
          />
        </div>
      </div>

      {/* FOREGROUND UI */}
      <div className="relative z-[20] w-full h-full flex flex-col justify-between p-6 md:p-12 pointer-events-none">
        <div className="flex justify-between items-start transition-all duration-700 delay-500 opacity-70 pointer-events-none">
          <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            <span className="flex items-center gap-2 text-white">
              <Globe size={12} className="text-[#CCFF00] animate-pulse" /> Global_Server_01
            </span>
            <span>Est. 2024</span>
          </div>
          <div className="hidden md:flex items-center gap-4 pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-neutral-400">LIVE</span>
            </div>
            <Maximize2 size={20} className="text-neutral-600 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>

     

        <div className="flex justify-between items-end pointer-events-auto">
          <div className="hidden md:block max-w-xs">
            <p className="font-mono text-[10px] text-neutral-400 leading-relaxed uppercase">
              Reimagining the silhouette of the modern underground. <br />
              Raw textures. Heavy weights. No compromise.
            </p>
          </div>

          <button className="group relative bg-white text-black h-16 px-10 font-display font-bold uppercase text-lg tracking-widest overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 skew-x-[-10deg] shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:shadow-[0_0_60px_rgba(204,255,0,0.5)] pointer-events-auto">
            <div className="skew-x-[10deg] flex items-center gap-3">
              Shop Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute top-0 -left-full w-[200%] h-full bg-[#CCFF00] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
     

      {/* Corner accents */}
      <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-white/10 pointer-events-none" />
      <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-white/10 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-white/10 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-white/10 pointer-events-none" />
    </section>
  );
};

export default Hero;
