import { Suspense } from 'react';
import ClientRegisterForm from './ClientRegisterForm';

// Force dynamic rendering - this must be in a server component
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ClientRegister() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F1]">
        <div className="text-center">
          <div className="text-[#D4AF50] text-lg">Loading...</div>
        </div>
      </div>
    }>
      <ClientRegisterForm />
    </Suspense>
  );
}
