const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  basePrice: string;
  category: string;
  mainImageUrl: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  sizeGuide: SizeGuide | null;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string | null;
  displayOrder?: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  size: string | null;
  colorName: string | null;
  colorHexCode: string | null;
  stockQuantity: number;
}

export interface SizeGuide {
  name: string;
  contentHtml: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  basePrice: string;
  mainImageUrl: string | null;
  category?: string;
}

export interface ProductFilters {
  category?: string;
  size?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProductReview {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  fitRecommendation: string | null;
  isApproved: boolean;
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
  };
}

/**
 * Product Service
 * Handles all product-related API calls
 */
export class ProductService {
  /**
   * Get list of products with optional filtering
   */
  static async getProducts(filters?: ProductFilters): Promise<ProductListItem[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.category) params.append('category', filters.category);
      if (filters?.size) params.append('size', filters.size);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID with full details
   */
  static async getProductById(productId: number): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  /**
   * Search products by query
   */
  static async searchProducts(query: string, limit = 20): Promise<ProductListItem[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  /**
   * Get product reviews
   */
  static async getProductReviews(productId: number): Promise<ProductReview[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Get reviews error:', error);
      return [];
    }
  }

  /**
   * Create product review (requires authentication)
   */
  static async createReview(
    productId: number,
    reviewData: {
      rating: number;
      title?: string;
      body?: string;
      fitRecommendation?: 'RUNS_SMALL' | 'TRUE_TO_SIZE' | 'RUNS_LARGE';
    },
    accessToken: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create review error:', error);
      return {
        success: false,
        message: 'Failed to submit review',
      };
    }
  }

  /**
   * Get available categories
   */
  static async getCategories(): Promise<string[]> {
    // For now, return static categories
    // In future, could fetch from API
    return ['T-SHIRTS', 'HOODIES'];
  }

  /**
   * Get available sizes
   */
  static getSizes(): string[] {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  }
}
