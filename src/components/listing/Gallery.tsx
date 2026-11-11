'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const t = useTranslations('listing');
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

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

  const arrow = 'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg shadow';
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5">
        <Image src={images[index]} alt={`${alt} – ${t('photo', { index: index + 1, count })}`} fill priority
          sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        <button type="button" onClick={() => go(-1)} aria-label={t('prevPhoto')} className={`${arrow} left-3`}>‹</button>
        <button type="button" onClick={() => go(1)} aria-label={t('nextPhoto')} className={`${arrow} right-3`}>›</button>
        <button type="button" onClick={() => setOpen(true)} className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1.5 text-xs text-white">
          {t('openGallery')} · {index + 1}/{count}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((src, i) => (
          <button key={src} type="button" onClick={() => setIndex(i)} aria-label={t('photo', { index: i + 1, count })}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg ring-2 ${i === index ? 'ring-accent' : 'ring-transparent'}`}>
            <Image src={src} alt="" fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={t('openGallery')} className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm">{t('photo', { index: index + 1, count })}</span>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-white/10 px-4 py-2 text-sm">{t('closeGallery')}</button>
          </div>
          <div className="relative flex-1"><Image src={images[index]} alt={alt} fill sizes="100vw" className="object-contain" /></div>
          <div className="flex justify-between p-4">
            <button type="button" onClick={() => go(-1)} aria-label={t('prevPhoto')} className="rounded-full bg-white/10 px-5 py-3 text-white">‹</button>
            <button type="button" onClick={() => go(1)} aria-label={t('nextPhoto')} className="rounded-full bg-white/10 px-5 py-3 text-white">›</button>
          </div>
        </div>
      )}
    </div>
  );
}
