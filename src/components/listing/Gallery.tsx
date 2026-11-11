'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/** Mosaic (1 large + 4 small) that opens a full-screen viewer. */
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const t = useTranslations('listing');
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);
  const show = (i: number) => { setIndex(i); setOpen(true); };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  return (
    <div>
      <div className="grid gap-2 md:h-[440px] md:grid-cols-4 md:grid-rows-2">
        <button type="button" onClick={() => show(0)} aria-label={t('photo', { index: 1, count })}
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5 md:col-span-2 md:row-span-2 md:aspect-auto">
          <Image src={images[0]} alt={alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </button>
        {images.slice(1, 5).map((src, i) => (
          <button key={src} type="button" onClick={() => show(i + 1)} aria-label={t('photo', { index: i + 2, count })}
            className="relative hidden overflow-hidden rounded-2xl bg-ink/5 md:block">
            <Image src={src} alt="" fill sizes="25vw" className="object-cover transition hover:scale-105" />
          </button>
        ))}
      </div>
      <button type="button" onClick={() => show(0)}
        className="mt-3 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-accent">
        ▦ {t('showAll')} ({count})
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={t('openGallery')} className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm">{t('photo', { index: index + 1, count })}</span>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-white/10 px-4 py-2 text-sm">{t('closeGallery')}</button>
          </div>
          <div className="relative flex-1"><Image src={images[index]} alt={alt} fill sizes="100vw" className="object-contain" /></div>
          <div className="flex items-center justify-between gap-2 p-4">
            <button type="button" onClick={() => go(-1)} aria-label={t('prevPhoto')} className="rounded-full bg-white/10 px-5 py-3 text-white">‹</button>
            <div className="flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button key={src} type="button" onClick={() => setIndex(i)} aria-label={t('photo', { index: i + 1, count })}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded ring-2 ${i === index ? 'ring-accent' : 'ring-transparent'}`}>
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label={t('nextPhoto')} className="rounded-full bg-white/10 px-5 py-3 text-white">›</button>
          </div>
        </div>
      )}
    </div>
  );
}
