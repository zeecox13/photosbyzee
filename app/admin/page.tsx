/**
 * Admin Login Page - Accessible via direct URL only (not in public navbar)
 * This uses the manager login API since admin/manager are the same role
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // #region agent log
    // Debug: admin login attempt
    fetch('http://127.0.0.1:7242/ingest/6b3a9c97-156d-421c-ae40-eda6582fea87', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H_ADMIN',
        location: 'app/admin/page.tsx:line25',
        message: 'Admin login attempt',
        data: { hasEmail: !!email },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    try {
      const response = await fetch('/api/auth/manager/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // #region agent log
        // Debug: admin login success
        fetch('http://127.0.0.1:7242/ingest/6b3a9c97-156d-421c-ae40-eda6582fea87', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId: 'pre-fix',
            hypothesisId: 'H_ADMIN',
            location: 'app/admin/page.tsx:line50',
            message: 'Admin login succeeded',
            data: { hasUser: !!data.user, role: data.user?.role },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion

        router.push('/admin/dashboard');
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
          <div className="mb-8">
            <h1 className="text-4xl text-center text-[#D4AF50] mb-2" style={{ fontFamily: "'Lora', serif" }}>
              Admin Login
            </h1>
            <p className="text-center text-sm text-[#3C4033]">
              Secure admin access only
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
                className="w-full px-4 py-3.5 bg-[#D4AF50] text-black rounded-md text-base font-bold tracking-wide uppercase transition-all duration-300 hover:bg-[#B8943A] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

