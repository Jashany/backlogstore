'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/lib/services/product-service';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-zinc-900 border-2 border-white/10 flex items-center justify-center">
        <p className="text-zinc-600 uppercase text-sm font-bold">No Image</p>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-900 border-2 border-white/10">
        <Image
          src={selectedImage.imageUrl}
          alt={selectedImage.altText || productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden border-2 transition-colors ${
                selectedIndex === index
                  ? 'border-white'
                  : 'border-white/20 hover:border-white/50'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || `${productName} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
