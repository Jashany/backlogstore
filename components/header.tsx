"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Search, Menu, LogOut, UserCircle, X } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-transparent">
        <div className="container mx-auto flex h-16 sm:h-18 md:h-20 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white group-hover:text-zinc-300 transition-colors">
              BACKLOG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            <Link
              href="/shop"
              className="text-xs lg:text-sm font-black uppercase tracking-wider text-white hover:text-zinc-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
            >
              Shop All
            </Link>
            <Link
              href="/shop/category/T-SHIRTS"
              className="text-xs lg:text-sm font-black uppercase tracking-wider text-white hover:text-zinc-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
            >
              Tees
            </Link>
            <Link
              href="/shop/category/HOODIES"
              className="text-xs lg:text-sm font-black uppercase tracking-wider text-white hover:text-zinc-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
            >
              Hoodies
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/search')}
              className="text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
                  >
                    <UserCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 sm:w-64 bg-zinc-950 border-2 border-white/20">
                  <DropdownMenuLabel className="pb-2 sm:pb-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                        {user?.firstName || 'Account'}
                      </p>
                      <p className="text-[10px] sm:text-xs text-zinc-500 font-medium truncate">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer py-2 sm:py-3">
                    <Link href="/account">
                      <User className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="uppercase text-[10px] sm:text-xs font-bold tracking-wider">My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer py-2 sm:py-3">
                    <Link href="/account/orders">
                      <ShoppingCart className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="uppercase text-[10px] sm:text-xs font-bold tracking-wider">Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 hover:bg-red-500/10 cursor-pointer py-2 sm:py-3"
                  >
                    <LogOut className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="uppercase text-[10px] sm:text-xs font-bold tracking-wider">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                asChild
                className="hidden sm:inline-flex text-white hover:bg-white hover:text-black transition-all font-black uppercase text-[10px] sm:text-xs tracking-wider border-2 border-transparent hover:border-white h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4"
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
              className="relative text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white text-[10px] sm:text-xs text-black font-black flex items-center justify-center border sm:border-2 border-black">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-black uppercase tracking-wider text-white hover:text-backlog-accent transition-colors py-2 border-b border-white/5"
              >
                Shop All
              </Link>
              <Link
                href="/shop/category/T-SHIRTS"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-black uppercase tracking-wider text-white hover:text-backlog-accent transition-colors py-2 border-b border-white/5"
              >
                Tees
              </Link>
              <Link
                href="/shop/category/HOODIES"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-black uppercase tracking-wider text-white hover:text-backlog-accent transition-colors py-2 border-b border-white/5"
              >
                Hoodies
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-black uppercase tracking-wider text-backlog-accent hover:text-white transition-colors py-2"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
