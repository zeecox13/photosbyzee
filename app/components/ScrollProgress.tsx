'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window === 'undefined') return;

    const updateScrollProgress = () => {
      if (typeof document === 'undefined') return;
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call
    
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="scroll-progress"
      style={{ width: `${scrollProgress}%` }}
    />
  );
}

