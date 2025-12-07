'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/account');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        {/* Logo */}
        <Link href="/" className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            BACKLOG
          </h1>
        </Link>

        {/* Form */}
        <div className="max-w-md">
          <h2 className="text-sm font-medium uppercase tracking-widest mb-8">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs uppercase tracking-wider">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-black/50">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-black/20 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-black/50">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-black/20 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
              />
            </div>

            <Link
              href="/auth/forgot-password"
              className="block text-xs underline underline-offset-4 text-black/60 hover:text-black transition-colors"
            >
              Have you forgotten your password?
            </Link>

            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>

              <Link
                href="/auth/signup"
                className="block w-full h-12 border border-black text-black text-xs uppercase tracking-widest font-medium hover:bg-black hover:text-white transition-colors text-center leading-12"
              >
                Register
              </Link>
            </div>
          </form>

         
          {/* Help Link */}
          <div className="mt-12">
            <Link
              href="/help"
              className="text-xs uppercase tracking-widest font-medium hover:underline"
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop"
          alt="Fashion editorial"
          fill
          className="object-cover grayscale"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
