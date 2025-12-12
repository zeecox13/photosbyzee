'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F7F1] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl text-[#D4AF50] mb-4">Something went wrong!</h1>
        <p className="text-[#3C4033] mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-[#D4AF50] text-black rounded-md font-bold hover:bg-[#B8943A] transition-colors"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

