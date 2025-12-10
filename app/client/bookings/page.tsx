/**
 * Client Bookings Page
 * View and manage bookings
 */

'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ClientBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    try {
      const response = await fetch('/api/client/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status !== 'CANCELLED'
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === 'CANCELLED'
  );

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your photo sessions
          </p>
        </div>
        <Link
          href="/client/bookings/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Request Booking
        </Link>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Upcoming Sessions
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {upcomingBookings.map((booking) => (
                <li key={booking.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(booking.date), 'MMMM d, yyyy h:mm a')}
                        </p>
                        {booking.serviceType && (
                          <p className="text-sm text-gray-500">
                            {booking.serviceType}
                          </p>
                        )}
                        {booking.location && (
                          <p className="text-sm text-gray-500">
                            Location: {booking.location}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Past Sessions
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {pastBookings.map((booking) => (
                <li key={booking.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(booking.date), 'MMMM d, yyyy h:mm a')}
                        </p>
                        {booking.serviceType && (
                          <p className="text-sm text-gray-500">
                            {booking.serviceType}
                          </p>
                        )}
                        {booking.galleries && booking.galleries.length > 0 && (
                          <Link
                            href={`/client/galleries/${booking.galleries[0].id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            View Gallery →
                          </Link>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No bookings found</p>
          <Link
            href="/client/bookings/new"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-900"
          >
            Request your first booking
          </Link>
        </div>
      )}
    </div>
  );
}

