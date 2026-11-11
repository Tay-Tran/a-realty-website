import { describe, expect, it } from 'vitest';
import { AREAS } from './areas';
import { LINES } from './lines';
import { STATIONS } from './stations';

describe('reference data', () => {
  it('has 8 areas, 10 lines, 25 stations with unique slugs', () => {
    expect(AREAS).toHaveLength(8);
    expect(LINES).toHaveLength(10);
    expect(STATIONS).toHaveLength(25);
    for (const list of [AREAS, LINES, STATIONS]) {
      expect(new Set(list.map((x) => x.slug)).size).toBe(list.length);
    }
  });

  it('every station points to existing lines and an existing area', () => {
    const lineSlugs = new Set(LINES.map((l) => l.slug));
    const areaSlugs = new Set(AREAS.map((a) => a.slug));
    for (const s of STATIONS) {
      expect(areaSlugs.has(s.areaSlug), s.slug).toBe(true);
      expect(s.lineSlugs.length, s.slug).toBeGreaterThan(0);
      for (const l of s.lineSlugs) expect(lineSlugs.has(l), `${s.slug}→${l}`).toBe(true);
    }
  });

  it('every name has en, my and ja text', () => {
    for (const x of [...AREAS, ...LINES, ...STATIONS]) {
      expect(x.name.en && x.name.my && x.name.ja, x.slug).toBeTruthy();
    }
  });
});
