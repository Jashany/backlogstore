'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/products/image-gallery';
import { VariantSelector } from '@/components/products/variant-selector';
import { ProductService, Product, ProductVariant } from '@/lib/services/product-service';
import { formatPrice } from '@/lib/utils/format-price';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.productId as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await ProductService.getProductById(productId);
      setProduct(data);

      // Auto-select first available variant
      if (data.variants.length > 0) {
        const firstAvailable = data.variants.find((v) => v.stockQuantity > 0);
        if (firstAvailable) {
          setSelectedVariant(firstAvailable);
        }
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
      router.push('/shop');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a size');
      return;
    }

    if (selectedVariant.stockQuantity === 0) {
      toast.error('This item is out of stock');
      return;
    }

    setIsAddingToCart(true);

    try {
      const result = await addToCart(selectedVariant.id, quantity);

      if (result.success) {
        toast.success('Added to cart!', {
          description: `${quantity}x ${product?.name}`,
        });
      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const incrementQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-white border-r-transparent mb-4" />
            <p className="text-zinc-500 uppercase font-bold text-sm">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const hasSizes = product.variants.some((v) => v.size);
  const hasColors = product.variants.some((v) => v.colorName);
  const isInStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-white/10">
          <div className="container mx-auto max-w-7xl px-4 py-4">
            <Link
              href="/shop"
              className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div>
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Product Name & Price */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-white">
                    {formatPrice(product.basePrice)}
                  </p>
                  {selectedVariant && selectedVariant.stockQuantity <= 5 && selectedVariant.stockQuantity > 0 && (
                    <span className="text-sm text-yellow-500 font-bold uppercase">
                      Only {selectedVariant.stockQuantity} left
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pb-6 border-b border-white/10">
                  <p className="text-zinc-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size Selector */}
              {hasSizes && (
                <div className="pb-6 border-b border-white/10">
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onSelectVariant={(variant) => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    groupBy="size"
                  />
                </div>
              )}

              {/* Color Selector */}
              {hasColors && (
                <div className="pb-6 border-b border-white/10">
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onSelectVariant={(variant) => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    groupBy="color"
                  />
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                  Quantity
                </h3>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-white/20">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-3 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <div className="px-6 py-3 font-bold text-white border-x-2 border-white/20 min-w-[60px] text-center">
                      {quantity}
                    </div>

                    <button
                      onClick={incrementQuantity}
                      disabled={!selectedVariant || quantity >= selectedVariant.stockQuantity}
                      className="px-4 py-3 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-sm text-zinc-500">
                    {selectedVariant && `${selectedVariant.stockQuantity} available`}
                  </p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || !isInStock || isAddingToCart}
                className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black uppercase text-lg border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Adding...
                  </span>
                ) : !selectedVariant ? (
                  'Select a Size'
                ) : !isInStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>

              {/* Product Details */}
              <div className="space-y-2 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-white" />
                  <span className="text-zinc-400">Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-white" />
                  <span className="text-zinc-400">Easy returns within 30 days</span>
                </div>
                {selectedVariant?.sku && (
                  <p className="text-xs text-zinc-600 mt-4">
                    SKU: {selectedVariant.sku}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
