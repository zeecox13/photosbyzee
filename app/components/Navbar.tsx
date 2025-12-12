'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = pathname === '/';

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
  if (pathname.startsWith('/client') || pathname.startsWith('/manager') || pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navTextColor = 'text-gray-800';
  const navBg = scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/30 backdrop-blur-sm';
  const textShadow = 'none';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Left side */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Photos by Zee"
                width={48}
                height={48}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Navigation Links - Center */}
          <div className="flex items-center gap-8 flex-1 justify-center">
            <Link
              href="/"
              className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative group ${
                isActive('/')
                  ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#D4AF50]'
                  : 'after:absolute after:bottom-[-5px] after:left-1/2 after:w-0 after:h-[1px] after:bg-[#D4AF50] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0'
              }`}
              style={{ textShadow }}
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
              style={{ textShadow }}
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
              style={{ textShadow }}
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
              style={{ textShadow }}
            >
              Contact
            </Link>
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/services"
              className="px-6 py-2.5 bg-[#D4AF50] text-black rounded-full text-base font-medium tracking-wide transition-all duration-300 hover:bg-[#B8943A] hover:shadow-elegant hover:scale-105 active:scale-100 golden-highlight"
            >
              Book Now
            </Link>
            <Link
              href="/client/login"
              className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative group ${
                isActive('/client/login')
                  ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#D4AF50]'
                  : 'after:absolute after:bottom-[-5px] after:left-1/2 after:w-0 after:h-[1px] after:bg-[#D4AF50] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0'
              }`}
              style={{ textShadow }}
            >
              Client Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

