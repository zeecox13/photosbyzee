import type { Metadata } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';

// Dynamically import client components to avoid SSR issues
const PublicNavbar = dynamic(() => import('./components/Navbar'), {
  ssr: false,
});

const ScrollProgress = dynamic(() => import('./components/ScrollProgress'), {
  ssr: false,
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
        <ScrollProgress />
        <PublicNavbar />
        {children}
      </body>
    </html>
  );
}

