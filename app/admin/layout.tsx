'use client';

import { useState } from 'react';
import { AdminAuthProvider } from '@/hooks/use-admin-auth';
import { AdminGuard } from '@/components/admin/admin-guard';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminMobileHeader } from '@/components/admin/admin-mobile-header';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <AdminGuard>
          <div className="flex h-screen bg-zinc-950 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <AdminSidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Mobile Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Mobile Header */}
              <AdminMobileHeader onMenuClick={() => setSidebarOpen(true)} />

              {/* Page Content */}
              <main className="flex-1 overflow-auto">
                <div className="h-full">{children}</div>
              </main>
            </div>
          </div>
        </AdminGuard>
      )}
    </AdminAuthProvider>
  );
}
