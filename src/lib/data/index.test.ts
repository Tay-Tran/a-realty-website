import { describe, expect, it } from 'vitest';
import {
  PAGE_SIZE, countListingsByArea, getFeaturedListings, getListing, getListingRefs,
  getListings, getListingsByCodes, getSimilarListings, getStations,
} from './index';

describe('data access layer', () => {
  it('getListings excludes rented and paginates', async () => {
    const page1 = await getListings({});
    expect(page1.total).toBe(22);
    expect(page1.pageCount).toBe(2);
    expect(page1.items).toHaveLength(PAGE_SIZE);
    expect(page1.items.every((l) => l.status !== 'rented')).toBe(true);
    const last = await getListings({ page: 99 });
    expect(last.page).toBe(2);
    expect(last.items).toHaveLength(10);
  });

  it('getListing is case-insensitive and returns rented listings', async () => {
    expect((await getListing('a1009'))?.status).toBe('rented');
    expect(await getListing('NOPE')).toBeNull();
  });

  it('getSimilarListings excludes itself and rented, max 4, same area or station first', async () => {
    const a1001 = (await getListing('A1001'))!;
    const similar = await getSimilarListings(a1001);
    expect(similar.length).toBeGreaterThan(0);
    expect(similar.length).toBeLessThanOrEqual(4);
    expect(similar.some((l) => l.code === 'A1001' || l.status === 'rented')).toBe(false);
    expect(similar[0].areaSlug).toBe('shinjuku');
  });

  it('getFeaturedListings returns 6 non-rented listings', async () => {
    const featured = await getFeaturedListings(6);
    expect(featured).toHaveLength(6);
    expect(featured.every((l) => l.featured && l.status !== 'rented')).toBe(true);
  });

  it('countListingsByArea ignores rented', async () => {
    const counts = await countListingsByArea();
    expect(counts.shinjuku).toBe(5);
    expect(counts.shibuya).toBe(1);
    expect(counts.kita).toBe(3);
  });

  it('getListingsByCodes keeps the requested order and skips unknown codes', async () => {
    const list = await getListingsByCodes(['A1003', 'NOPE', 'a1001']);
    expect(list.map((l) => l.code)).toEqual(['A1003', 'A1001']);
  });

  it('getStations filters by line; getListingRefs covers all 24', async () => {
    expect((await getStations('tozai')).map((s) => s.slug).sort()).toEqual(['nakano', 'takadanobaba']);
    expect(await getListingRefs()).toHaveLength(24);
  });
});
