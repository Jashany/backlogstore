import Link from "next/link"
import { Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t-2 border-white/10 bg-black">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand Section */}
          <div className="space-y-6 md:col-span-5">
            <Link href="/" className="inline-block group">
              <h3 className="text-4xl font-black uppercase tracking-tighter text-white group-hover:text-zinc-300 transition-colors">
                BACKLOG
              </h3>
            </Link>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-sm">
              Street culture meets premium quality. Redefining urban fashion one piece at a time.
              Wear your statement, own your style.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 border-2 border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
              >
                <Instagram className="h-5 w-5 text-white group-hover:text-black" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 border-2 border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
              >
                <Twitter className="h-5 w-5 text-white group-hover:text-black" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 border-2 border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
              >
                <Youtube className="h-5 w-5 text-white group-hover:text-black" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-5 md:col-span-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop/category/T-SHIRTS" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop/category/HOODIES" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  Hoodies
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-5 md:col-span-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/account" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-5 md:col-span-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-zinc-500 hover:text-white transition-colors font-medium uppercase text-xs tracking-wider">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t-2 border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider">
              &copy; {new Date().getFullYear()} BACKLOG. All rights reserved.
            </p>
            <p className="text-xs text-zinc-600 font-medium uppercase tracking-wider">
              Designed for the culture, built for the streets.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
