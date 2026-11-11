import { describe, expect, it } from 'vitest';
import type { SearchOptions } from '@/lib/data/search-options';
import { matchPlaces } from './places';

const OPTIONS: SearchOptions = {
  areas: [{ value: 'shinjuku', label: 'Shinjuku' }, { value: 'kita', label: 'Kita (Akabane)' }],
  lines: [{ value: 'yamanote', label: 'JR Yamanote Line' }],
  stations: [
    { value: 'shinjuku', label: 'Shinjuku', lines: ['yamanote'] },
    { value: 'shin-okubo', label: 'Shin-Okubo', lines: ['yamanote'] },
    { value: 'akabane', label: 'Akabane', lines: ['saikyo'] },
  ],
};

describe('matchPlaces', () => {
  it('returns nothing for an empty query', () => {
    expect(matchPlaces('  ', OPTIONS)).toEqual([]);
  });

  it('matches stations, areas and lines case-insensitively, prefix matches first', () => {
    expect(matchPlaces('shin', OPTIONS).map((m) => `${m.type}:${m.value}`))
      .toEqual(['station:shinjuku', 'station:shin-okubo', 'area:shinjuku']);
  });

  it('also matches inside a name', () => {
    expect(matchPlaces('akabane', OPTIONS).map((m) => `${m.type}:${m.value}`)).toEqual(['station:akabane', 'area:kita']);
    expect(matchPlaces('yamanote', OPTIONS).map((m) => m.type)).toEqual(['line']);
  });

  it('ignores hyphens and spaces so "shinokubo" finds Shin-Okubo', () => {
    expect(matchPlaces('shinokubo', OPTIONS).map((m) => m.value)).toEqual(['shin-okubo']);
  });

  it('respects the limit', () => {
    expect(matchPlaces('a', OPTIONS, 2)).toHaveLength(2);
  });
});
