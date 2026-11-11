'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * One-row tag strip with ‹ › buttons (like the reference site). Arrows appear only on the side
 * that still has hidden tags; nothing extra shows when every tag fits.
 */
export function TagScroller({ tags, className = '' }: { tags: string[]; className?: string }) {
  const t = useTranslations('search');
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update, tags]);

  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * Math.max(120, (ref.current?.clientWidth ?? 0) * 0.7), behavior: 'smooth' });

  const mask = canLeft && canRight
    ? '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]'
    : canRight ? '[mask-image:linear-gradient(to_right,black_85%,transparent)]'
      : canLeft ? '[mask-image:linear-gradient(to_right,transparent,black_15%)]' : '';
  const arrow = 'grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-white text-sm text-ink-soft shadow-sm hover:border-accent hover:text-sky';

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {canLeft && <button type="button" onClick={() => scroll(-1)} aria-label={t('prev')} className={arrow}>‹</button>}
      <div ref={ref} onScroll={update} className={`flex min-w-0 flex-1 gap-1.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] ${mask}`}>
        {tags.map((tag) => <span key={tag} className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-xs text-ink">{tag}</span>)}
      </div>
      {canRight && <button type="button" onClick={() => scroll(1)} aria-label={t('next')} className={arrow}>›</button>}
    </div>
  );
}
