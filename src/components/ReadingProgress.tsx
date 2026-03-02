'use client';

import { useEffect, useState } from 'react';

/**
 * Thin reading progress bar at the very top of the viewport.
 * Uses the cyberLime brand color for high visibility against the dark charcoal background.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const articleRect = article.getBoundingClientRect();
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate how far through the article we've scrolled
      const scrollPosition = window.scrollY;
      const start = articleTop;
      const end = articleTop + articleHeight - windowHeight;

      if (scrollPosition <= start) {
        setProgress(0);
      } else if (scrollPosition >= end) {
        setProgress(100);
      } else {
        setProgress(((scrollPosition - start) / (end - start)) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[3px] bg-cyberLime/90 transition-[width] duration-150 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
}
