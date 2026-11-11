'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PhotoViewer, type Slide } from './PhotoViewer';

/** Mosaic (1 large + 3 small + floor plan) that opens the shared full-screen viewer. */
export function Gallery({ images, alt, floorPlan }: { images: string[]; alt: string; floorPlan: React.ReactNode }) {
  const t = useTranslations('listing');
  const tp = useTranslations('floorPlan');
  const [start, setStart] = useState<number | null>(null);
  const close = useCallback(() => setStart(null), []);
  const slides: Slide[] = [...images.map((src) => ({ kind: 'image' as const, src })), { kind: 'plan', node: floorPlan }];
  const planIndex = slides.length - 1;
  const count = images.length;

  return (
    <div>
      <div className="grid gap-2 md:h-[440px] md:grid-cols-4 md:grid-rows-2">
        <button type="button" onClick={() => setStart(0)} aria-label={t('photo', { index: 1, count })}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5 md:col-span-2 md:row-span-2 md:aspect-auto">
          <Image src={images[0]} alt={alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" />
        </button>
        {images.slice(1, 4).map((src, i) => (
          <button key={src} type="button" onClick={() => setStart(i + 1)} aria-label={t('photo', { index: i + 2, count })}
            className="relative hidden overflow-hidden rounded-2xl bg-ink/5 md:block">
            <Image src={src} alt="" fill sizes="25vw" className="object-cover transition hover:scale-105" />
          </button>
        ))}
        <button type="button" onClick={() => setStart(planIndex)} aria-label={tp('title')}
          className="relative hidden overflow-hidden rounded-2xl border border-line bg-white hover:border-accent md:block">
          <div className="absolute inset-x-2 bottom-9 top-2 [&>*]:h-full [&>*]:w-full">{floorPlan}</div>
          <span className="absolute bottom-2 left-2 rounded-full bg-ink/80 px-2.5 py-1 text-xs text-white">{tp('title')}</span>
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setStart(0)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-accent">
          ▦ {t('showAll')} ({count})
        </button>
        <button type="button" onClick={() => setStart(planIndex)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-accent">
          ⌗ {tp('title')}
        </button>
      </div>
      {start !== null && <PhotoViewer slides={slides} alt={alt} start={start} onClose={close} />}
    </div>
  );
}
