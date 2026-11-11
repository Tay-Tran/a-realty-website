import { z } from 'zod';
import {
  CONDITION_KEYS, LAYOUTS, SORTS,
  type ConditionKey, type Layout, type Listing, type SortKey, type Station,
} from '@/lib/data/types';
import { bedroomsOf, buildingAge, hasCondition } from './derived';

export interface Filters {
  area?: string;
  line?: string;
  station?: string;
  maxWalk?: number;
  minRent?: number;
  maxRent?: number;
  minSize?: number;
  maxSize?: number;
  bedrooms?: number;
  maxAge?: number;
  layouts?: Layout[];
  conditions?: ConditionKey[];
  sort?: SortKey;
  page?: number;
}

export type SearchParamsInput = URLSearchParams | Record<string, string | string[] | undefined>;

const KEY_ORDER = [
  'area', 'line', 'station', 'maxWalk', 'minRent', 'maxRent', 'minSize', 'maxSize',
  'bedrooms', 'maxAge', 'layouts', 'conditions', 'sort', 'page',
] as const;

const slug = z.string().regex(/^[a-z0-9-]{1,40}$/).optional().catch(undefined);
const int = (min: number, max: number) => z.coerce.number().int().min(min).max(max).optional().catch(undefined);

const scalarSchema = z.object({
  area: slug,
  line: slug,
  station: slug,
  maxWalk: int(1, 60),
  minRent: int(0, 10_000_000),
  maxRent: int(0, 10_000_000),
  minSize: int(1, 500),
  maxSize: int(1, 500),
  bedrooms: int(1, 5),
  maxAge: int(0, 100),
  sort: z.enum(SORTS).optional().catch(undefined),
  page: int(1, 1000),
});

function readParam(input: SearchParamsInput, key: string): string | undefined {
  const raw = input instanceof URLSearchParams ? input.get(key) ?? undefined : input[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === undefined || value === '' ? undefined : value;
}

function readList<T extends string>(value: string | undefined, allowed: readonly T[]): T[] | undefined {
  if (!value) return undefined;
  const picked = [...new Set(value.split(','))].filter((v): v is T => (allowed as readonly string[]).includes(v));
  return picked.length ? picked : undefined;
}

export function parseFilters(input: SearchParamsInput): Filters {
  const scalars = scalarSchema.parse({
    area: readParam(input, 'area'),
    line: readParam(input, 'line'),
    station: readParam(input, 'station'),
    maxWalk: readParam(input, 'maxWalk'),
    minRent: readParam(input, 'minRent'),
    maxRent: readParam(input, 'maxRent'),
    minSize: readParam(input, 'minSize'),
    maxSize: readParam(input, 'maxSize'),
    bedrooms: readParam(input, 'bedrooms'),
    maxAge: readParam(input, 'maxAge'),
    sort: readParam(input, 'sort'),
    page: readParam(input, 'page'),
  });
  const filters: Filters = {
    ...scalars,
    layouts: readList(readParam(input, 'layouts'), LAYOUTS),
    conditions: readList(readParam(input, 'conditions'), CONDITION_KEYS),
  };
  if (filters.minRent !== undefined && filters.maxRent !== undefined && filters.minRent > filters.maxRent) {
    [filters.minRent, filters.maxRent] = [filters.maxRent, filters.minRent];
  }
  if (filters.minSize !== undefined && filters.maxSize !== undefined && filters.minSize > filters.maxSize) {
    [filters.minSize, filters.maxSize] = [filters.maxSize, filters.minSize];
  }
  return Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined)) as Filters;
}

export function serializeFilters(filters: Filters): string {
  const params = new URLSearchParams();
  for (const key of KEY_ORDER) {
    const value = filters[key];
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','));
    } else if (!(key === 'page' && value === 1)) {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

/** Turn one condition on or off while keeping every other filter (back to page 1). */
export function toggleCondition(filters: Filters, key: ConditionKey): Filters {
  const current = filters.conditions ?? [];
  const conditions = current.includes(key) ? current.filter((c) => c !== key) : [...current, key];
  const { page: _page, conditions: _old, ...rest } = filters;
  return conditions.length ? { ...rest, conditions } : rest;
}

const SORTERS: Record<SortKey, (a: Listing, b: Listing) => number> = {
  newest: (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.code.localeCompare(b.code),
  'price-asc': (a, b) => a.rent - b.rent || a.code.localeCompare(b.code),
  'price-desc': (a, b) => b.rent - a.rent || a.code.localeCompare(b.code),
};

export function filterListings(
  listings: Listing[],
  filters: Filters,
  ctx: { stations: Station[]; now?: Date },
): Listing[] {
  const now = ctx.now ?? new Date();
  const stationLines = new Map(ctx.stations.map((s) => [s.slug, s.lineSlugs]));
  const needsStation = filters.station !== undefined || filters.line !== undefined || filters.maxWalk !== undefined;

  const matches = (l: Listing): boolean => {
    if (filters.area && l.areaSlug !== filters.area) return false;
    if (needsStation) {
      const ok = l.stations.some((s) =>
        (!filters.station || s.stationSlug === filters.station) &&
        (!filters.line || (stationLines.get(s.stationSlug) ?? []).includes(filters.line)) &&
        (filters.maxWalk === undefined || s.walkMinutes <= filters.maxWalk));
      if (!ok) return false;
    }
    if (filters.minRent !== undefined && l.rent < filters.minRent) return false;
    if (filters.maxRent !== undefined && l.rent > filters.maxRent) return false;
    if (filters.minSize !== undefined && l.sizeM2 < filters.minSize) return false;
    if (filters.maxSize !== undefined && l.sizeM2 > filters.maxSize) return false;
    if (filters.bedrooms !== undefined && bedroomsOf(l.layout) < filters.bedrooms) return false;
    if (filters.maxAge !== undefined && buildingAge(l, now) > filters.maxAge) return false;
    if (filters.layouts?.length && !filters.layouts.includes(l.layout)) return false;
    if (filters.conditions?.some((c) => !hasCondition(l, c, now))) return false;
    return true;
  };

  return listings.filter(matches).sort(SORTERS[filters.sort ?? 'newest']);
}
