/**
 * Client Galleries Page
 * View assigned galleries
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ClientGalleries() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    try {
      const response = await fetch('/api/client/galleries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGalleries(data.galleries || []);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading galleries...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Galleries</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and purchase photos from your sessions
        </p>
      </div>

      {galleries.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              href={`/client/galleries/${gallery.id}`}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
            >
              {gallery.images && gallery.images.length > 0 && (
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={gallery.images[0].thumbnailUrl || gallery.images[0].url}
                    alt={gallery.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {gallery.title}
                </h3>
                {gallery.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {gallery.description}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {gallery._count?.images || 0} images
                  </span>
                  {gallery.isFree ? (
                    <span className="text-sm font-medium text-green-600">
                      Free
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {gallery.price ? `$${gallery.price}` : 'View Pricing'}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No galleries available yet</p>
          <p className="mt-2 text-sm text-gray-400">
            Your galleries will appear here after your photo sessions
          </p>
        </div>
      )}
    </div>
  );
}

