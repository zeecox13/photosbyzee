'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

function ClientRegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceType = searchParams.get('serviceType');
  const price = searchParams.get('price');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!location.trim()) {
      setError('City/State location is required');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/client/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword, phone, location }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('clientToken', data.token);
        }

        // If coming from booking flow, redirect to booking page
        if (serviceType && price) {
          router.push(`/client/booking?serviceType=${encodeURIComponent(serviceType)}&price=${encodeURIComponent(price)}`);
        } else {
          router.push('/client/dashboard');
        }
      } else {
        setError(data.error || 'Registration failed. Please try again.');
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
            <h1 className="font-serif text-4xl text-center text-[#D4AF50] mb-2">
              Create Your Client Account
            </h1>
            {serviceType && (
              <p className="text-center text-sm text-[#3C4033] mt-2">
                Booking: {serviceType} - {price}
              </p>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 hover:border-[#D4AF50]/50"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 hover:border-[#D4AF50]/50"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 hover:border-[#D4AF50]/50"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="location" className="block mb-2 text-[#3C4033] font-medium text-sm">
                City, State *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 hover:border-[#D4AF50]/50"
                placeholder="City, State (e.g., Minneapolis, MN)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 hover:border-[#D4AF50]/50"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all duration-300 focus:outline-none focus:border-[#D4AF50] focus:ring-2 focus:ring-[#D4AF50]/20 hover:border-[#D4AF50]/50"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                className="w-full px-4 py-3.5 bg-[#D4AF50] text-black rounded-md text-base font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[#B8943A] disabled:opacity-50 disabled:cursor-not-allowed golden-highlight"
              >
                {loading ? 'Creating account...' : 'Create Account'}
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
              <span className="text-[#3C4033]">Secure Registration</span>
              <span className="text-[#3C4033]">•</span>
              <span className="text-[#3C4033]">SSL Encrypted</span>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#3C4033]">
                Already have an account?{' '}
                <Link href="/client/login" className="text-[#D4AF50] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ClientRegister() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F1]">
        <div className="text-center">
          <div className="text-[#D4AF50] text-lg">Loading...</div>
        </div>
      </div>
    }>
      <ClientRegisterForm />
    </Suspense>
  );
}

