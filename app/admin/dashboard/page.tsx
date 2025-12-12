import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

// Force dynamic rendering since we use cookies for authentication
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'MANAGER') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl text-[#D4AF50] mb-4" style={{ fontFamily: "'Lora', serif" }}>
          Manager Dashboard
        </h1>
        <p className="text-lg text-[#3C4033]">
          Welcome back, {user.firstName || user.email}!
        </p>
      </div>
    </div>
  );
}

