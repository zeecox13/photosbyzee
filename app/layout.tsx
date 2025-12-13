import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client components to avoid SSR issues
// Using error boundaries to prevent crashes
const PublicNavbar = dynamic(() => import('./components/Navbar'), {
  ssr: false,
  loading: () => null,
});

const ScrollProgress = dynamic(() => import('./components/ScrollProgress'), {
  ssr: false,
  loading: () => null,
});

export const metadata: Metadata = {
  title: 'Photos by Zee',
  description: 'Professional photography services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <ScrollProgress />
        </Suspense>
        <Suspense fallback={null}>
          <PublicNavbar />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}

