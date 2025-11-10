export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  accessToken?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Authentication Service for User Auth
 * Handles login, signup, token management, and profile operations
 * Uses HTTP-only cookies for refresh tokens (set by server)
 * Stores access tokens in memory for security
 */
export class AuthService {
  private static accessToken: string | null = null;
  private static refreshPromise: Promise<string | null> | null = null;

  /**
   * Sign up a new user
   */
  static async signup(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: includes cookies
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (data.success && data.accessToken) {
        this.setAccessToken(data.accessToken);
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Failed to connect to server',
      };
    }
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: includes cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.accessToken) {
        this.setAccessToken(data.accessToken);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Failed to connect to server',
      };
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<AuthResponse> {
    try {
      const token = await this.getValidAccessToken();

      if (!token) {
        return { success: false, message: 'No token found' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Failed to fetch profile',
      };
    }
  }

  /**
   * Refresh the access token using the refresh token cookie
   */
  static async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Refresh token is in HTTP-only cookie
        });

        const data = await response.json();

        if (data.success && data.accessToken) {
          this.setAccessToken(data.accessToken);
          return data.accessToken;
        }

        // Refresh failed, clear token
        this.clearAccessToken();
        return null;
      } catch (error) {
        console.error('Token refresh error:', error);
        this.clearAccessToken();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  static async getValidAccessToken(): Promise<string | null> {
    if (this.accessToken) {
      // Check if token is expired or about to expire
      const isExpired = this.isTokenExpired(this.accessToken);

      if (!isExpired) {
        return this.accessToken;
      }
    }

    // Token is expired or doesn't exist, try to refresh
    return await this.refreshAccessToken();
  }

  /**
   * Check if a JWT token is expired
   */
  private static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      // Consider expired if less than 1 minute remaining
      return expirationTime - currentTime < 60000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint to revoke refresh token
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAccessToken();
    }
  }

  /**
   * Forgot password - request password reset
   */
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Failed to process request',
      };
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Failed to reset password',
      };
    }
  }

  /**
   * Set access token in memory
   */
  private static setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Get current access token (may be expired)
   */
  static getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Clear access token
   */
  private static clearAccessToken(): void {
    this.accessToken = null;
  }

  /**
   * Check if user is authenticated (has a token)
   */
  static isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Make an authenticated API request
   * Automatically handles token refresh if needed
   */
  static async authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getValidAccessToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  }
}
