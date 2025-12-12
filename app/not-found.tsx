import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F7F1] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-6xl text-[#D4AF50] mb-4">404</h1>
        <h2 className="font-serif text-2xl text-[#D4AF50] mb-4">Page Not Found</h2>
        <p className="text-[#3C4033] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#D4AF50] text-black rounded-md font-bold hover:bg-[#B8943A] transition-colors"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

