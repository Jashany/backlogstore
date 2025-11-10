import { AuthService } from '../auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Address {
  id: number;
  label: string | null;
  fullName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateAddressPayload {
  label?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault?: boolean;
}

/**
 * Address Service
 * Handles user address management (requires authentication)
 */
export class AddressService {
  /**
   * Get all user addresses
   */
  static async getAddresses(): Promise<Address[]> {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/addresses`);

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      return data.addresses || [];
    } catch (error) {
      console.error('Get addresses error:', error);
      throw error;
    }
  }

  /**
   * Get single address by ID
   */
  static async getAddressById(addressId: number): Promise<Address> {
    try {
      const response = await AuthService.authenticatedFetch(
        `${API_BASE_URL}/addresses/${addressId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Address not found');
        }
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      return data.address;
    } catch (error) {
      console.error('Get address error:', error);
      throw error;
    }
  }

  /**
   * Create new address
   */
  static async createAddress(
    payload: CreateAddressPayload
  ): Promise<{ success: boolean; message?: string; address?: Address }> {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/addresses`, {
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
          message: data.error?.message || 'Failed to create address',
        };
      }

      return {
        success: true,
        message: 'Address created successfully',
        address: data.address,
      };
    } catch (error) {
      console.error('Create address error:', error);
      return {
        success: false,
        message: 'Failed to create address',
      };
    }
  }

  /**
   * Update existing address
   */
  static async updateAddress(
    addressId: number,
    payload: Partial<CreateAddressPayload>
  ): Promise<{ success: boolean; message?: string; address?: Address }> {
    try {
      const response = await AuthService.authenticatedFetch(
        `${API_BASE_URL}/addresses/${addressId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error?.message || 'Failed to update address',
        };
      }

      return {
        success: true,
        message: 'Address updated successfully',
        address: data.address,
      };
    } catch (error) {
      console.error('Update address error:', error);
      return {
        success: false,
        message: 'Failed to update address',
      };
    }
  }

  /**
   * Delete address
   */
  static async deleteAddress(
    addressId: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await AuthService.authenticatedFetch(
        `${API_BASE_URL}/addresses/${addressId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          message: data.error?.message || 'Failed to delete address',
        };
      }

      return {
        success: true,
        message: 'Address deleted successfully',
      };
    } catch (error) {
      console.error('Delete address error:', error);
      return {
        success: false,
        message: 'Failed to delete address',
      };
    }
  }

  /**
   * Set address as default
   */
  static async setDefaultAddress(
    addressId: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await AuthService.authenticatedFetch(
        `${API_BASE_URL}/addresses/${addressId}/set-default`,
        {
          method: 'PATCH',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error?.message || 'Failed to set default address',
        };
      }

      return {
        success: true,
        message: 'Default address updated',
      };
    } catch (error) {
      console.error('Set default address error:', error);
      return {
        success: false,
        message: 'Failed to set default address',
      };
    }
  }

  /**
   * Format address for display
   */
  static formatAddress(address: Address): string {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);

    return parts.join(', ');
  }
}
