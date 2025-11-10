'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  ImageIcon,
} from 'lucide-react';
import { AdminAuthService } from '@/lib/admin-auth';

interface ProductVariant {
  id?: number;
  sku: string;
  size?: string;
  colorName?: string;
  colorHexCode?: string;
  stockQuantity: number;
}

interface ProductImage {
  id?: number;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  variantId?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  sizeGuideId?: number;
  variants: ProductVariant[];
  images: ProductImage[];
  _count: {
    reviews: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    category: '',
    isActive: true,
    sizeGuideId: '',
  });

  // Variants and Images state
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);

  // Variant form
  const [variantForm, setVariantForm] = useState<ProductVariant>({
    sku: '',
    size: '',
    colorName: '',
    colorHexCode: '',
    stockQuantity: 0,
  });

  // Image form
  const [imageForm, setImageForm] = useState<ProductImage>({
    imageUrl: '',
    altText: '',
    displayOrder: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [filterActive]);

  const fetchProducts = async () => {
    try {
      const token = AdminAuthService.getToken();
      let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/products`;

      if (filterActive !== null) {
        url += `?isActive=${filterActive}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addVariant = () => {
    if (!variantForm.sku) {
      alert('SKU is required');
      return;
    }
    setVariants([...variants, { ...variantForm }]);
    setVariantForm({
      sku: '',
      size: '',
      colorName: '',
      colorHexCode: '',
      stockQuantity: 0,
    });
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (!imageForm.imageUrl) {
      alert('Image URL is required');
      return;
    }
    setImages([...images, { ...imageForm }]);
    setImageForm({
      imageUrl: '',
      altText: '',
      displayOrder: images.length + 1,
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      isActive: product.isActive,
      sizeGuideId: product.sizeGuideId?.toString() || '',
    });
    setVariants(product.variants);
    setImages(product.images);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      category: '',
      isActive: true,
      sizeGuideId: '',
    });
    setVariants([]);
    setImages([]);
    setIsEditMode(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = AdminAuthService.getToken();
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        sizeGuideId: formData.sizeGuideId ? parseInt(formData.sizeGuideId) : undefined,
        variants: variants.length > 0 ? variants : undefined,
        images: images.length > 0 ? images : undefined,
      };

      const url = isEditMode && selectedProduct
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/products/${selectedProduct.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/products`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        resetForm();
        setIsDialogOpen(false);
        fetchProducts();
        alert(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        alert(data.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} product:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = AdminAuthService.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/admin/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-zinc-400 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-zinc-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1">Products</h1>
          <p className="text-sm text-zinc-500">Manage your product catalog</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-white hover:bg-zinc-200 text-black w-full sm:w-auto" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                {isEditMode ? 'Update product details, variants, and images' : 'Create a new product with variants and images'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-300">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={4}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice" className="text-zinc-300">Base Price *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      placeholder="0.00"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-zinc-300">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., T-SHIRT"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sizeGuideId" className="text-zinc-300">Size Guide ID</Label>
                    <Input
                      id="sizeGuideId"
                      type="number"
                      value={formData.sizeGuideId}
                      onChange={(e) => setFormData({ ...formData, sizeGuideId: e.target.value })}
                      placeholder="Optional"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded"
                  />
                  <Label htmlFor="isActive" className="text-zinc-300 cursor-pointer">
                    Set as active product
                  </Label>
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">Product Variants</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                  <Input
                    placeholder="SKU *"
                    value={variantForm.sku}
                    onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                  <Input
                    placeholder="Size"
                    value={variantForm.size}
                    onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                  <Input
                    placeholder="Color Name"
                    value={variantForm.colorName}
                    onChange={(e) => setVariantForm({ ...variantForm, colorName: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                  <Input
                    placeholder="Hex Code"
                    value={variantForm.colorHexCode}
                    onChange={(e) => setVariantForm({ ...variantForm, colorHexCode: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={variantForm.stockQuantity}
                      onChange={(e) => setVariantForm({ ...variantForm, stockQuantity: parseInt(e.target.value) || 0 })}
                      className="bg-zinc-800 border-zinc-700 text-white text-sm"
                    />
                    <Button type="button" onClick={addVariant} size="sm" className="bg-white text-black hover:bg-zinc-200">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {variants.length > 0 && (
                  <div className="space-y-2">
                    {variants.map((variant, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-zinc-800/50 rounded-md border border-zinc-800">
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm text-zinc-300 w-full">
                          <span><strong>SKU:</strong> {variant.sku}</span>
                          <span><strong>Size:</strong> {variant.size || 'N/A'}</span>
                          <span><strong>Color:</strong> {variant.colorName || 'N/A'}</span>
                          <span><strong>Hex:</strong> {variant.colorHexCode || 'N/A'}</span>
                          <span><strong>Stock:</strong> {variant.stockQuantity}</span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeVariant(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">Product Images</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <Input
                    placeholder="Image URL *"
                    value={imageForm.imageUrl}
                    onChange={(e) => setImageForm({ ...imageForm, imageUrl: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white text-sm col-span-2"
                  />
                  <Input
                    placeholder="Alt Text"
                    value={imageForm.altText}
                    onChange={(e) => setImageForm({ ...imageForm, altText: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white text-sm"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Order"
                      value={imageForm.displayOrder}
                      onChange={(e) => setImageForm({ ...imageForm, displayOrder: parseInt(e.target.value) || 0 })}
                      className="bg-zinc-800 border-zinc-700 text-white text-sm"
                    />
                    <Button type="button" onClick={addImage} size="sm" className="bg-white text-black hover:bg-zinc-200">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative p-3 bg-zinc-800/50 rounded-md border border-zinc-800">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="text-sm text-zinc-300">
                          <p className="truncate mb-1"><strong>URL:</strong> {image.imageUrl}</p>
                          <p><strong>Alt:</strong> {image.altText || 'N/A'}</p>
                          <p><strong>Order:</strong> {image.displayOrder}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white hover:bg-zinc-200 text-black"
                >
                  {isSubmitting
                    ? (isEditMode ? 'Updating...' : 'Creating...')
                    : (isEditMode ? 'Update Product' : 'Create Product')
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="border-b border-zinc-800">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 w-full focus:border-zinc-600"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterActive === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterActive(null)}
                className={filterActive === null ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-400'}
              >
                All
              </Button>
              <Button
                variant={filterActive === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterActive(true)}
                className={filterActive === true ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-400'}
              >
                Active
              </Button>
              <Button
                variant={filterActive === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterActive(false)}
                className={filterActive === false ? 'bg-white text-black hover:bg-zinc-200' : 'border-zinc-700 text-zinc-400'}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">No products found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-zinc-800 rounded-md overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-zinc-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-1">
                        <h3 className="font-medium text-white truncate">{product.name}</h3>
                        <Badge
                          variant={product.isActive ? 'default' : 'secondary'}
                          className={`${product.isActive ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 border-zinc-700'} w-fit`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500 mb-2 line-clamp-2 sm:line-clamp-1">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-zinc-500">
                        <span className="text-white font-medium">
                          ${parseFloat(product.basePrice).toFixed(2)}
                        </span>
                        <span>{product.category}</span>
                        <span className="hidden sm:inline">{product.variants.length} variants</span>
                        <span className="hidden sm:inline">{product.images.length} images</span>
                        <span className="hidden md:inline">{product._count.reviews} reviews</span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(product)}
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="View product details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit product"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteProduct(product.id)}
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Product Details</DialogTitle>
            <DialogDescription className="text-zinc-400">
              View complete product information
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500 mb-1">Product Name</p>
                    <p className="text-white font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Category</p>
                    <p className="text-white font-medium">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Base Price</p>
                    <p className="text-white font-medium">${parseFloat(selectedProduct.basePrice).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Status</p>
                    <Badge
                      variant={selectedProduct.isActive ? 'default' : 'secondary'}
                      className={selectedProduct.isActive ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'}
                    >
                      {selectedProduct.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-zinc-500 mb-1">Description</p>
                    <p className="text-white">{selectedProduct.description || 'No description'}</p>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">
                  Variants ({selectedProduct.variants.length})
                </h3>
                <div className="space-y-2">
                  {selectedProduct.variants.map((variant, index) => (
                    <div key={index} className="p-3 bg-zinc-800/50 rounded-md border border-zinc-800">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm text-zinc-300">
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">SKU</p>
                          <p className="text-white font-mono">{variant.sku}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">Size</p>
                          <p className="text-white">{variant.size || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">Color</p>
                          <div className="flex items-center gap-2">
                            {variant.colorHexCode && (
                              <div
                                className="w-4 h-4 rounded border border-zinc-700"
                                style={{ backgroundColor: variant.colorHexCode }}
                              />
                            )}
                            <p className="text-white">{variant.colorName || 'N/A'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">Hex Code</p>
                          <p className="text-white font-mono text-xs">{variant.colorHexCode || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs mb-1">Stock</p>
                          <p className="text-white font-medium">{variant.stockQuantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">
                  Images ({selectedProduct.images.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProduct.images.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-square bg-zinc-800 rounded-md overflow-hidden border border-zinc-700">
                        <img
                          src={image.imageUrl}
                          alt={image.altText || selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs text-zinc-400">
                        <p><strong>Alt Text:</strong> {image.altText || 'N/A'}</p>
                        <p><strong>Display Order:</strong> {image.displayOrder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(selectedProduct);
                  }}
                  className="bg-white hover:bg-zinc-200 text-black"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
