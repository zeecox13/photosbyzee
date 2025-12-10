/**
 * Client Orders Page
 * View order history
 */

'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function ClientOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    try {
      const response = await fetch('/api/client/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="mt-2 text-sm text-gray-600">
          View your past purchases
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                      </p>
                      {order.gallery && (
                        <p className="text-sm text-gray-500">
                          Gallery: {order.gallery.title}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {order.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                          order.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No orders yet</p>
          <p className="mt-2 text-sm text-gray-400">
            Your purchases will appear here
          </p>
        </div>
      )}
    </div>
  );
}

