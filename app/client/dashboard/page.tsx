import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

// Force dynamic rendering since we use cookies for authentication
export const dynamic = 'force-dynamic';

export default async function ClientDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'CLIENT') {
    redirect('/client/login');
  }

  const displayName = user.firstName || user.email;

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-5xl text-[#6B705C] mb-4">
          Client Dashboard
        </h1>
        <p className="text-lg text-[#3C4033]">
          Hi {displayName}, welcome back to your client portal.
        </p>
      </div>
    </div>
  );
}

