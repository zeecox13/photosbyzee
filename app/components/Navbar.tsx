'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isHomePage = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debug logging removed - was causing issues on Vercel

  // Don't show navbar on client, manager, or admin pages (after all hooks)
  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (pathname?.startsWith('/client') || pathname?.startsWith('/manager') || pathname?.startsWith('/admin')) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navTextColor = 'text-gray-800';
  const navBg = 'bg-white/30 backdrop-blur-sm'; // Always transparent
  const textShadow = 'none';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between">
          {/* Left side - "Photos by Zee" text */}
          <Link href="/" className="flex-shrink-0">
            <span className={`${navTextColor} text-xl font-bold tracking-wide`} style={{ textShadow, fontFamily: "'Lora', serif" }}>
              Photos by Zee
            </span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative group ${
                isActive('/')
                  ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#D4AF50]'
                  : 'after:absolute after:bottom-[-5px] after:left-1/2 after:w-0 after:h-[1px] after:bg-[#D4AF50] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0'
              }`}
              style={{ textShadow, fontFamily: "'Lora', serif" }}
            >
              Home
            </Link>
            <Link
              href="/portfolio"
              className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative group ${
                isActive('/portfolio')
                  ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#D4AF50]'
                  : 'after:absolute after:bottom-[-5px] after:left-1/2 after:w-0 after:h-[1px] after:bg-[#D4AF50] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0'
              }`}
              style={{ textShadow, fontFamily: "'Lora', serif" }}
            >
              Portfolio
            </Link>
            <Link
              href="/services"
              className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative group ${
                isActive('/services')
                  ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#D4AF50]'
                  : 'after:absolute after:bottom-[-5px] after:left-1/2 after:w-0 after:h-[1px] after:bg-[#D4AF50] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0'
              }`}
              style={{ textShadow, fontFamily: "'Lora', serif" }}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative group ${
                isActive('/contact')
                  ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#D4AF50]'
                  : 'after:absolute after:bottom-[-5px] after:left-1/2 after:w-0 after:h-[1px] after:bg-[#D4AF50] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0'
              }`}
              style={{ textShadow, fontFamily: "'Lora', serif" }}
            >
              Contact
            </Link>
            <Link
              href="/client/login"
              className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative group ${
                isActive('/client/login')
                  ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#D4AF50]'
                  : 'after:absolute after:bottom-[-5px] after:left-1/2 after:w-0 after:h-[1px] after:bg-[#D4AF50] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0'
              }`}
              style={{ textShadow, fontFamily: "'Lora', serif" }}
            >
              Client Login
            </Link>
          </div>

          {/* Right side - Book Now button */}
          <div className="flex-shrink-0">
            <Link
              href="/services"
              className="px-6 py-2.5 bg-[#D4AF50] text-black rounded-full text-base font-bold tracking-wide transition-all duration-300 hover:bg-[#B8943A] hover:shadow-elegant hover:scale-105 active:scale-100 golden-highlight"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

