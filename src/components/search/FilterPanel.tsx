'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { SearchOptions } from '@/lib/data/search-options';
import { CONDITION_KEYS, LAYOUTS, type ConditionKey, type Layout, type Locale } from '@/lib/data/types';
import { formatMoney } from '@/lib/currency';
import { serializeFilters, type Filters } from '@/lib/listing/filters';
import { usePreferences } from '@/components/providers/PreferencesProvider';
import { Picker } from '@/components/ui/Picker';
import { AGE_STEPS, BEDROOM_STEPS, RENT_STEPS, SIZE_STEPS, WALK_STEPS } from './constants';

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

export function FilterPanel({ options, filters, onApplied }: { options: SearchOptions; filters: Filters; onApplied?: () => void }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [area, setArea] = useState(filters.area ?? '');
  const [line, setLine] = useState(filters.line ?? '');
  const [station, setStation] = useState(filters.station ?? '');
  const [maxWalk, setMaxWalk] = useState(filters.maxWalk ? String(filters.maxWalk) : '');
  const [minRent, setMinRent] = useState(filters.minRent ? String(filters.minRent) : '');
  const [maxRent, setMaxRent] = useState(filters.maxRent ? String(filters.maxRent) : '');
  const [minSize, setMinSize] = useState(filters.minSize ? String(filters.minSize) : '');
  const [maxSize, setMaxSize] = useState(filters.maxSize ? String(filters.maxSize) : '');
  const [bedrooms, setBedrooms] = useState(filters.bedrooms ? String(filters.bedrooms) : '');
  const [maxAge, setMaxAge] = useState(filters.maxAge !== undefined ? String(filters.maxAge) : '');
  const { currency } = usePreferences();
  const [layouts, setLayouts] = useState<Layout[]>(filters.layouts ?? []);
  const [conditions, setConditions] = useState<ConditionKey[]>(filters.conditions ?? []);
  const stationOptions = line ? options.stations.filter((s) => s.lines.includes(line)) : options.stations;

  function go(next: Filters) {
    const qs = serializeFilters(next);
    router.push(qs ? `/rent?${qs}` : '/rent');
    onApplied?.();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    go({
      area: area || undefined, line: line || undefined, station: station || undefined,
      maxWalk: maxWalk ? Number(maxWalk) : undefined,
      minRent: minRent ? Number(minRent) : undefined, maxRent: maxRent ? Number(maxRent) : undefined,
      minSize: minSize ? Number(minSize) : undefined, maxSize: maxSize ? Number(maxSize) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined, maxAge: maxAge ? Number(maxAge) : undefined,
      layouts, conditions, sort: filters.sort,
    });
  }

  const legend = 'mb-1 block text-sm font-semibold text-ink';
  const fieldLegend = 'text-sm font-semibold text-ink';
  const lineColor = Object.fromEntries(options.lines.map((l) => [l.value, l.color ?? '']));
  const money = (v: number) => ({ value: String(v), label: formatMoney(v, currency, locale) });
  const m2 = (v: number) => ({ value: String(v), label: `${v} m²` });
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <span className={legend}>{t('hero.area')}</span>
        <Picker label={t('hero.area')} placeholder={t('hero.anyArea')} value={area} onChange={setArea} options={options.areas} />
      </div>
      <div>
        <span className={legend}>{t('hero.line')}</span>
        <Picker label={t('hero.line')} placeholder={t('hero.anyLine')} value={line} onChange={(v) => { setLine(v); setStation(''); }}
          options={options.lines.map((o) => ({ ...o, dots: o.color ? [o.color] : undefined }))}
          searchable searchPlaceholder={t('hero.filterList')} noResults={t('hero.noMatch')} />
      </div>
      <div>
        <span className={legend}>{t('hero.station')}</span>
        <Picker label={t('hero.station')} placeholder={t('hero.anyStation')} value={station} onChange={setStation}
          options={stationOptions.map((o) => ({ value: o.value, label: o.label, dots: o.lines.map((l) => lineColor[l]).filter(Boolean) }))}
          searchable searchPlaceholder={t('hero.filterList')} noResults={t('hero.noMatch')} />
      </div>
      <div>
        <span className={legend}>{t('search.maxWalk')}</span>
        <Picker label={t('search.maxWalk')} placeholder={t('search.anyWalk')} value={maxWalk} onChange={setMaxWalk}
          options={WALK_STEPS.map((m) => ({ value: String(m), label: t('search.walkOption', { minutes: m }) }))} />
      </div>
      <div>
        <span className={legend}>{t('search.rent')}</span>
        <div className="grid grid-cols-2 gap-2">
          <Picker label={`${t('search.rent')} ${t('search.min')}`} placeholder={t('search.min')} value={minRent} onChange={setMinRent} options={RENT_STEPS.map(money)} />
          <Picker label={`${t('search.rent')} ${t('search.max')}`} placeholder={t('search.max')} value={maxRent} onChange={setMaxRent} options={RENT_STEPS.map(money)} align="right" />
        </div>
      </div>
      <div>
        <span className={legend}>{t('search.size')}</span>
        <div className="grid grid-cols-2 gap-2">
          <Picker label={`${t('search.size')} ${t('search.min')}`} placeholder={t('search.min')} value={minSize} onChange={setMinSize} options={SIZE_STEPS.map(m2)} />
          <Picker label={`${t('search.size')} ${t('search.max')}`} placeholder={t('search.max')} value={maxSize} onChange={setMaxSize} options={SIZE_STEPS.map(m2)} align="right" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className={legend}>{t('search.bedrooms')}</span>
          <Picker label={t('search.bedrooms')} placeholder={t('hero.anyBedrooms')} value={bedrooms} onChange={setBedrooms}
            options={BEDROOM_STEPS.map((v) => ({ value: String(v), label: t('hero.bedroomsOption', { count: v }) }))} />
        </div>
        <div>
          <span className={legend}>{t('search.maxAge')}</span>
          <Picker label={t('search.maxAge')} placeholder={t('search.anyAge')} value={maxAge} onChange={setMaxAge} align="right"
            options={AGE_STEPS.map((v) => ({ value: String(v), label: t('search.ageOption', { years: v }) }))} />
        </div>
      </div>
      <fieldset>
        <legend className={fieldLegend}>{t('search.layouts')}</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {LAYOUTS.map((l) => (
            <label key={l} className={`cursor-pointer rounded-lg border px-2 py-1.5 text-center text-sm ${layouts.includes(l) ? 'border-accent bg-tint text-accent-dark' : 'border-line bg-white'}`}>
              <input type="checkbox" className="sr-only" checked={layouts.includes(l)} onChange={() => setLayouts(toggle(layouts, l))} />{l}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className={fieldLegend}>{t('search.conditions')}</legend>
        {/* Every listing accepts foreigners, so that flag is not offered as a filter. */}
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {CONDITION_KEYS.filter((c) => c !== 'foreignerOk').map((c) => {
            const on = conditions.includes(c);
            return (
              <label key={c} className={`flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1.5 text-xs leading-tight ${on ? 'border-accent bg-tint font-medium text-accent-dark' : 'border-line bg-white text-ink'}`}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => setConditions(toggle(conditions, c))} />
                <span aria-hidden className={on ? '' : 'text-line'}>✓</span>{t(`conditions.${c}`)}
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="sticky bottom-0 -mx-5 flex gap-2 border-t border-line bg-white px-5 py-3">
        <button type="button" onClick={() => go({ sort: filters.sort })} className="shrink-0 whitespace-nowrap rounded-full border border-line bg-white px-3 py-2.5 text-sm">{t('search.clear')}</button>
        <button type="submit" className="min-w-0 flex-1 whitespace-nowrap rounded-full bg-accent px-3 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark">{t('search.apply')}</button>
      </div>
    </form>
  );
}
