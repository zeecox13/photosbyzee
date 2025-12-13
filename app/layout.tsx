import type { Metadata } from 'next';
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}

