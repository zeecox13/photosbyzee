import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'MANAGER') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-5xl text-[#6B705C] mb-4">
          Manager Dashboard
        </h1>
        <p className="text-lg text-[#3C4033]">
          Welcome back, {user.firstName || user.email}!
        </p>
      </div>
    </div>
  );
}

