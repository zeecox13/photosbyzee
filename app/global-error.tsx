'use client';

/**
 * Global error boundary for the entire application
 * Catches errors that occur in the root layout
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7F1]">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
            <h1 className="text-4xl text-[#D4AF50] mb-4" style={{ fontFamily: "'Lora', serif" }}>
              Something went wrong
            </h1>
            <p className="text-[#3C4033] mb-6">
              {error.message || 'An unexpected error occurred'}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="text-xs text-left bg-gray-100 p-4 rounded mb-6 overflow-auto">
                {error.stack}
              </pre>
            )}
            <button
              onClick={reset}
              className="px-6 py-3 bg-[#D4AF50] text-black rounded-md font-bold hover:bg-[#B8943A] transition-colors"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

