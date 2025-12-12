import type { Metadata } from 'next';
import './globals.css';
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
      <body>
        <ScrollProgress />
        <PublicNavbar />
        {children}
      </body>
    </html>
  );
}

