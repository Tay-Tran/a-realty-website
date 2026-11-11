'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { formatMoney } from '@/lib/currency';
import type { SearchOptions } from '@/lib/data/search-options';
import type { ConditionKey, Layout, Locale } from '@/lib/data/types';
import { serializeFilters } from '@/lib/listing/filters';
import { matchPlaces, type PlaceMatch } from '@/lib/search/places';
import { usePreferences } from '@/components/providers/PreferencesProvider';
import { PinIcon, SearchIcon, StationIcon, TrainIcon } from '@/components/ui/icons';
import { Picker } from '@/components/ui/Picker';
import { BEDROOM_STEPS } from './constants';
import { DetailsDialog } from './DetailsDialog';

type Range = [number, number | null];
const PRICE_RANGES: Range[] = [[0, 60000], [60000, 80000], [80000, 100000], [100000, 150000], [150000, null]];
const SIZE_RANGES: Range[] = [[0, 20], [20, 30], [30, 40], [40, null]];

/** Search card modelled on the reference layout: quick search, 3 place tiles, 4 small pickers, centred button. */
export function SearchBox({ options }: { options: SearchOptions }) {
  const t = useTranslations('hero');
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
  const closeDetails = useCallback(() => setDetailsOpen(false), []);

  const matches = matchPlaces(query, options);
  const stationOptions = line ? options.stations.filter((s) => s.lines.includes(line)) : options.stations;
  const lineColor = Object.fromEntries(options.lines.map((l) => [l.value, l.color ?? '']));
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
    `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition sm:px-6 ${active ? 'bg-white text-accent shadow' : 'text-white/85 hover:text-white'}`;

  return (
    <div className="text-left">
      <div role="tablist" className="mx-auto mb-4 flex w-fit gap-1 rounded-full bg-ink/70 p-1.5 backdrop-blur">
        <button type="button" role="tab" aria-selected={mode === 'rent'} onClick={() => setMode('rent')} className={tab(mode === 'rent')}>{t('tabRent')}</button>
        <button type="button" role="tab" aria-selected={mode === 'short'} onClick={() => setMode('short')} className={tab(mode === 'short')}>{t('tabShort')}</button>
        {/* Buy is phase 2 in the quote – shown as a roadmap item only. */}
        <button type="button" role="tab" aria-selected={false} disabled title={t('comingSoon')}
          className="cursor-not-allowed whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-white/45 sm:px-4">
          {t('tabBuy')} <span className="ml-1 hidden rounded-full bg-white/15 px-2 py-0.5 text-[10px] sm:inline">{t('comingSoon')}</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-black/5 sm:p-4">
        {mode === 'short' && <p className="px-1 text-sm text-ink-soft">{t('shortTermNote')}</p>}

        {/* Quick search */}
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input type="search" value={query} placeholder={t('quickSearch')} aria-label={t('quickSearch')}
            onChange={(e) => { setQuery(e.target.value); setSuggestOpen(true); }}
            onFocus={() => setSuggestOpen(true)} onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
            className="w-full rounded-2xl border border-line bg-paper py-3 pl-10 pr-4 text-ink placeholder:text-ink-soft/70 focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/15" />
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
        <div className="grid divide-y divide-line rounded-2xl border border-line bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Picker variant="tile" icon={<PinIcon />} label={t('area')} placeholder={t('searchByArea')}
            value={area} onChange={setArea} options={options.areas} />
          <Picker variant="tile" icon={<TrainIcon />} label={t('line')} placeholder={t('searchByLine')}
            value={line} onChange={(v) => { setLine(v); setStation(''); }}
            options={options.lines.map((o) => ({ ...o, dots: o.color ? [o.color] : undefined }))}
            searchable searchPlaceholder={t('filterList')} noResults={t('noMatch')} />
          <Picker variant="tile" icon={<StationIcon />} label={t('station')} placeholder={t('searchByStation')}
            value={station} onChange={setStation} align="right"
            options={stationOptions.map((o) => ({ value: o.value, label: o.label, dots: o.lines.map((l) => lineColor[l]).filter(Boolean) }))}
            searchable searchPlaceholder={t('filterList')} noResults={t('noMatch')} />
        </div>

        {/* Price · Size · Bedrooms · Details */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Picker label={t('priceRange')} placeholder={t('priceRange')} value={price} onChange={setPrice}
            options={PRICE_RANGES.map((r, i) => ({ value: String(i), label: rangeLabel(r, money) }))} />
          <Picker label={t('sizeRange')} placeholder={t('sizeRange')} value={size} onChange={setSize}
            options={SIZE_RANGES.map((r, i) => ({ value: String(i), label: rangeLabel(r, (v) => `${v} m²`) }))} />
          <Picker label={t('bedrooms')} placeholder={t('bedrooms')} value={bedrooms} onChange={setBedrooms} align="right"
            options={BEDROOM_STEPS.map((v) => ({ value: String(v), label: t('bedroomsOption', { count: v }) }))} />
          <button type="button" onClick={() => setDetailsOpen(true)} aria-haspopup="dialog" aria-expanded={detailsOpen}
            className={`flex items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm ${detailCount ? 'border-ink font-semibold text-ink' : 'border-line text-ink-soft hover:border-ink/30'}`}>
            <span className="truncate">{t('details')}</span>
            <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${detailCount ? 'bg-accent text-white' : 'bg-paper text-ink-soft'}`}>
              {detailCount}
            </span>
          </button>
        </div>
        {detailsOpen && (
          <DetailsDialog layouts={layouts} conditions={conditions} onClose={closeDetails}
            onChange={(next) => { setLayouts(next.layouts); setConditions(next.conditions); }} />
        )}

        <div className="flex justify-center pt-1">
          <button type="submit" className="w-full max-w-sm rounded-full bg-accent px-6 py-3 font-bold text-white hover:bg-accent-dark">
            <SearchIcon className="mr-2 inline h-4 w-4 align-[-2px]" />{t('submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
