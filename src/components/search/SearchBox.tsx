'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { formatMoney } from '@/lib/currency';
import type { SearchOptions } from '@/lib/data/search-options';
import type { Locale } from '@/lib/data/types';
import { serializeFilters } from '@/lib/listing/filters';
import { usePreferences } from '@/components/providers/PreferencesProvider';
import { BEDROOM_STEPS, RENT_STEPS, SIZE_STEPS } from './constants';

export function SearchBox({ options }: { options: SearchOptions }) {
  const t = useTranslations('hero');
  const locale = useLocale() as Locale;
  const { currency } = usePreferences();
  const router = useRouter();
  const [area, setArea] = useState('');
  const [line, setLine] = useState('');
  const [station, setStation] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [minSize, setMinSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [mode, setMode] = useState<'rent' | 'short'>('rent');
  const stationOptions = line ? options.stations.filter((s) => s.lines.includes(line)) : options.stations;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const qs = serializeFilters({
      area: area || undefined,
      line: line || undefined,
      station: station || undefined,
      maxRent: maxRent ? Number(maxRent) : undefined,
      minSize: minSize ? Number(minSize) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      conditions: mode === 'short' ? ['shortTermOk'] : undefined,
    });
    router.push(qs ? `/rent?${qs}` : '/rent');
  }

  const select = 'mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink';
  const label = 'text-sm font-medium text-ink';
  const tab = (active: boolean) =>
    `rounded-full px-5 py-2 text-sm font-semibold transition ${active ? 'bg-accent text-white shadow' : 'text-white/90 hover:bg-white/15'}`;
  return (
    <div>
      <div role="tablist" className="mb-3 inline-flex gap-1 rounded-full bg-black/35 p-1 backdrop-blur">
        <button type="button" role="tab" aria-selected={mode === 'rent'} onClick={() => setMode('rent')} className={tab(mode === 'rent')}>{t('tabRent')}</button>
        <button type="button" role="tab" aria-selected={mode === 'short'} onClick={() => setMode('short')} className={tab(mode === 'short')}>{t('tabShort')}</button>
        {/* Buy is phase 2 in the quote – shown as a roadmap item only. */}
        <button type="button" role="tab" aria-selected={false} disabled title={t('comingSoon')}
          className="cursor-not-allowed rounded-full px-4 py-2 text-sm font-semibold text-white/50">
          {t('tabBuy')} <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{t('comingSoon')}</span>
        </button>
      </div>
    <form onSubmit={onSubmit} className="space-y-3 rounded-3xl bg-white/95 p-4 text-left shadow-2xl backdrop-blur sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className={label}>{t('area')}
          <select value={area} onChange={(e) => setArea(e.target.value)} className={select}>
            <option value="">{t('anyArea')}</option>
            {options.areas.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <label className={label}>{t('line')}
          <select value={line} onChange={(e) => { setLine(e.target.value); setStation(''); }} className={select}>
            <option value="">{t('anyLine')}</option>
            {options.lines.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <label className={label}>{t('station')}
          <select value={station} onChange={(e) => setStation(e.target.value)} className={select}>
            <option value="">{t('anyStation')}</option>
            {stationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4 sm:items-end">
        <label className={label}>{t('maxRent')}
          <select value={maxRent} onChange={(e) => setMaxRent(e.target.value)} className={select}>
            <option value="">{t('noLimit')}</option>
            {RENT_STEPS.map((v) => <option key={v} value={v}>{formatMoney(v, currency, locale)}</option>)}
          </select>
        </label>
        <label className={label}>{t('size')}
          <select value={minSize} onChange={(e) => setMinSize(e.target.value)} className={select}>
            <option value="">{t('anySize')}</option>
            {SIZE_STEPS.map((v) => <option key={v} value={v}>{t('sizeOption', { size: v })}</option>)}
          </select>
        </label>
        <label className={label}>{t('bedrooms')}
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={select}>
            <option value="">{t('anyBedrooms')}</option>
            {BEDROOM_STEPS.map((v) => <option key={v} value={v}>{t('bedroomsOption', { count: v })}</option>)}
          </select>
        </label>
        <button type="submit" className="rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark">
          {t('submit')}
        </button>
      </div>
    </form>
    </div>
  );
}
