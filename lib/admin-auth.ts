export interface AdminUser {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  createdAt?: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message?: string;
  admin?: AdminUser;
  accessToken?: string;
  token?: string; // Legacy support
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class AdminAuthService {
  private static TOKEN_KEY = 'admin_token';
  private static ADMIN_KEY = 'admin_user';

  /**
   * Login admin user
   */
  static async login(email: string, password: string): Promise<AdminAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Handle both accessToken (new) and token (legacy)
      const token = data.accessToken || data.token;

      if (data.success && token) {
        this.setToken(token);
        if (data.admin) {
          this.setAdmin(data.admin);
        }
      }

      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        message: 'Failed to connect to server',
      };
    }
  }

  /**
   * Get current admin profile
   */
  static async getProfile(): Promise<AdminAuthResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, message: 'No token found' };
      }

      // Check if token is expired before making request
      if (this.isTokenExpired(token)) {
        this.logout();
        return { success: false, message: 'Token expired' };
      }

      const response = await fetch(`${API_BASE_URL}/admin/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.admin) {
        this.setAdmin(data.admin);
        return data;
      } else if (response.status === 401) {
        // Token is invalid or expired, clear local storage
        this.logout();
        return { success: false, message: 'Session expired' };
      }

      return data;
    } catch (error) {
      console.error('Get admin profile error:', error);
      return {
        success: false,
        message: 'Failed to fetch profile',
      };
    }
  }

  /**
   * Check if JWT token is expired
   */
  private static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      return expirationTime <= currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Logout admin user
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ADMIN_KEY);
    }
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
      // Validate token is not expired
      if (token && this.isTokenExpired(token)) {
        this.logout();
        return null;
      }
      return token;
    }
    return null;
  }

  /**
   * Set token in localStorage
   */
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Get stored admin user
   */
  static getAdmin(): AdminUser | null {
    if (typeof window !== 'undefined') {
      const admin = localStorage.getItem(this.ADMIN_KEY);
      return admin ? JSON.parse(admin) : null;
    }
    return null;
  }

  /**
   * Set admin user in localStorage
   */
  static setAdmin(admin: AdminUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admin));
    }
  }

  /**
   * Check if admin is authenticated (has valid token)
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Make an authenticated API request
   */
  static async authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If 401, token might be expired
    if (response.status === 401) {
      this.logout();
      throw new Error('Session expired');
    }

    return response;
  }
}
