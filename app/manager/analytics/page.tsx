/**
 * Manager Analytics/Reports Page
 * Shows analytics and reports for a date range
 */

'use client';

import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';

export default function ManagerAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('managerToken');
    if (!token) return;

    setLoading(true);
    try {
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
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="mt-2 text-sm text-gray-600">
          View business metrics and performance
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {analytics && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.kpis.sessionsBooked}
                </div>
                <div className="text-sm text-gray-500">Sessions Booked</div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-2xl font-bold text-green-600">
                  ${analytics.kpis.totalRevenue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.kpis.totalPageViews}
                </div>
                <div className="text-sm text-gray-500">Page Views</div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.kpis.uniqueVisitors}
                </div>
                <div className="text-sm text-gray-500">Unique Visitors</div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Bookings Breakdown */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Bookings Breakdown
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium">
                    {analytics.bookings.byStatus.pending}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-medium">
                    {analytics.bookings.byStatus.confirmed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium">
                    {analytics.bookings.byStatus.completed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-medium">
                    {analytics.bookings.byStatus.cancelled}
                  </span>
                </div>
              </div>
            </div>

            {/* Revenue Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Revenue Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-medium text-green-600">
                    ${analytics.revenue.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-medium">
                    {analytics.revenue.orderCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="font-medium">
                    $
                    {analytics.revenue.orderCount > 0
                      ? (
                          analytics.revenue.total / analytics.revenue.orderCount
                        ).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

