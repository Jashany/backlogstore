import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Backlog - Streetwear Essentials",
  description: "Bold streetwear for the culture. Shop tees, hoodies & more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
