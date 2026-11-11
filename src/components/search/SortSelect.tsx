'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { SORTS, type SortKey } from '@/lib/data/types';
import { serializeFilters, type Filters } from '@/lib/listing/filters';
import { Picker } from '@/components/ui/Picker';

const LABEL: Record<SortKey, string> = { newest: 'sortNewest', 'price-asc': 'sortPriceAsc', 'price-desc': 'sortPriceDesc' };

export function SortSelect({ filters }: { filters: Filters }) {
  const t = useTranslations('search');
  const router = useRouter();
  const sort = filters.sort ?? 'newest';
  return (
    <div className="flex items-center gap-2 text-sm">
      <span aria-hidden className="hidden text-ink-soft sm:inline">{t('sort')}</span>
      <Picker variant="pill" align="right" allowEmpty={false} label={t('sort')} placeholder={t(LABEL[sort])}
        value={sort}
        onChange={(v) => {
          const qs = serializeFilters({ ...filters, sort: v as SortKey, page: undefined });
          router.push(qs ? `/rent?${qs}` : '/rent');
        }}
        options={SORTS.map((s) => ({ value: s, label: t(LABEL[s]) }))} />
    </div>
  );
}
