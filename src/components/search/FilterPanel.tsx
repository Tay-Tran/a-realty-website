'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { SearchOptions } from '@/lib/data/search-options';
import { CONDITION_KEYS, LAYOUTS, type ConditionKey, type Layout, type Locale } from '@/lib/data/types';
import { formatMoney } from '@/lib/currency';
import { serializeFilters, type Filters } from '@/lib/listing/filters';
import { usePreferences } from '@/components/providers/PreferencesProvider';
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
            {RENT_STEPS.map((v) => <option key={v} value={v}>{formatMoney(v, currency, locale)}</option>)}
          </select>
          <select aria-label={t('search.max')} value={maxRent} onChange={(e) => setMaxRent(e.target.value)} className={select}>
            <option value="">{t('search.max')}</option>
            {RENT_STEPS.map((v) => <option key={v} value={v}>{formatMoney(v, currency, locale)}</option>)}
          </select>
        </div>
      </fieldset>
      <fieldset>
        <legend className={legend}>{t('search.size')}</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <select aria-label={`${t('search.size')} ${t('search.min')}`} value={minSize} onChange={(e) => setMinSize(e.target.value)} className={select}>
            <option value="">{t('search.min')}</option>
            {SIZE_STEPS.map((v) => <option key={v} value={v}>{v} m²</option>)}
          </select>
          <select aria-label={`${t('search.size')} ${t('search.max')}`} value={maxSize} onChange={(e) => setMaxSize(e.target.value)} className={select}>
            <option value="">{t('search.max')}</option>
            {SIZE_STEPS.map((v) => <option key={v} value={v}>{v} m²</option>)}
          </select>
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-2">
        <label className={`block ${legend}`}>{t('search.bedrooms')}
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={select}>
            <option value="">{t('hero.anyBedrooms')}</option>
            {BEDROOM_STEPS.map((v) => <option key={v} value={v}>{t('hero.bedroomsOption', { count: v })}</option>)}
          </select>
        </label>
        <label className={`block ${legend}`}>{t('search.maxAge')}
          <select value={maxAge} onChange={(e) => setMaxAge(e.target.value)} className={select}>
            <option value="">{t('search.anyAge')}</option>
            {AGE_STEPS.map((v) => <option key={v} value={v}>{t('search.ageOption', { years: v })}</option>)}
          </select>
        </label>
      </div>
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
        {/* Every listing accepts foreigners, so that flag is not offered as a filter. */}
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {CONDITION_KEYS.filter((c) => c !== 'foreignerOk').map((c) => {
            const on = conditions.includes(c);
            return (
              <label key={c} className={`flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1.5 text-xs leading-tight ${on ? 'border-accent bg-accent/10 font-medium text-accent-dark' : 'border-line bg-white text-ink'}`}>
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
