// Route segment config to force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

