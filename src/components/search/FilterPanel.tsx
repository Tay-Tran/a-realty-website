'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { SearchOptions } from '@/lib/data/search-options';
import { CONDITION_KEYS, LAYOUTS, type ConditionKey, type Layout, type Locale } from '@/lib/data/types';
import { serializeFilters, type Filters } from '@/lib/listing/filters';
import { formatYen } from '@/lib/listing/format';
import { RENT_STEPS, WALK_STEPS } from './constants';

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
      layouts, conditions, sort: filters.sort,
    });
  }

  const select = 'mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink';
  const legend = 'text-sm font-semibold text-ink';
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className={`block ${legend}`}>{t('hero.area')}
        <select value={area} onChange={(e) => setArea(e.target.value)} className={select}>
          <option value="">{t('hero.anyArea')}</option>
          {options.areas.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className={`block ${legend}`}>{t('hero.line')}
        <select value={line} onChange={(e) => { setLine(e.target.value); setStation(''); }} className={select}>
          <option value="">{t('hero.anyLine')}</option>
          {options.lines.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className={`block ${legend}`}>{t('hero.station')}
        <select value={station} onChange={(e) => setStation(e.target.value)} className={select}>
          <option value="">{t('hero.anyStation')}</option>
          {stationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className={`block ${legend}`}>{t('search.maxWalk')}
        <select value={maxWalk} onChange={(e) => setMaxWalk(e.target.value)} className={select}>
          <option value="">{t('search.anyWalk')}</option>
          {WALK_STEPS.map((m) => <option key={m} value={m}>{t('search.walkOption', { minutes: m })}</option>)}
        </select>
      </label>
      <fieldset>
        <legend className={legend}>{t('search.rent')}</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <select aria-label={t('search.min')} value={minRent} onChange={(e) => setMinRent(e.target.value)} className={select}>
            <option value="">{t('search.min')}</option>
            {RENT_STEPS.map((v) => <option key={v} value={v}>{formatYen(v, locale)}</option>)}
          </select>
          <select aria-label={t('search.max')} value={maxRent} onChange={(e) => setMaxRent(e.target.value)} className={select}>
            <option value="">{t('search.max')}</option>
            {RENT_STEPS.map((v) => <option key={v} value={v}>{formatYen(v, locale)}</option>)}
          </select>
        </div>
      </fieldset>
      <fieldset>
        <legend className={legend}>{t('search.layouts')}</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {LAYOUTS.map((l) => (
            <label key={l} className={`cursor-pointer rounded-lg border px-2 py-1.5 text-center text-sm ${layouts.includes(l) ? 'border-accent bg-accent/10 text-accent-dark' : 'border-line bg-white'}`}>
              <input type="checkbox" className="sr-only" checked={layouts.includes(l)} onChange={() => setLayouts(toggle(layouts, l))} />{l}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className={legend}>{t('search.conditions')}</legend>
        <div className="mt-2 space-y-2">
          {CONDITION_KEYS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={conditions.includes(c)} onChange={() => setConditions(toggle(conditions, c))} className="h-4 w-4 accent-[var(--color-accent)]" />
              {t(`conditions.${c}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex gap-2">
        <button type="button" onClick={() => go({ sort: filters.sort })} className="flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm">{t('search.clear')}</button>
        <button type="submit" className="flex-1 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark">{t('search.apply')}</button>
      </div>
    </form>
  );
}
