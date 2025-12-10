'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = pathname === '/';

  // Don't show navbar on client, manager, or admin pages
  if (pathname.startsWith('/client') || pathname.startsWith('/manager') || pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookNowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navTextColor = isHomePage && !scrolled ? 'text-white' : 'text-gray-800';
  const navBg = scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent';
  const textShadow = isHomePage && !scrolled ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-5 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-center items-center gap-10 flex-wrap">
          <Link
            href="/"
            className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative ${
              isActive('/')
                ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#6B705C]'
                : ''
            }`}
            style={{ textShadow }}
          >
            Home
          </Link>
          <Link
            href="/portfolio"
            className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative ${
              isActive('/portfolio')
                ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#6B705C]'
                : ''
            }`}
            style={{ textShadow }}
          >
            Portfolio
          </Link>
          <Link
            href="/services"
            className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative ${
              isActive('/services')
                ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#6B705C]'
                : ''
            }`}
            style={{ textShadow }}
          >
            Services
          </Link>
          <Link
            href="/contact"
            className={`${navTextColor} text-base font-normal tracking-wide transition-all duration-300 relative ${
              isActive('/contact')
                ? 'font-semibold after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[1px] after:bg-[#6B705C]'
                : ''
            }`}
            style={{ textShadow }}
          >
            Contact
          </Link>
          <Link
            href={pathname === '/' ? '#contact' : '/#contact'}
            onClick={handleBookNowClick}
            className="px-6 py-2.5 bg-[#6B705C] text-white rounded-full text-base font-medium tracking-wide transition-all duration-300 hover:bg-[#5A5E4F] hover:shadow-lg ml-5"
          >
            Book Now
          </Link>
          <Link
            href="/admin/login"
            className={`${navTextColor} text-sm font-normal tracking-wide transition-all duration-300 opacity-80 hover:opacity-100 ml-5`}
            style={{ textShadow }}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

