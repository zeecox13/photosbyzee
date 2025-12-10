'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/client/dashboard');
      } else {
        setError(data.error || 'Registration failed');
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
          <div className="mb-8">
            <h1 className="font-serif text-4xl text-center text-[#6B705C] mb-2">
              Create Your Client Account
            </h1>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block mb-2 text-[#3C4033] font-medium text-sm">
                Name (optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/20"
                placeholder="Your name"
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
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/20"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/20"
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
                className="w-full px-4 py-3.5 border-[1.5px] border-[#B7B7A4] rounded-md text-base bg-white text-[#3C4033] transition-all focus:outline-none focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/20"
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
                className="w-full px-4 py-3.5 bg-[#6B705C] text-white rounded-md text-base font-medium tracking-wide uppercase transition-all duration-300 hover:bg-[#5A5E4F] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#3C4033]">
                Already have an account?{' '}
                <Link href="/client/login" className="text-[#6B705C] hover:underline">
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

