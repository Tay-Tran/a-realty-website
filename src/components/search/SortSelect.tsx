'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { SORTS, type SortKey } from '@/lib/data/types';
import { serializeFilters, type Filters } from '@/lib/listing/filters';

const LABEL: Record<SortKey, string> = { newest: 'sortNewest', 'price-asc': 'sortPriceAsc', 'price-desc': 'sortPriceDesc' };

export function SortSelect({ filters }: { filters: Filters }) {
  const t = useTranslations('search');
  const router = useRouter();
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only sm:not-sr-only">{t('sort')}</span>
      <select value={filters.sort ?? 'newest'}
        onChange={(e) => {
          const qs = serializeFilters({ ...filters, sort: e.target.value as SortKey, page: undefined });
          router.push(qs ? `/rent?${qs}` : '/rent');
        }}
        className="rounded-full border border-line bg-white py-2 pl-3 pr-8 text-sm">
        {SORTS.map((s) => <option key={s} value={s}>{t(LABEL[s])}</option>)}
      </select>
    </label>
  );
}
