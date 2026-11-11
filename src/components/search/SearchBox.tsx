'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { SearchOptions } from '@/lib/data/search-options';
import { LAYOUTS, type Layout, type Locale } from '@/lib/data/types';
import { serializeFilters } from '@/lib/listing/filters';
import { formatYen } from '@/lib/listing/format';
import { RENT_STEPS } from './constants';

export function SearchBox({ options }: { options: SearchOptions }) {
  const t = useTranslations('hero');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [area, setArea] = useState('');
  const [line, setLine] = useState('');
  const [station, setStation] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [layout, setLayout] = useState('');
  const stationOptions = line ? options.stations.filter((s) => s.lines.includes(line)) : options.stations;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const qs = serializeFilters({
      area: area || undefined,
      line: line || undefined,
      station: station || undefined,
      maxRent: maxRent ? Number(maxRent) : undefined,
      layouts: layout ? [layout as Layout] : undefined,
    });
    router.push(qs ? `/rent?${qs}` : '/rent');
  }

  const select = 'mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-ink';
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
      <label className="text-sm font-medium text-ink">{t('area')}
        <select value={area} onChange={(e) => setArea(e.target.value)} className={select}>
          <option value="">{t('anyArea')}</option>
          {options.areas.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-ink">{t('line')}
        <select value={line} onChange={(e) => { setLine(e.target.value); setStation(''); }} className={select}>
          <option value="">{t('anyLine')}</option>
          {options.lines.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-ink">{t('station')}
        <select value={station} onChange={(e) => setStation(e.target.value)} className={select}>
          <option value="">{t('anyStation')}</option>
          {stationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-ink">{t('maxRent')}
        <select value={maxRent} onChange={(e) => setMaxRent(e.target.value)} className={select}>
          <option value="">{t('noLimit')}</option>
          {RENT_STEPS.map((v) => <option key={v} value={v}>{formatYen(v, locale)}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-ink">{t('layout')}
        <select value={layout} onChange={(e) => setLayout(e.target.value)} className={select}>
          <option value="">{t('anyLayout')}</option>
          {LAYOUTS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>
      <button type="submit" className="rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark sm:col-span-2 lg:col-span-1">
        {t('submit')}
      </button>
    </form>
  );
}
