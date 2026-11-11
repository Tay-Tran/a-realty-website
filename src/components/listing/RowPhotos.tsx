'use client';

import Image from 'next/image';
import { useCallback, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { PhotoViewer, type Slide } from './PhotoViewer';

/** Photo column of a result card: every photo (and the floor plan) opens the viewer in place. */
export function RowPhotos({ images, alt, overlay, planThumb, planFull }: {
  images: string[];
  alt: string;
  /** Badges drawn over the main photo (status, "Rent"). */
  overlay?: ReactNode;
  planThumb: ReactNode;
  planFull: ReactNode;
}) {
  const t = useTranslations('listing');
  const tp = useTranslations('floorPlan');
  const [start, setStart] = useState<number | null>(null);
  const close = useCallback(() => setStart(null), []);
  const slides: Slide[] = [...images.map((src) => ({ kind: 'image' as const, src })), { kind: 'plan', node: planFull }];
  const planIndex = slides.length - 1;

  return (
    <div>
      <button type="button" onClick={() => setStart(0)} aria-label={`${t('openGallery')} – ${alt}`}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink/5">
        <Image src={images[0]} alt={alt} fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
        {overlay}
        <span className="absolute bottom-2 right-2 rounded-full bg-ink/75 px-2.5 py-1 text-[11px] font-medium text-white opacity-90">
          ▦ {images.length}
        </span>
      </button>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <button type="button" onClick={() => setStart(planIndex)} title={tp('title')} aria-label={tp('title')}
          className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border border-line bg-white p-1 hover:border-accent">
          {planThumb}
        </button>
        {images.slice(1, 3).map((src, i) => (
          <button key={src} type="button" onClick={() => setStart(i + 1)} aria-label={t('photo', { index: i + 2, count: images.length })}
            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink/5 ring-accent hover:ring-2">
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      {start !== null && <PhotoViewer slides={slides} alt={alt} start={start} onClose={close} />}
    </div>
  );
}
