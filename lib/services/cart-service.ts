import { AuthService } from '../auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: string;
  totalItems: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  variant: {
    id: number;
    sku: string;
    size: string | null;
    colorName: string | null;
    colorHexCode: string | null;
    stockQuantity: number;
  };
  product: {
    id: number;
    name: string;
    mainImageUrl: string | null;
    basePrice: string;
  };
}

/**
 * Cart Service
 * Handles shopping cart operations
 * Supports both authenticated users and guest sessions
 */
export class CartService {
  private static GUEST_SESSION_KEY = 'guest_session_id';

  /**
   * Get or create guest session ID
   */
  private static getGuestSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem(this.GUEST_SESSION_KEY);

    if (!sessionId) {
      // Generate random session ID
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(this.GUEST_SESSION_KEY, sessionId);
    }

    return sessionId;
  }

  /**
   * Clear guest session (called after user logs in)
   */
  static clearGuestSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.GUEST_SESSION_KEY);
    }
  }

  /**
   * Get cart (works for both authenticated and guest users)
   */
  static async getCart(): Promise<Cart | null> {
    try {
      // Try authenticated request first
      const accessToken = await AuthService.getValidAccessToken();

      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {
              'X-Guest-Session-Id': this.getGuestSessionId(),
            },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No cart exists yet
          return null;
        }
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      return data.cart;
    } catch (error) {
      console.error('Get cart error:', error);
      return null;
    }
  }

  /**
   * Add item to cart
   */
  static async addToCart(
    variantId: number,
    quantity: number = 1
  ): Promise<{ success: boolean; message?: string; cart?: Cart }> {
    try {
      const accessToken = await AuthService.getValidAccessToken();

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : { 'X-Guest-Session-Id': this.getGuestSessionId() }),
        },
        body: JSON.stringify({ variantId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error?.message || 'Failed to add to cart',
        };
      }

      return {
        success: true,
        message: 'Added to cart',
        cart: data.cart,
      };
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        message: 'Failed to add to cart',
      };
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(
    cartItemId: number,
    quantity: number
  ): Promise<{ success: boolean; message?: string; cart?: Cart }> {
    try {
      const accessToken = await AuthService.getValidAccessToken();

      const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : { 'X-Guest-Session-Id': this.getGuestSessionId() }),
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error?.message || 'Failed to update cart',
        };
      }

      return {
        success: true,
        cart: data.cart,
      };
    } catch (error) {
      console.error('Update cart item error:', error);
      return {
        success: false,
        message: 'Failed to update cart',
      };
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(
    cartItemId: number
  ): Promise<{ success: boolean; message?: string; cart?: Cart }> {
    try {
      const accessToken = await AuthService.getValidAccessToken();

      const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}`, {
        method: 'DELETE',
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : { 'X-Guest-Session-Id': this.getGuestSessionId() },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error?.message || 'Failed to remove from cart',
        };
      }

      return {
        success: true,
        cart: data.cart,
      };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        message: 'Failed to remove from cart',
      };
    }
  }

  /**
   * Clear entire cart
   */
  static async clearCart(): Promise<{ success: boolean }> {
    try {
      const cart = await this.getCart();
      if (!cart || cart.items.length === 0) {
        return { success: true };
      }

      // Remove each item
      for (const item of cart.items) {
        await this.removeFromCart(item.id);
      }

      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false };
    }
  }
}
