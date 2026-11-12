import { useTranslations } from 'next-intl';
import type { ListingSource, SourceName } from '@/lib/data/types';

export const SOURCE_DISPLAY_NAMES: Record<SourceName, string> = { leopalace21: 'Leopalace21', jk: 'J&K' };

/** Small "Source: Leopalace21" chip for rooms pulled from an outside site. */
export function SourceTag({ source, className = '' }: { source: ListingSource; className?: string }) {
  const t = useTranslations('source');
  return (
    <span className={`inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-ink shadow-sm ${className}`}>
      {t('label', { name: SOURCE_DISPLAY_NAMES[source.name] })}
    </span>
  );
}

/** "Source: Leopalace21 · View on Leopalace21 ↗" line for the listing page. */
export function SourceLine({ source }: { source: ListingSource }) {
  const t = useTranslations('source');
  const name = SOURCE_DISPLAY_NAMES[source.name];
  return (
    <p className="mt-2 text-sm text-ink-soft">
      {t('label', { name })} ·{' '}
      <a href={source.url} target="_blank" rel="noopener nofollow" className="text-sky underline-offset-2 hover:underline">
        {t('view', { name })} ↗
      </a>
    </p>
  );
}
