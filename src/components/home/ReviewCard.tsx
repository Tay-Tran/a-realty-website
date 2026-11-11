'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];

/** "Google" wordmark in brand colours – text only, no logo image. */
function GoogleWord() {
  return (
    <span className="font-semibold" aria-label="Google">
      {'Google'.split('').map((c, i) => <span key={i} style={{ color: GOOGLE_COLORS[i] }}>{c}</span>)}
    </span>
  );
}

export function ReviewCard({ name, from, text, daysAgo, color }: {
  name: string; from: string; text: string; daysAgo: number; color: string;
}) {
  const t = useTranslations('home');
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLQuoteElement>(null);

  // Show "Read more" only when the 3-line clamp actually hides text.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => { if (!expanded) setOverflows(el.scrollHeight > el.clientHeight + 1); };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [expanded, text]);
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-sm">
      <figcaption className="flex items-start gap-3">
        <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-bold text-white ${color}`}>{name.charAt(0)}</span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1 font-semibold text-ink">
            <span className="truncate">{name}</span>
            <span aria-hidden className="grid h-4 w-4 place-items-center rounded-full bg-[#4285F4] text-[10px] text-white">✓</span>
          </span>
          <span className="block text-xs text-ink-soft">
            {t('reviewAgo', { count: daysAgo })} {t('onGoogle')} <GoogleWord />
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[10px] font-medium text-ink-soft">{t('reviewSample')}</span>
      </figcaption>
      <p aria-label="5/5" className="mt-3 text-lg leading-none tracking-wider text-[#FBBC05]">★★★★★</p>
      <blockquote ref={textRef} className={`mt-2 text-sm text-ink ${expanded ? '' : 'line-clamp-3'}`}>{text}</blockquote>
      {(overflows || expanded) && (
        <button type="button" onClick={() => setExpanded((e) => !e)} className="mt-1 self-start text-sm font-medium text-[#4285F4] hover:underline">
          {expanded ? t('readLess') : t('readMore')}
        </button>
      )}
      <p className="mt-auto pt-3 text-xs text-ink-soft">{from}</p>
    </figure>
  );
}
