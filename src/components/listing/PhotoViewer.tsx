'use client';

import Image from 'next/image';
import { useCallback, useRef, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

export type Slide = { kind: 'image'; src: string } | { kind: 'plan'; node: ReactNode };

/**
 * Full-screen photo viewer shared by the result cards and the detail gallery.
 * Keyboard: ←/→ to move, Esc to close. Rendered into <body> so headers never cover it.
 */
export function PhotoViewer({ slides, alt, start = 0, onClose }: {
  slides: Slide[]; alt: string; start?: number; onClose: () => void;
}) {
  const t = useTranslations('listing');
  const tp = useTranslations('floorPlan');
  const [index, setIndex] = useState(start);
  const count = slides.length;
  const photoCount = slides.filter((s) => s.kind === 'image').length; // the floor plan is not a "photo"
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);
  const slide = slides[index];
  const touchX = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.style.overflow = prev; };
  }, [go, onClose]);

  const caption = slide.kind === 'plan' ? tp('title') : t('photo', { index: index + 1, count: photoCount });

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[70] flex flex-col bg-black" onClick={onClose}>
      <div className="flex items-center justify-between gap-4 p-4 text-white" onClick={(e) => e.stopPropagation()}>
        <p className="min-w-0 truncate text-sm"><span className="font-semibold">{alt}</span> <span className="text-white/60">· {caption}</span></p>
        <button type="button" onClick={onClose} className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">{t('closeGallery')}</button>
      </div>

      <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}
        // Swipe left / right on touch screens.
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (count > 1 && Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}>
        {slide.kind === 'image'
          ? <Image key={slide.src} src={slide.src} alt={`${alt} – ${caption}`} fill sizes="100vw" className="object-contain" />
          : (
            <div className="absolute inset-0 grid place-items-center p-4">
              <div className="flex h-full max-h-[70vh] w-full max-w-md flex-col rounded-2xl bg-white p-4">
                <div className="min-h-0 flex-1 [&>*]:h-full [&>*]:w-full">{slide.node}</div>
                <p className="mt-2 text-xs text-ink-soft">{tp('note')}</p>
              </div>
            </div>
          )}
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t('prevPhoto')}
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-2xl text-white ring-1 ring-white/30 hover:bg-black/75">‹</button>
            <button type="button" onClick={() => go(1)} aria-label={t('nextPhoto')}
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-2xl text-white ring-1 ring-white/30 hover:bg-black/75">›</button>
          </>
        )}
      </div>

      {/* Centred when it fits, scrollable from the first thumbnail when it does not. */}
      <div className="overflow-x-auto p-4 [scrollbar-width:none]" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto flex w-max gap-2">
        {slides.map((s, i) => (
          <button key={i} type="button" onClick={() => setIndex(i)}
            aria-label={s.kind === 'plan' ? tp('title') : t('photo', { index: i + 1, count: photoCount })} aria-current={i === index}
            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 ${i === index ? 'ring-white' : 'ring-transparent opacity-60 hover:opacity-100'}`}>
            {s.kind === 'image'
              ? <Image src={s.src} alt="" fill sizes="80px" className="object-cover" />
              : <span className="grid h-full w-full place-items-center bg-white text-[10px] font-semibold text-ink">{tp('title')}</span>}
          </button>
        ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
