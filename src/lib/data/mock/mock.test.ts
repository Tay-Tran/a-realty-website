import { describe, expect, it } from 'vitest';
import { AREAS } from './areas';
import { LISTINGS } from './listings';
import { INTERIORS } from './photos';
import { STATIONS } from './stations';

describe('mock listings', () => {
  it('has 24 listings with unique codes and slugs', () => {
    expect(LISTINGS).toHaveLength(24);
    expect(new Set(LISTINGS.map((l) => l.code)).size).toBe(24);
    expect(new Set(LISTINGS.map((l) => l.slug)).size).toBe(24);
  });
  it('has 20 available, 2 applied, 2 rented and 6 featured', () => {
    const count = (s: string) => LISTINGS.filter((l) => l.status === s).length;
    expect([count('available'), count('applied'), count('rented')]).toEqual([20, 2, 2]);
    expect(LISTINGS.filter((l) => l.featured)).toHaveLength(6);
  });
  it('references existing areas and stations; slug ends with the code', () => {
    const areas = new Set(AREAS.map((a) => a.slug));
    const stations = new Set(STATIONS.map((s) => s.slug));
    for (const l of LISTINGS) {
      expect(areas.has(l.areaSlug), l.code).toBe(true);
      expect(l.stations.length, l.code).toBeGreaterThan(0);
      for (const s of l.stations) expect(stations.has(s.stationSlug), `${l.code}→${s.stationSlug}`).toBe(true);
      expect(l.slug.endsWith(`-${l.code.toLowerCase()}`), l.code).toBe(true);
      expect(l.title.en && l.title.my && l.title.ja && l.description.my, l.code).toBeTruthy();
      expect(l.amenities.length, l.code).toBeGreaterThanOrEqual(4);
    }
  });
  it('gives each listing 5 distinct photos, starting with an interior', () => {
    for (const l of LISTINGS) {
      expect(l.images, l.code).toHaveLength(5);
      expect(new Set(l.images).size, l.code).toBe(5);
      expect(INTERIORS.includes(l.images[0]), l.code).toBe(true);
    }
  });
  it('keeps rents within 45,000–180,000 yen', () => {
    for (const l of LISTINGS) {
      expect(l.rent).toBeGreaterThanOrEqual(45000);
      expect(l.rent).toBeLessThanOrEqual(180000);
    }
  });
});
