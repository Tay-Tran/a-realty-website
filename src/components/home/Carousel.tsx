'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';

/** Horizontal scroll-snap strip with prev/next buttons; children are the slides. */
export function Carousel({ children }: { children: React.ReactNode }) {
  const t = useTranslations('search');
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.9, behavior: 'smooth' });
  const btn = 'grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-lg shadow-sm hover:border-accent';
  return (
    <div>
      <div className="mb-4 hidden justify-end gap-2 sm:flex">
        <button type="button" onClick={() => scroll(-1)} aria-label={t('prev')} className={btn}>‹</button>
        <button type="button" onClick={() => scroll(1)} aria-label={t('next')} className={btn}>›</button>
      </div>
      <div ref={ref} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {children}
      </div>
    </div>
  );
}
