'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/** Mosaic (1 large + 4 small) that opens a full-screen viewer. */
export function Gallery({ images, alt, floorPlan }: { images: string[]; alt: string; floorPlan: React.ReactNode }) {
  const t = useTranslations('listing');
  const tp = useTranslations('floorPlan');
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const count = images.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);
  const show = (i: number) => { setIndex(i); setOpen(true); };

  useEffect(() => {
    if (!planOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPlanOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [planOpen]);

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
        {images.slice(1, 4).map((src, i) => (
          <button key={src} type="button" onClick={() => show(i + 1)} aria-label={t('photo', { index: i + 2, count })}
            className="relative hidden overflow-hidden rounded-2xl bg-ink/5 md:block">
            <Image src={src} alt="" fill sizes="25vw" className="object-cover transition hover:scale-105" />
          </button>
        ))}
        <button type="button" onClick={() => setPlanOpen(true)} aria-label={tp('title')}
          className="relative hidden overflow-hidden rounded-2xl border border-line bg-white md:block">
          <div className="absolute inset-x-2 bottom-9 top-2 [&>*]:h-full [&>*]:w-full">{floorPlan}</div>
          <span className="absolute bottom-2 left-2 rounded-full bg-ink/80 px-2.5 py-1 text-xs text-white">{tp('title')}</span>
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => show(0)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-accent">
          ▦ {t('showAll')} ({count})
        </button>
        <button type="button" onClick={() => setPlanOpen(true)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-accent">
          ⌗ {tp('title')}
        </button>
      </div>

      {planOpen && (
        <div role="dialog" aria-modal="true" aria-label={tp('title')} onClick={() => setPlanOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div onClick={(e) => e.stopPropagation()} className="flex max-h-full w-full max-w-md flex-col rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-bold">{tp('title')}</p>
              <button type="button" onClick={() => setPlanOpen(false)} className="text-sm text-ink-soft">{t('closeGallery')}</button>
            </div>
            <div className="mt-3 min-h-0 flex-1">{floorPlan}</div>
            <p className="mt-3 text-xs text-ink-soft">{tp('note')}</p>
          </div>
        </div>
      )}

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
