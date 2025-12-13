/**
 * Client Login Page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage for client-side auth checks
        if (data.token) {
          localStorage.setItem('clientToken', data.token);
        }
        router.push('/client/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white p-12 rounded-xl shadow-lg">
          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <Link href="/" className="cursor-pointer">
              <div className="relative w-40 h-24 -translate-y-[50%] scale-[1.045]">
                <Image
                  src="/logo.png"
                  alt="Photos by Zee Logo"
                  width={160}
                  height={96}
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl text-center text-[#D4AF50] mb-2" style={{ fontFamily: "'Lora', serif" }}>
              Client Login
            </h1>
            <p className="text-center text-sm text-[#3C4033]">
              Access your galleries and bookings
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3.5 bg-[#D4AF50] text-black rounded-md text-base font-bold tracking-wide uppercase transition-all duration-300 hover:bg-[#B8943A] disabled:opacity-50 disabled:cursor-not-allowed golden-highlight"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {/* Security Indicator - Smaller, below button */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#D4AF50]">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-[#3C4033]">Secure Login</span>
              <span className="text-[#3C4033]">•</span>
              <span className="text-[#3C4033]">SSL Encrypted</span>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#3C4033]">
                Don&apos;t have an account?{' '}
                <Link href="/client/register" className="text-[#D4AF50] hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

