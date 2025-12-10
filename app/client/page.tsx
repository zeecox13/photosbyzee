/**
 * Client Dashboard - Overview
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ClientDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    try {
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
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Upcoming Bookings
            </h2>
            <Link
              href="/client/bookings"
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              View All
            </Link>
          </div>
          {bookings.length > 0 ? (
            <ul className="space-y-3">
              {bookings.slice(0, 3).map((booking) => (
                <li key={booking.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(booking.date), 'MMM d, yyyy h:mm a')}
                      </p>
                      {booking.serviceType && (
                        <p className="text-sm text-gray-500">
                          {booking.serviceType}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No upcoming bookings</p>
          )}
        </div>

        {/* My Galleries */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">My Galleries</h2>
            <Link
              href="/client/galleries"
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              View All
            </Link>
          </div>
          {galleries.length > 0 ? (
            <ul className="space-y-3">
              {galleries.slice(0, 3).map((gallery) => (
                <li key={gallery.id} className="border-b pb-3">
                  <Link
                    href={`/client/galleries/${gallery.id}`}
                    className="block hover:text-indigo-600"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {gallery.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {gallery._count?.images || 0} images
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No galleries yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/client/bookings/new"
            className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <div className="font-medium text-gray-900">Request Booking</div>
            <div className="text-sm text-gray-500">
              Book a new photo session
            </div>
          </Link>
          <Link
            href="/client/galleries"
            className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <div className="font-medium text-gray-900">View Galleries</div>
            <div className="text-sm text-gray-500">
              Browse and purchase photos
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

