'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      router.push('/client/login');
      return;
    }

    try {
      // Verify token and get user info
      const verifyRes = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        setUser(verifyData.user);
      } else {
        router.push('/client/login');
        return;
      }

      // Fetch bookings and galleries
      const [bookingsRes, galleriesRes] = await Promise.all([
        fetch('/api/client/bookings?upcoming=true', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/client/galleries?status=PUBLISHED', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      if (galleriesRes.ok) {
        const galleriesData = await galleriesRes.json();
        setGalleries(galleriesData.galleries || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F1] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#3C4033]">Loading...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.firstName || user?.email || 'there';

  return (
    <div className="min-h-screen bg-[#F8F7F1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-5xl text-[#D4AF50] mb-4">
            Welcome, {displayName}!
          </h1>
          <p className="text-lg text-[#3C4033]">
            Your client portal is ready. Here&apos;s what you can do next.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-12">
          {/* Upcoming Bookings */}
          <div className="bg-white rounded-xl shadow-soft p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-[#D4AF50]">
                Upcoming Bookings
              </h2>
              <Link
                href="/client/bookings"
                className="text-sm text-[#D4AF50] hover:underline"
              >
                View All
              </Link>
            </div>
            {bookings.length > 0 ? (
              <ul className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <li key={booking.id} className="border-b border-[#B7B7A4]/30 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-base font-medium text-[#3C4033]">
                          {format(new Date(booking.date), 'MMM d, yyyy h:mm a')}
                        </p>
                        {booking.serviceType && (
                          <p className="text-sm text-[#3C4033]/70 mt-1">
                            {booking.serviceType}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#3C4033]/70 mb-4">No upcoming bookings</p>
                <Link
                  href="/services"
                  className="inline-block px-6 py-2 bg-[#D4AF50] text-black rounded-md text-sm font-medium hover:bg-[#B8943A] transition-colors golden-highlight"
                >
                  Book a Session
                </Link>
              </div>
            )}
          </div>

          {/* My Galleries */}
          <div className="bg-white rounded-xl shadow-soft p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-[#D4AF50]">
                My Galleries
              </h2>
              <Link
                href="/client/galleries"
                className="text-sm text-[#D4AF50] hover:underline"
              >
                View All
              </Link>
            </div>
            {galleries.length > 0 ? (
              <ul className="space-y-4">
                {galleries.slice(0, 3).map((gallery) => (
                  <li key={gallery.id} className="border-b border-[#B7B7A4]/30 pb-4 last:border-0">
                    <Link
                      href={`/client/galleries/${gallery.id}`}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <p className="text-base font-medium text-[#3C4033]">
                        {gallery.title}
                      </p>
                      <p className="text-sm text-[#3C4033]/70 mt-1">
                        {gallery._count?.images || 0} images
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#3C4033]/70">
                  No galleries yet. Your galleries will appear here once your sessions are complete.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-soft p-8">
          <h2 className="font-serif text-2xl text-[#D4AF50] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/services"
              className="block p-6 border-2 border-[#B7B7A4] rounded-lg hover:border-[#D4AF50] hover:bg-[#F8F7F1] transition-all"
            >
              <div className="font-medium text-[#3C4033] mb-2">Book a Session</div>
              <div className="text-sm text-[#3C4033]/70">
                Schedule your next photo session
              </div>
            </Link>
            <Link
              href="/client/bookings"
              className="block p-6 border-2 border-[#B7B7A4] rounded-lg hover:border-[#D4AF50] hover:bg-[#F8F7F1] transition-all"
            >
              <div className="font-medium text-[#3C4033] mb-2">My Bookings</div>
              <div className="text-sm text-[#3C4033]/70">
                View and manage your bookings
              </div>
            </Link>
            <Link
              href="/client/galleries"
              className="block p-6 border-2 border-[#B7B7A4] rounded-lg hover:border-[#D4AF50] hover:bg-[#F8F7F1] transition-all"
            >
              <div className="font-medium text-[#3C4033] mb-2">View Galleries</div>
              <div className="text-sm text-[#3C4033]/70">
                Browse and purchase photos
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

