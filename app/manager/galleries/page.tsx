/**
 * Manager Galleries Page
 * List and manage all galleries
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ManagerGalleries() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGalleries();
  }, [filter]);

  const fetchGalleries = async () => {
    const token = localStorage.getItem('managerToken');
    if (!token) return;

    try {
      const url =
        filter !== 'all'
          ? `/api/manager/galleries?status=${filter}`
          : '/api/manager/galleries';
      const response = await fetch(url, {
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    const token = localStorage.getItem('managerToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/manager/galleries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchGalleries();
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
    }
  };

  if (loading) {
    return <div>Loading galleries...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galleries</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage client galleries and images
          </p>
        </div>
        <Link
          href="/manager/galleries/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Gallery
        </Link>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">All Galleries</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {galleries.map((gallery) => (
            <li key={gallery.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {gallery.title}
                        </p>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            gallery.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-800'
                              : gallery.status === 'DRAFT'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {gallery.status}
                        </span>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Client: {gallery.user?.firstName}{' '}
                            {gallery.user?.lastName}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Images: {gallery._count?.images || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/manager/galleries/${gallery.id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(gallery.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {galleries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No galleries found</p>
          </div>
        )}
      </div>
    </div>
  );
}

