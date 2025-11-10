import { AuthService } from '../auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  trackingNumber: string | null;
  notes: string | null;
}

export interface OrderItem {
  id: number;
  quantity: number;
  priceAtPurchase: string;
  productName: string;
  productImageUrl: string | null;
  variantSku: string;
  variantSize: string | null;
  variantColor: string | null;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface CreateOrderPayload {
  addressId?: number;
  shippingAddress?: ShippingAddress;
  paymentInfo: {
    paymentMethod: string;
  };
  notes?: string;
}

/**
 * Order Service
 * Handles order operations (requires authentication)
 */
export class OrderService {
  /**
   * Create order from current cart
   */
  static async createOrder(
    payload: CreateOrderPayload
  ): Promise<{ success: boolean; message?: string; order?: Order }> {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error?.message || 'Failed to create order',
        };
      }

      return {
        success: true,
        message: 'Order placed successfully',
        order: data.order,
      };
    } catch (error) {
      console.error('Create order error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  }

  /**
   * Get user's order history
   */
  static async getOrders(): Promise<Order[]> {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/orders`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  /**
   * Get single order by ID
   */
  static async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/orders/${orderId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(
    orderId: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await AuthService.authenticatedFetch(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        {
          method: 'PATCH',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error?.message || 'Failed to cancel order',
        };
      }

      return {
        success: true,
        message: 'Order cancelled successfully',
      };
    } catch (error) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        message: 'Failed to cancel order',
      };
    }
  }

  /**
   * Get order status display text
   */
  static getStatusText(status: OrderStatus): string {
    const statusMap: Record<OrderStatus, string> = {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      PROCESSING: 'Processing',
      SHIPPED: 'Shipped',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
      REFUNDED: 'Refunded',
    };

    return statusMap[status] || status;
  }

  /**
   * Check if order can be cancelled
   */
  static canCancelOrder(status: OrderStatus): boolean {
    return ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(status);
  }
}
