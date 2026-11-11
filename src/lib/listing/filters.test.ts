import { describe, expect, it } from 'vitest';
import type { Station } from '@/lib/data/types';
import { makeListing } from '@/test/factories';
import { filterListings, parseFilters, serializeFilters, toggleCondition, type Filters } from './filters';

const NOW = new Date('2026-11-11T00:00:00Z');
const STATIONS: Station[] = [
  { slug: 'shin-okubo', name: { en: 'Shin-Okubo', my: 'Shin-Okubo', ja: '新大久保' }, lineSlugs: ['yamanote'], areaSlug: 'shinjuku' },
  { slug: 'takadanobaba', name: { en: 'Takadanobaba', my: 'Takadanobaba', ja: '高田馬場' }, lineSlugs: ['yamanote', 'tozai'], areaSlug: 'shinjuku' },
  { slug: 'nakano', name: { en: 'Nakano', my: 'Nakano', ja: '中野' }, lineSlugs: ['chuo-sobu', 'tozai'], areaSlug: 'nakano' },
];
const base = makeListing().conditions;
const costs = makeListing().initialCosts;

const A = makeListing({ code: 'A', rent: 60000, layout: '1R', publishedAt: '2026-10-01',
  stations: [{ stationSlug: 'shin-okubo', walkMinutes: 4 }], conditions: { ...base, studentOk: true } });
const B = makeListing({ code: 'B', rent: 90000, layout: '1K', publishedAt: '2026-10-05',
  stations: [{ stationSlug: 'takadanobaba', walkMinutes: 12 }], initialCosts: { ...costs, keyMoneyMonths: 0 } });
const C = makeListing({ code: 'C', rent: 120000, layout: '1LDK', publishedAt: '2026-10-03', areaSlug: 'nakano',
  builtYear: 2024, stations: [{ stationSlug: 'nakano', walkMinutes: 7 }], conditions: { ...base, petOk: true } });
const C2 = makeListing({ ...C, sizeM2: 38 });
const D = makeListing({ code: 'D', rent: 200000, layout: '2LDK', sizeM2: 55, publishedAt: '2026-09-01', areaSlug: 'kita',
  builtYear: 2025, stations: [{ stationSlug: 'nakano', walkMinutes: 15 }] });
const ALL = [A, B, C2, D];
const run = (f: Filters) => filterListings(ALL, f, { stations: STATIONS, now: NOW }).map((l) => l.code);

describe('parseFilters', () => {
  it('parses every supported field', () => {
    expect(parseFilters({
      area: 'shinjuku', line: 'yamanote', station: 'shin-okubo', maxWalk: '10',
      minRent: '50000', maxRent: '90000', layouts: '1K,1LDK', conditions: 'petOk,noKeyMoney',
      sort: 'price-asc', page: '2',
    })).toEqual({
      area: 'shinjuku', line: 'yamanote', station: 'shin-okubo', maxWalk: 10,
      minRent: 50000, maxRent: 90000, layouts: ['1K', '1LDK'], conditions: ['petOk', 'noKeyMoney'],
      sort: 'price-asc', page: 2,
    });
  });

  it('drops invalid values instead of throwing', () => {
    expect(parseFilters({
      area: 'Shin juku!', maxWalk: 'abc', layouts: '1K,9X,1K', conditions: 'petOk,bogus',
      sort: 'random', page: '-3', minRent: '',
    })).toEqual({ layouts: ['1K'], conditions: ['petOk'] });
  });

  it('accepts URLSearchParams and array values (first wins)', () => {
    expect(parseFilters(new URLSearchParams('area=nakano&maxRent=80000'))).toEqual({ area: 'nakano', maxRent: 80000 });
    expect(parseFilters({ area: ['kita', 'nakano'] })).toEqual({ area: 'kita' });
  });

  it('swaps minRent and maxRent when reversed', () => {
    expect(parseFilters({ minRent: '100000', maxRent: '50000' })).toEqual({ minRent: 50000, maxRent: 100000 });
  });
});

describe('serializeFilters', () => {
  it('uses a stable key order and omits empty values and page 1', () => {
    expect(serializeFilters({ sort: 'newest', layouts: ['1K', '1R'], area: 'shinjuku', page: 1, conditions: [] }))
      .toBe('area=shinjuku&layouts=1K%2C1R&sort=newest');
  });

  it('round-trips through parseFilters', () => {
    const f: Filters = { area: 'kita', station: 'akabane', maxWalk: 10, maxRent: 80000, minSize: 20, maxSize: 40, bedrooms: 2, maxAge: 10, layouts: ['1K'], conditions: ['studentOk', 'family'], sort: 'price-desc', page: 3 };
    expect(parseFilters(new URLSearchParams(serializeFilters(f)))).toEqual(f);
  });
});

describe('toggleCondition', () => {
  it('adds a condition and keeps the other filters, resetting the page', () => {
    expect(toggleCondition({ area: 'kita', maxRent: 80000, conditions: ['petOk'], page: 3 }, 'newlyBuilt'))
      .toEqual({ area: 'kita', maxRent: 80000, conditions: ['petOk', 'newlyBuilt'] });
  });
  it('removes an active condition and drops the empty list', () => {
    expect(toggleCondition({ area: 'kita', conditions: ['newlyBuilt'] }, 'newlyBuilt')).toEqual({ area: 'kita' });
  });
});

describe('filterListings', () => {
  it('defaults to newest first', () => expect(run({})).toEqual(['B', 'C', 'A', 'D']));
  it('sorts by price', () => {
    expect(run({ sort: 'price-asc' })).toEqual(['A', 'B', 'C', 'D']);
    expect(run({ sort: 'price-desc' })).toEqual(['D', 'C', 'B', 'A']);
  });
  it('filters by area', () => expect(run({ area: 'nakano' })).toEqual(['C']));
  it('filters by line through station data', () => expect(run({ line: 'tozai', sort: 'price-asc' })).toEqual(['B', 'C', 'D']));
  it('filters by station and walk time', () => {
    expect(run({ station: 'takadanobaba' })).toEqual(['B']);
    expect(run({ station: 'takadanobaba', maxWalk: 10 })).toEqual([]);
  });
  it('filters by walk time alone', () => expect(run({ maxWalk: 7, sort: 'price-asc' })).toEqual(['A', 'C']));
  it('filters by rent range (rent only)', () => expect(run({ minRent: 60000, maxRent: 90000, sort: 'price-asc' })).toEqual(['A', 'B']));
  it('filters by layouts', () => expect(run({ layouts: ['1R', '1LDK'], sort: 'price-asc' })).toEqual(['A', 'C']));
  it('filters by size range', () => {
    expect(run({ minSize: 21, sort: 'price-asc' })).toEqual(['C', 'D']);
    expect(run({ maxSize: 20, sort: 'price-asc' })).toEqual(['A', 'B']);
  });
  it('filters by minimum bedrooms and maximum building age', () => {
    expect(run({ bedrooms: 2 })).toEqual(['D']);
    expect(run({ maxAge: 5, sort: 'price-asc' })).toEqual(['C', 'D']);
  });
  it('filters by stored and derived conditions', () => {
    expect(run({ conditions: ['studentOk'] })).toEqual(['A']);
    expect(run({ conditions: ['noKeyMoney'] })).toEqual(['B']);
    expect(run({ conditions: ['newlyBuilt', 'petOk'] })).toEqual(['C']);
  });
});
