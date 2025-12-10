/**
 * Manager Bookings Page
 * List and manage all bookings
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ManagerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    const token = localStorage.getItem('managerToken');
    if (!token) return;

    try {
      const url =
        filter !== 'all'
          ? `/api/manager/bookings?status=${filter}`
          : '/api/manager/bookings';
      const response = await fetch(url, {
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('managerToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/manager/bookings/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage photo session bookings
          </p>
        </div>
        <Link
          href="/manager/bookings/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Booking
        </Link>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">All Bookings</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(booking.date), 'MMM d, yyyy h:mm a')}
                      </p>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>
                        Client: {booking.user?.firstName} {booking.user?.lastName}
                      </p>
                      <p>Email: {booking.user?.email}</p>
                      {booking.serviceType && (
                        <p>Service: {booking.serviceType}</p>
                      )}
                      {booking.location && <p>Location: {booking.location}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                      className="text-sm border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <Link
                      href={`/manager/bookings/${booking.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}

