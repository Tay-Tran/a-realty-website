'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { formatMoney } from '@/lib/currency';
import type { SearchOptions } from '@/lib/data/search-options';
import { CONDITION_KEYS, LAYOUTS, type ConditionKey, type Layout, type Locale } from '@/lib/data/types';
import { serializeFilters } from '@/lib/listing/filters';
import { matchPlaces, type PlaceMatch } from '@/lib/search/places';
import { usePreferences } from '@/components/providers/PreferencesProvider';
import { ChevronDownIcon, PinIcon, SearchIcon, StationIcon, TrainIcon } from '@/components/ui/icons';
import { BEDROOM_STEPS } from './constants';

type Range = [number, number | null];
const PRICE_RANGES: Range[] = [[0, 60000], [60000, 80000], [80000, 100000], [100000, 150000], [150000, null]];
const SIZE_RANGES: Range[] = [[0, 20], [20, 30], [30, 40], [40, null]];
const DETAIL_CONDITIONS = CONDITION_KEYS.filter((c) => c !== 'foreignerOk' && c !== 'shortTermOk');

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/** Search card modelled on the reference layout: quick search, 3 place tiles, 4 small pickers, centred button. */
export function SearchBox({ options }: { options: SearchOptions }) {
  const t = useTranslations('hero');
  const tc = useTranslations('conditions');
  const locale = useLocale() as Locale;
  const { currency } = usePreferences();
  const router = useRouter();

  const [mode, setMode] = useState<'rent' | 'short'>('rent');
  const [area, setArea] = useState('');
  const [line, setLine] = useState('');
  const [station, setStation] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [conditions, setConditions] = useState<ConditionKey[]>([]);
  const [query, setQuery] = useState('');
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const matches = matchPlaces(query, options);
  const stationOptions = line ? options.stations.filter((s) => s.lines.includes(line)) : options.stations;
  const money = (v: number) => formatMoney(v, currency, locale);
  const rangeLabel = ([min, max]: Range, fmt: (v: number) => string) =>
    max === null ? t('rangeFrom', { min: fmt(min) }) : min === 0 ? t('rangeUpTo', { max: fmt(max) }) : t('rangeBetween', { min: fmt(min), max: fmt(max) });
  const detailCount = layouts.length + conditions.length;

  function choose(m: PlaceMatch) {
    if (m.type === 'station') { setStation(m.value); setLine(''); }
    if (m.type === 'area') setArea(m.value);
    if (m.type === 'line') { setLine(m.value); setStation(''); }
    setQuery(m.label);
    setSuggestOpen(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // A typed but unpicked quick-search term uses its best match.
    let picked = { area, line, station };
    if (query && suggestOpen && matches[0]) {
      const m = matches[0];
      picked = { ...picked, [m.type]: m.value, ...(m.type === 'station' ? { line: '' } : {}) };
    }
    const p = price ? PRICE_RANGES[Number(price)] : undefined;
    const s = size ? SIZE_RANGES[Number(size)] : undefined;
    const qs = serializeFilters({
      area: picked.area || undefined,
      line: picked.line || undefined,
      station: picked.station || undefined,
      minRent: p && p[0] > 0 ? p[0] : undefined,
      maxRent: p?.[1] ?? undefined,
      minSize: s && s[0] > 0 ? s[0] : undefined,
      maxSize: s?.[1] ?? undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      layouts,
      conditions: mode === 'short' ? [...conditions, 'shortTermOk'] : conditions,
    });
    router.push(qs ? `/rent?${qs}` : '/rent');
  }

  const tab = (active: boolean) =>
    `rounded-full px-6 py-2 text-sm font-semibold transition ${active ? 'bg-accent text-white shadow' : 'text-white/85 hover:text-white'}`;
  const tile = 'flex min-w-0 flex-col px-4 py-3 text-left';
  const tileTitle = 'flex items-center gap-2 text-sm font-bold text-accent';
  const tileSelect = 'mt-1 w-full cursor-pointer appearance-none truncate bg-transparent pr-4 text-sm text-ink-soft focus:outline-none';
  const small = 'w-full cursor-pointer rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink';
  const chip = (on: boolean) =>
    `cursor-pointer rounded-lg border px-2 py-1.5 text-center text-xs ${on ? 'border-accent bg-accent/10 font-semibold text-accent-dark' : 'border-line bg-white'}`;

  return (
    <div className="text-left">
      <div role="tablist" className="mx-auto mb-4 flex w-fit gap-1 rounded-full bg-ink/70 p-1.5 backdrop-blur">
        <button type="button" role="tab" aria-selected={mode === 'rent'} onClick={() => setMode('rent')} className={tab(mode === 'rent')}>{t('tabRent')}</button>
        <button type="button" role="tab" aria-selected={mode === 'short'} onClick={() => setMode('short')} className={tab(mode === 'short')}>{t('tabShort')}</button>
        {/* Buy is phase 2 in the quote – shown as a roadmap item only. */}
        <button type="button" role="tab" aria-selected={false} disabled title={t('comingSoon')}
          className="cursor-not-allowed rounded-full px-4 py-2 text-sm font-semibold text-white/45">
          {t('tabBuy')} <span className="ml-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px]">{t('comingSoon')}</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-3xl bg-gradient-to-br from-accent to-accent-dark p-3 shadow-2xl sm:p-4">
        {mode === 'short' && <p className="px-1 text-sm text-white">{t('shortTermNote')}</p>}

        {/* Quick search */}
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input type="search" value={query} placeholder={t('quickSearch')} aria-label={t('quickSearch')}
            onChange={(e) => { setQuery(e.target.value); setSuggestOpen(true); }}
            onFocus={() => setSuggestOpen(true)} onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
            className="w-full rounded-2xl border-0 bg-white py-3 pl-10 pr-4 text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-white/70" />
          {suggestOpen && query.trim() && (
            <ul role="listbox" className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-2xl bg-white py-1 shadow-xl">
              {matches.length === 0 && <li className="px-4 py-2 text-sm text-ink-soft">{t('noMatch')}</li>}
              {matches.map((m) => (
                <li key={`${m.type}-${m.value}`}>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => choose(m)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-paper">
                    <span>{m.label}</span>
                    <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-ink-soft">
                      {t(m.type === 'station' ? 'typeStation' : m.type === 'area' ? 'typeArea' : 'typeLine')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Area · Line · Station tiles */}
        <div className="grid divide-y divide-line rounded-2xl bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <label className={tile}>
            <span className={tileTitle}><PinIcon />{t('area')}<ChevronDownIcon className="ml-auto h-4 w-4 text-ink-soft" /></span>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={tileSelect}>
              <option value="">{t('searchByArea')}</option>
              {options.areas.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className={tile}>
            <span className={tileTitle}><TrainIcon />{t('line')}<ChevronDownIcon className="ml-auto h-4 w-4 text-ink-soft" /></span>
            <select value={line} onChange={(e) => { setLine(e.target.value); setStation(''); }} className={tileSelect}>
              <option value="">{t('searchByLine')}</option>
              {options.lines.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className={tile}>
            <span className={tileTitle}><StationIcon />{t('station')}<ChevronDownIcon className="ml-auto h-4 w-4 text-ink-soft" /></span>
            <select value={station} onChange={(e) => setStation(e.target.value)} className={tileSelect}>
              <option value="">{t('searchByStation')}</option>
              {stationOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>

        {/* Price · Size · Bedrooms · Details */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <select aria-label={t('priceRange')} value={price} onChange={(e) => setPrice(e.target.value)} className={small}>
            <option value="">{t('priceRange')}</option>
            {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{rangeLabel(r, money)}</option>)}
          </select>
          <select aria-label={t('sizeRange')} value={size} onChange={(e) => setSize(e.target.value)} className={small}>
            <option value="">{t('sizeRange')}</option>
            {SIZE_RANGES.map((r, i) => <option key={i} value={i}>{rangeLabel(r, (v) => `${v} m²`)}</option>)}
          </select>
          <select aria-label={t('bedrooms')} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={small}>
            <option value="">{t('bedrooms')}</option>
            {BEDROOM_STEPS.map((v) => <option key={v} value={v}>{t('bedroomsOption', { count: v })}</option>)}
          </select>
          <div className="relative">
            <button type="button" onClick={() => setDetailsOpen((o) => !o)} aria-expanded={detailsOpen}
              className={`${small} relative text-center font-medium`}>
              {t('details')}
              <span className={`absolute -right-1.5 -top-2 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold text-white ${detailCount ? 'bg-ink' : 'bg-ink/40'}`}>
                {detailCount}
              </span>
            </button>
            {detailsOpen && (
              <>
                <div aria-hidden className="fixed inset-0 z-20" onClick={() => setDetailsOpen(false)} />
                <div role="dialog" aria-label={t('detailsTitle')}
                  className="absolute right-0 top-full z-30 mt-2 w-[min(88vw,420px)] space-y-4 rounded-2xl bg-white p-4 shadow-2xl">
                  <p className="font-semibold">{t('detailsTitle')}</p>
                  <div>
                    <p className="text-sm font-medium text-ink-soft">{t('layout')}</p>
                    <div className="mt-2 grid grid-cols-4 gap-1.5">
                      {LAYOUTS.map((l) => (
                        <button key={l} type="button" aria-pressed={layouts.includes(l)} onClick={() => setLayouts(toggle(layouts, l))} className={chip(layouts.includes(l))}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DETAIL_CONDITIONS.map((c) => (
                      <button key={c} type="button" aria-pressed={conditions.includes(c)} onClick={() => setConditions(toggle(conditions, c))}
                        className={`${chip(conditions.includes(c))} text-left leading-tight`}>{tc(c)}</button>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 border-t border-line pt-3">
                    <button type="button" onClick={() => { setLayouts([]); setConditions([]); }} className="rounded-full border border-line px-4 py-2 text-sm">{t('reset')}</button>
                    <button type="button" onClick={() => setDetailsOpen(false)} className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white">{t('done')}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-1">
          <button type="submit" className="w-full max-w-sm rounded-full bg-white px-6 py-3 font-bold text-accent-dark shadow hover:bg-paper">
            <SearchIcon className="mr-2 inline h-4 w-4 align-[-2px]" />{t('submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
