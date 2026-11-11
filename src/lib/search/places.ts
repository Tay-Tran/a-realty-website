import type { SearchOptions } from '@/lib/data/search-options';

export type PlaceType = 'station' | 'area' | 'line';
export interface PlaceMatch { type: PlaceType; value: string; label: string }

const TYPE_ORDER: Record<PlaceType, number> = { station: 0, area: 1, line: 2 };

/** Lower-case and drop spaces, hyphens and brackets: "Shin-Okubo" → "shinokubo". */
const normalize = (s: string) => s.toLowerCase().replace(/[\s\-‐ー・()（）]/g, '');

/** Filter a picker list by a typed query (substring, normalized). */
export function filterByLabel<T extends { label: string }>(items: T[], query: string): T[] {
  const q = normalize(query);
  return q ? items.filter((i) => normalize(i.label).includes(q)) : items;
}

/** Quick-search matcher: prefix matches before substring matches, stations before areas before lines. */
export function matchPlaces(query: string, options: SearchOptions, limit = 6): PlaceMatch[] {
  const q = normalize(query);
  if (!q) return [];
  const candidates: PlaceMatch[] = [
    ...options.stations.map((o) => ({ type: 'station' as const, value: o.value, label: o.label })),
    ...options.areas.map((o) => ({ type: 'area' as const, value: o.value, label: o.label })),
    ...options.lines.map((o) => ({ type: 'line' as const, value: o.value, label: o.label })),
  ];
  return candidates
    .map((c, i) => {
      const name = normalize(c.label);
      const rank = name.startsWith(q) ? 0 : name.includes(q) ? 1 : -1;
      return { c, i, rank };
    })
    .filter((x) => x.rank >= 0)
    .sort((a, b) => a.rank - b.rank || TYPE_ORDER[a.c.type] - TYPE_ORDER[b.c.type] || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.c);
}
