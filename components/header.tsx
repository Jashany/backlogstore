"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Search, Menu, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"
import { CartDrawer } from "@/components/cart/cart-drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()
  const [cartOpen, setCartOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-white/10 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/95">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white group-hover:text-zinc-300 transition-colors">
              BACKLOG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="/shop"
              className="text-sm font-black uppercase tracking-wider text-white hover:text-zinc-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
            >
              Shop All
            </Link>
            <Link
              href="/shop/category/T-SHIRTS"
              className="text-sm font-black uppercase tracking-wider text-white hover:text-zinc-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
            >
              Tees
            </Link>
            <Link
              href="/shop/category/HOODIES"
              className="text-sm font-black uppercase tracking-wider text-white hover:text-zinc-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
            >
              Hoodies
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/search')}
              className="text-white hover:bg-white/10 h-10 w-10"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 h-10 w-10"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-zinc-950 border-2 border-white/20">
                  <DropdownMenuLabel className="pb-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-black text-white uppercase tracking-wider">
                        {user?.firstName || 'Account'}
                      </p>
                      <p className="text-xs text-zinc-500 font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer py-3">
                    <Link href="/account">
                      <User className="mr-3 h-4 w-4" />
                      <span className="uppercase text-xs font-bold tracking-wider">My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer py-3">
                    <Link href="/account/orders">
                      <ShoppingCart className="mr-3 h-4 w-4" />
                      <span className="uppercase text-xs font-bold tracking-wider">Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 hover:bg-red-500/10 cursor-pointer py-3"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="uppercase text-xs font-bold tracking-wider">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                asChild
                className="text-white hover:bg-white hover:text-black transition-all font-black uppercase text-xs tracking-wider border-2 border-transparent hover:border-white h-10 px-4"
              >
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10 h-10 w-10"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-xs text-black font-black flex items-center justify-center border-2 border-black">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
