/**
 * Manager Dashboard - Overview
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('managerToken');
    if (!token) return;

    try {
      // Fetch analytics for last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const response = await fetch(
        `/api/manager/analytics?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-600">
          Summary of your photography business
        </p>
      </div>

      {stats && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.kpis.sessionsBooked}
                    </div>
                    <div className="text-sm text-gray-500">Sessions Booked</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-green-600">
                      ${stats.kpis.totalRevenue.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">Total Revenue</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.kpis.totalPageViews}
                    </div>
                    <div className="text-sm text-gray-500">Page Views</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.kpis.publishedGalleries}
                    </div>
                    <div className="text-sm text-gray-500">Published Galleries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/manager/galleries/new"
                className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
              >
                <div className="font-medium text-gray-900">Create Gallery</div>
                <div className="text-sm text-gray-500">Add a new client gallery</div>
              </Link>
              <Link
                href="/manager/bookings/new"
                className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
              >
                <div className="font-medium text-gray-900">Add Booking</div>
                <div className="text-sm text-gray-500">Create a manual booking</div>
              </Link>
              <Link
                href="/manager/analytics"
                className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
              >
                <div className="font-medium text-gray-900">View Reports</div>
                <div className="text-sm text-gray-500">See detailed analytics</div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

