import { pickText } from '@/lib/listing/format';
import { getAreas, getLines, getStations } from './index';
import type { Locale } from './types';

export type SearchOption = { value: string; label: string; color?: string };
export type StationOption = SearchOption & { lines: string[] };
export interface SearchOptions { areas: SearchOption[]; lines: SearchOption[]; stations: StationOption[] }

export async function buildSearchOptions(locale: Locale): Promise<SearchOptions> {
  const [areas, lines, stations] = await Promise.all([getAreas(), getLines(), getStations()]);
  return {
    areas: areas.map((a) => ({ value: a.slug, label: pickText(a.name, locale) })),
    lines: lines.map((l) => ({ value: l.slug, label: pickText(l.name, locale), color: l.color })),
    stations: stations
      .map((s) => ({ value: s.slug, label: pickText(s.name, locale), lines: s.lineSlugs }))
      .sort((a, b) => a.label.localeCompare(b.label, locale)),
  };
}
