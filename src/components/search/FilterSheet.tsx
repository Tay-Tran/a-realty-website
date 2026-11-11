'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SearchOptions } from '@/lib/data/search-options';
import type { Filters } from '@/lib/listing/filters';
import { FilterPanel } from './FilterPanel';

export function FilterSheet({ options, filters }: { options: SearchOptions; filters: Filters }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium">{t('search.filters')}</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label={t('search.filters')} onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-paper p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-semibold">{t('search.filters')}</p>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-ink-soft">{t('nav.close')}</button>
            </div>
            <FilterPanel options={options} filters={filters} onApplied={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
