/**
 * Client Dashboard Layout
 * Provides authentication check and navigation for client pages
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Don't require auth for login and register pages
  const isPublicPage = pathname === '/client/login' || pathname === '/client/register';

  useEffect(() => {
    if (isPublicPage) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [isPublicPage]);

  const checkAuth = async () => {
    const token = localStorage.getItem('clientToken');

    // #region agent log
    // Debug: client layout auth check start
    fetch('http://127.0.0.1:7242/ingest/6b3a9c97-156d-421c-ae40-eda6582fea87', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'app/client/layout.tsx:line27',
        message: 'ClientLayout checkAuth start',
        data: { hasToken: !!token },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!token) {
      setLoading(false);
      router.push('/client/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'CLIENT') {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setLoading(false);
          router.push('/client/login');
        }
      } else {
        setLoading(false);
        router.push('/client/login');
      }
    } catch (error) {
      setLoading(false);
      router.push('/client/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    router.push('/client/login');
  };

  // Allow login and register pages to render without auth
  if (isPublicPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Photos by Zee
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/client/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/client/bookings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Bookings
                </Link>
                <Link
                  href="/client/galleries"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Galleries
                </Link>
                <Link
                  href="/client/orders"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

