'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthService, AdminUser } from '@/lib/admin-auth';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if token exists and is not expired
      if (AdminAuthService.isAuthenticated()) {
        const response = await AdminAuthService.getProfile();
        if (response.success && response.admin) {
          setAdmin(response.admin);
        } else {
          // Profile fetch failed or token invalid
          AdminAuthService.logout();
          setAdmin(null);
        }
      } else {
        // No valid token
        setAdmin(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      AdminAuthService.logout();
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AdminAuthService.login(email, password);
      if (response.success && response.admin) {
        setAdmin(response.admin);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const logout = () => {
    AdminAuthService.logout();
    setAdmin(null);
    router.push('/admin/login');
  };

  const refreshProfile = async () => {
    const response = await AdminAuthService.getProfile();
    if (response.success && response.admin) {
      setAdmin(response.admin);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
