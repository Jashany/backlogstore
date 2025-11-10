'use client';

import { Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminMobileHeaderProps {
  onMenuClick: () => void;
}

export function AdminMobileHeader({ onMenuClick }: AdminMobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-zinc-800 bg-black">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-white hover:bg-zinc-900"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-white p-1.5">
            <ShieldCheck className="h-4 w-4 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Backlog Store</h1>
            <p className="text-xs text-zinc-500">Admin Panel</p>
          </div>
        </div>
      </div>
    </header>
  );
}
