'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(email, password, firstName, lastName);
      if (result.success) {
        router.push('/account');
      } else {
        setError(result.message || 'Registration failed');
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 overflow-y-auto">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <h1 style={{
            color: 'black'
          }} className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            BACKLOG
          </h1>
        </Link>

        {/* Form */}
        <div className="max-w-md">
          <h2 className="text-sm font-medium uppercase tracking-widest mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs uppercase tracking-wider">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-black/50">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full border-b border-black/20 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-black/50">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full border-b border-black/20 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
                />
              </div>
            </div>

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
              <p className="text-[10px] text-black/40 mt-1">
                Minimum 8 characters
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-black/50">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border-b border-black/20 py-2 text-sm focus:border-black focus:outline-none transition-colors bg-transparent"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 border border-black/30 rounded-none accent-black"
                />
                <span className="text-[10px] text-black/60 leading-relaxed">
                  I have read and accept the{' '}
                  <Link href="/terms" className="underline">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              <Link
                href="/auth/login"
                className="block w-full h-12 border border-black text-black text-xs uppercase tracking-widest font-medium hover:bg-black hover:text-white transition-colors text-center leading-12"
              >
                Already have an account? Log In
              </Link>
            </div>
          </form>

         

          {/* Help Link */}
          <div className="mt-10 pb-8">
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
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
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
