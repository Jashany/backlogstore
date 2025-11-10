'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const { logout, admin } = useAdminAuth();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex h-full flex-col bg-black border-r border-zinc-800">
      <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-6">
        <div className="rounded-md bg-white p-2">
          <ShieldCheck className="h-5 w-5 text-black" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">Backlog Store</h1>
          <p className="text-xs text-zinc-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <div className="mb-3 rounded-lg bg-zinc-900 p-3 border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-1">Logged in as</p>
          <p className="text-sm font-medium text-white truncate">{admin?.email}</p>
          <p className="text-xs text-zinc-400 mt-1 uppercase">{admin?.role}</p>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
