'use client';

import { useEffect, useState } from 'react';

/**
 * Sticky Table of Contents — auto-generated from H2/H3 headings in the article.
 * Highlights the currently visible section as user scrolls.
 */

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Discover all H2 and H3 headings inside the article
    const article = document.querySelector('article');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TOCItem[] = [];

    elements.forEach((el, index) => {
      // Assign an ID if the heading doesn't have one
      if (!el.id) {
        el.id = `heading-${index}`;
      }
      items.push({
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      className="hidden xl:block sticky top-28 w-56 max-h-[calc(100vh-8rem)] overflow-y-auto"
      aria-label="Table of Contents"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-4">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-white/5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`
                block text-xs leading-relaxed transition-all duration-200
                ${heading.level === 3 ? 'pl-6' : 'pl-4'}
                ${
                  activeId === heading.id
                    ? 'text-cyberLime border-l-2 border-cyberLime -ml-[1px] font-medium'
                    : 'text-slate-500 hover:text-slate-300 border-l-2 border-transparent -ml-[1px]'
                }
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
