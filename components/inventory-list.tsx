'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ShoppingCart, Info } from 'lucide-react';

// Unified Product List - Simulating your 10 items
const INVENTORY = [
  { id: '01', name: 'Cyber Jacket V2', category: 'Outerwear', price: 3500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop', desc: 'Water-resistant nylon shell with tactical pockets.' },
  { id: '02', name: 'Wide Cargo Black', category: 'Bottoms', price: 2200, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop', desc: 'Heavyweight cotton canvas with adjustable hem.' },
  { id: '03', name: 'Vintage Bomber', category: 'Outerwear', price: 2800, status: 'Sold Out', image: 'https://images.unsplash.com/photo-1551028919-ac66e624ec06?q=80&w=600&auto=format&fit=crop', desc: 'Authentic distressed leather finish.' },
  { id: '04', name: 'Oversized Hoodie', category: 'Tops', price: 1500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop', desc: '400GSM french terry cotton. Drop shoulder fit.' },
  { id: '05', name: 'Acid Wash Jeans', category: 'Bottoms', price: 2500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=600&auto=format&fit=crop', desc: 'Hand-treated denim. No two pairs are alike.' },
  { id: '06', name: 'Tactical Vest', category: 'Accessories', price: 1800, status: 'In Stock', image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=600&auto=format&fit=crop', desc: 'Utility vest with multiple functional compartments.' },
  { id: '07', name: 'Graphic Tee 001', category: 'Tops', price: 1200, status: 'In Stock', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop', desc: 'Screen printed graphics on vintage wash tee.' },
];

const InventoryList: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(INVENTORY[0]);

  return (
    <section className="bg-[#050505] min-h-screen py-24 border-t border-neutral-900 relative">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
           <div>
              <span className="text-backlog-accent font-mono text-xs uppercase tracking-[0.3em] mb-2 block">Archive_V4.0</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase text-white leading-none">
                Inventory
              </h2>
           </div>
           <p className="text-neutral-500 font-mono text-xs md:max-w-xs leading-relaxed">
             Full catalog access. Select an item to view detailed specifications and availability.
           </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 h-full">

          {/* LEFT COLUMN: Inventory List */}
          <div className="w-full lg:w-5/12">
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 uppercase pb-4 border-b border-neutral-800 tracking-wider">
               <span className="w-12">ID</span>
               <span className="flex-1">Product Name</span>
               <span className="w-24 text-right">Price</span>
               <span className="w-6"></span>
            </div>

            <div className="flex flex-col">
              {INVENTORY.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group flex items-center justify-between py-6 border-b border-neutral-900 transition-all duration-300 text-left hover:bg-neutral-900/30 px-2 ${selectedItem.id === item.id ? 'bg-neutral-900/50' : ''}`}
                >
                  <span className={`w-12 text-xs font-mono ${selectedItem.id === item.id ? 'text-backlog-accent' : 'text-neutral-600'}`}>
                    {item.id}
                  </span>

                  <div className="flex-1">
                     <h3 className={`text-lg md:text-xl font-display uppercase tracking-wide transition-colors ${selectedItem.id === item.id ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                       {item.name}
                     </h3>
                     <span className="text-[10px] font-mono text-neutral-600 uppercase group-hover:text-neutral-500">
                       {item.category} {'//'} {item.status}
                     </span>
                  </div>

                  <span className="w-24 text-right font-mono text-sm text-neutral-300 group-hover:text-backlog-accent transition-colors">
                    Rs {item.price}
                  </span>

                  <span className="w-6 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} className="text-backlog-accent" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Preview (Sticky) */}
          <div className="hidden lg:block w-full lg:w-7/12 relative h-[800px]">
            <div className="sticky top-32 w-full h-full border border-neutral-800 bg-neutral-900/20 backdrop-blur-sm overflow-hidden group">

               {/* Decorative Tech UI */}
               <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-20 mix-blend-difference text-white/50">
                  <span className="font-mono text-[10px]">PREVIEW_MODE</span>
                  <span className="font-mono text-[10px]">SCALE: 100%</span>
               </div>

               {/* Image */}
               <Image
                 key={selectedItem.id}
                 src={selectedItem.image}
                 alt={selectedItem.name}
                 fill
                 className="object-cover grayscale brightness-75 contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                 unoptimized
               />

               {/* Info Overlay */}
               <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-8 z-20">
                  <div className="flex justify-between items-end">
                     <div>
                       <h3 className="text-4xl font-display font-bold uppercase text-white mb-2">{selectedItem.name}</h3>
                       <p className="text-neutral-400 font-mono text-sm max-w-md mb-6">{selectedItem.desc}</p>

                       <div className="flex gap-4">
                         <span className="px-3 py-1 border border-neutral-700 text-neutral-300 text-xs font-mono uppercase rounded-full">
                           {selectedItem.category}
                         </span>
                         {selectedItem.status === 'Low Stock' && (
                           <span className="px-3 py-1 bg-red-900/30 border border-red-900 text-red-400 text-xs font-mono uppercase rounded-full animate-pulse">
                             Low Stock
                           </span>
                         )}
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                        <button className="bg-backlog-accent text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                           Add to Cart <ShoppingCart size={18} />
                        </button>
                        <button className="border border-neutral-700 text-white px-8 py-3 font-bold uppercase tracking-widest hover:border-white transition-colors text-xs flex items-center justify-center gap-2">
                           Details <Info size={14} />
                        </button>
                     </div>
                  </div>
               </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryList;
