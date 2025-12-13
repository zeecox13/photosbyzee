import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import PublicNavbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';

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
      <body className="antialiased">
        <Suspense fallback={null}>
          <ScrollProgress />
        </Suspense>
        <Suspense fallback={null}>
          <PublicNavbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

