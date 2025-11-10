'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthService, User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      // Try to get a valid token (will refresh if needed)
      const token = await AuthService.getValidAccessToken();

      if (token) {
        // Fetch user profile
        const response = await AuthService.getProfile();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          // Profile fetch failed, clear state
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await AuthService.login(email, password);
        if (response.success && response.user) {
          setUser(response.user);
          return { success: true };
        }
        return { success: false, message: response.message || 'Login failed' };
      } catch (error) {
        return { success: false, message: 'An error occurred during login' };
      }
    },
    []
  );

  const signup = useCallback(
    async (email: string, password: string, firstName?: string, lastName?: string) => {
      try {
        const response = await AuthService.signup(email, password, firstName, lastName);
        if (response.success && response.user) {
          setUser(response.user);
          return { success: true };
        }
        return { success: false, message: response.message || 'Signup failed' };
      } catch (error) {
        return { success: false, message: 'An error occurred during signup' };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const response = await AuthService.getProfile();
    if (response.success && response.user) {
      setUser(response.user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
