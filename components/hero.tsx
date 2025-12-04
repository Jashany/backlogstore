import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Globe, Maximize2 } from 'lucide-react';

// --- Utilities ---
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // -- Refs for animation elements --
  // We use direct DOM manipulation for 60fps performance without React render overhead
  const gridRef = useRef<HTMLDivElement>(null);
  const textBackRef = useRef<HTMLDivElement>(null);
  const textFrontRef = useRef<HTMLDivElement>(null); // For a cool split/glitch effect
  const modelRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const cursorLightRef = useRef<HTMLDivElement>(null);

  // -- State for Motion Physics --
  // Target: where the mouse is (normalized -1 to 1)
  const target = useRef({ x: 0, y: 0 });
  // Current: where the animation is currently at
  const current = useRef({ x: 0, y: 0 });

  // -- Dust Particles (generated once during initial render using lazy state initializer) --
  type Particle = { width: string; height: string; top: string; left: string; opacity: number };
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 20 }).map(() => ({
      width: `${Math.random() * 3}px`,
      height: `${Math.random() * 3}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.2,
    }))
  );
  
  // -- Animation Loop --
  useEffect(() => {
    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;

      target.current = { x, y };

      // Update the "Spotlight" immediately for zero-latency feel on the light itself
      if (cursorLightRef.current) {
        cursorLightRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const loop = () => {
      // 1. Lerp physics (Smoothness factor: 0.08 is a good balance of weight and snap)
      current.current.x = lerp(current.current.x, target.current.x, 0.08);
      current.current.y = lerp(current.current.y, target.current.y, 0.08);

      const { x, y } = current.current;

      // 2. Apply Transforms
      
      // Layer 1: Grid (Background) - Moves slightly opposite to mouse
      if (gridRef.current) {
        const moveX = x * -20;
        const moveY = y * -20;
        // Using translate3d for GPU acceleration
        gridRef.current.style.transform = `perspective(1000px) rotateX(${y * 2}deg) rotateY(${x * -2}deg) translate3d(${moveX}px, ${moveY}px, 0)`;
      }

      // Layer 2: Big Text (Mid-Background) - Moves opposite, slower than grid
      if (textBackRef.current) {
        const moveX = x * -40;
        const moveY = y * -15;
        textBackRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }

      // Layer 3: Model (Foreground) - Moves WITH mouse (Parallax depth)
      if (modelRef.current) {
        const moveX = x * 35;
        const moveY = y * 15;
        modelRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`; 
      }

      // Layer 4: Dust/Particles (Atmosphere) - Moves opposite, fast
      if (dustRef.current) {
        const moveX = x * -60;
        const moveY = y * -60;
        dustRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onPointerMove);
    loop();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[100svh] h-[100dvh] bg-[#050505] overflow-hidden flex flex-col items-center justify-center cursor-crosshair select-none"
    >
      {/* --- Ambient Noise Texture (Static) - Hidden on mobile for performance --- */}
      <div 
        className="absolute inset-0 pointer-events-none z-[50] opacity-[0.12] mix-blend-overlay hidden sm:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* --- Dynamic Cursor Spotlight - Hidden on mobile --- */}
      <div 
        ref={cursorLightRef}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#CCFF00] rounded-full blur-[120px] opacity-10 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[1] will-change-transform hidden md:block"
      />

      {/* --- Layer 1: The Grid - Simplified on mobile --- */}
      <div 
        ref={gridRef}
        className="absolute inset-[-10%] w-[120%] h-[120%] z-0 opacity-20 sm:opacity-30 pointer-events-none will-change-transform"
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)'
          }}
        />
      </div>

      {/* --- Layer 2: Massive Typography --- */}
      <div className="absolute inset-0 flex items-center justify-center z-2 pointer-events-none select-none overflow-hidden">
        <h1 
          ref={textBackRef}
          className="font-sans font-bold text-[32vw] sm:text-[26vw] md:text-[22vw] leading-none text-[#1A1A1A] tracking-tight will-change-transform whitespace-nowrap"
        >
          BACKLOG
        </h1>
      </div>

      {/* --- Layer 4: Dust/Particles - Hidden on mobile --- */}
      <div 
        ref={dustRef}
        className="absolute inset-[-20%] w-[140%] h-[140%] z-5 pointer-events-none opacity-40 will-change-transform hidden sm:block"
      >
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* --- Layer 3: The Model (Parallax Subject) --- */}
      <div 
        ref={modelRef}
        className="absolute bottom-0 z-10 h-[60vh] sm:h-[65vh] md:h-[80vh] lg:h-[85vh] w-full pointer-events-none flex items-end justify-center will-change-transform"
      >
        <div className="relative h-full w-[90%] sm:w-[75%] md:w-[55vh] lg:w-[70vh] max-w-[450px] md:max-w-none">
          <Image
            src="/man.png"
            alt="Model"
            fill
            priority
            className="object-cover object-top"
            style={{
              maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
              filter: 'contrast(1.2) brightness(0.9) grayscale(100%)',
            }}
            draggable={false}
          />
        </div>
      </div>


      {/* --- Layer 5: Foreground UI (Interactive) --- */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-10 lg:p-12 pointer-events-none pt-20 sm:pt-24 md:pt-28">
        
        {/* Header Area - Simplified on mobile */}
        <div className="flex justify-between items-start pointer-events-auto">
          {/* Left side info - Hidden on very small screens */}
          <div className="hidden xs:flex flex-col gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest">
            <div className="flex items-center gap-2 text-white">
              <Globe size={12} className="text-[#CCFF00] animate-pulse" /> 
              <span className="text-[10px] sm:text-xs">Global_Server_01</span>
            </div>
            <div className="h-px w-16 sm:w-20 bg-neutral-800" />
            <span className="text-[9px] sm:text-xs">Est. 2024</span>
          </div>

          {/* System status - Hidden on mobile */}
          <button className="group hidden md:flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-neutral-300">SYSTEM_ONLINE</span>
            <Maximize2 size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Footer / CTA Area */}
        <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:justify-between md:items-end pointer-events-auto">
          
          {/* Description - Simplified on mobile */}
          <div className="max-w-[280px] sm:max-w-sm md:max-w-md space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
                <div className="w-5 sm:w-8 h-px bg-[#CCFF00]" />
                <span className="font-mono text-[#CCFF00] text-[10px] sm:text-xs">COLLECTION_004</span>
            </div>
            <p className="font-sans text-neutral-400 text-[11px] sm:text-sm md:text-base leading-relaxed uppercase tracking-wide">
              <span className="hidden sm:inline">Reimagining the silhouette of the modern underground. </span>
              Raw textures. Heavy weights. No compromise.
            </p>
          </div>

          {/* CTA Button */}
          <button className="relative group bg-white text-black h-11 sm:h-14 md:h-16 px-5 sm:px-8 md:px-12 overflow-hidden transform -skew-x-12 hover:-skew-x-6 transition-all duration-300 shadow-[0_0_20px_rgba(204,255,0,0.1)] hover:shadow-[0_0_50px_rgba(204,255,0,0.6)] w-fit">
            <div className="skew-x-12 group-hover:skew-x-6 transition-all duration-300 flex items-center gap-2 sm:gap-4 font-sans font-bold text-sm sm:text-lg md:text-xl uppercase tracking-wider">
              <span>Enter Store</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            
            {/* Hover Fill Effect */}
            <div className="absolute inset-0 bg-[#CCFF00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out -z-10" />
          </button>
        </div>
      </div>

      {/* --- HUD/Deco Elements - Hidden on mobile --- */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none opacity-50 hidden sm:flex">
        <div className="w-px h-12 bg-linear-to-b from-transparent via-white/50 to-transparent" />
      </div>

      {/* Corner Brackets - Hidden on very small screens */}
      <div className="absolute top-20 sm:top-24 md:top-28 left-4 md:left-8 w-3 h-3 sm:w-4 sm:h-4 border-t border-l border-white/30 hidden sm:block" />
      <div className="absolute top-20 sm:top-24 md:top-28 right-4 md:right-8 w-3 h-3 sm:w-4 sm:h-4 border-t border-r border-white/30 hidden sm:block" />
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 w-3 h-3 sm:w-4 sm:h-4 border-b border-l border-white/30 hidden sm:block" />
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 w-3 h-3 sm:w-4 sm:h-4 border-b border-r border-white/30 hidden sm:block" />

    </section>
  );
};

export default Hero;