'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartService, Cart, CartItem } from '@/lib/services/cart-service';
import { useAuth } from './use-auth';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  subtotal: string;
  addToCart: (variantId: number, quantity?: number) => Promise<{ success: boolean; message?: string }>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<{ success: boolean; message?: string }>;
  removeItem: (cartItemId: number) => Promise<{ success: boolean; message?: string }>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Fetch cart on mount and when auth status changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const cartData = await CartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (variantId: number, quantity: number = 1) => {
      try {
        const result = await CartService.addToCart(variantId, quantity);

        if (result.success && result.cart) {
          setCart(result.cart);
        }

        return result;
      } catch (error) {
        console.error('Add to cart error:', error);
        return {
          success: false,
          message: 'Failed to add to cart',
        };
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (cartItemId: number, quantity: number) => {
      try {
        // Optimistic update
        if (cart) {
          const updatedItems = cart.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          );

          const newSubtotal = updatedItems
            .reduce((sum, item) => {
              return sum + parseFloat(item.product.basePrice) * item.quantity;
            }, 0)
            .toFixed(2);

          setCart({
            ...cart,
            items: updatedItems,
            subtotal: newSubtotal,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          });
        }

        const result = await CartService.updateCartItem(cartItemId, quantity);

        if (result.success && result.cart) {
          setCart(result.cart);
        } else if (!result.success) {
          // Revert optimistic update on failure
          await fetchCart();
        }

        return result;
      } catch (error) {
        console.error('Update quantity error:', error);
        await fetchCart(); // Revert on error
        return {
          success: false,
          message: 'Failed to update quantity',
        };
      }
    },
    [cart, fetchCart]
  );

  const removeItem = useCallback(
    async (cartItemId: number) => {
      try {
        // Optimistic update
        if (cart) {
          const updatedItems = cart.items.filter((item) => item.id !== cartItemId);

          const newSubtotal = updatedItems
            .reduce((sum, item) => {
              return sum + parseFloat(item.product.basePrice) * item.quantity;
            }, 0)
            .toFixed(2);

          setCart({
            ...cart,
            items: updatedItems,
            subtotal: newSubtotal,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          });
        }

        const result = await CartService.removeFromCart(cartItemId);

        if (result.success && result.cart) {
          setCart(result.cart);
        } else if (!result.success) {
          // Revert optimistic update on failure
          await fetchCart();
        }

        return result;
      } catch (error) {
        console.error('Remove item error:', error);
        await fetchCart(); // Revert on error
        return {
          success: false,
          message: 'Failed to remove item',
        };
      }
    },
    [cart, fetchCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await CartService.clearCart();
      setCart(null);
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  const itemCount = cart?.totalItems || 0;
  const subtotal = cart?.subtotal || '0.00';

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
