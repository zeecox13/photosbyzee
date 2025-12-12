'use client';

// Note: This layout is a Client Component because it's nested inside
// app/client/layout.tsx which is also a Client Component.
// Route Segment Config (dynamic, revalidate) can only be used in Server Components,
// but since the parent layout is a Client Component, this must be a Client Component too.
// The dynamic behavior is already handled by the parent layout's client-side logic.

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

