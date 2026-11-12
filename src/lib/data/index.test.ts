import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PAGE_SIZE, countListingsByArea, getFeaturedListings, getListing, getListingRefs,
  getListings, getListingsByCodes, getSimilarListings, getStations,
} from './index';
import { checkJk, checkLeopalace } from './sources/live';

// Never call the real sites in tests: by default the sources "cannot be reached", so snapshot statuses apply.
vi.mock('./sources/live', () => ({ checkLeopalace: vi.fn(async () => null), checkJk: vi.fn(async () => null) }));
afterEach(() => { vi.mocked(checkLeopalace).mockImplementation(async () => null); vi.mocked(checkJk).mockImplementation(async () => null); });

describe('data access layer', () => {
  it('getListings excludes rented and paginates', async () => {
    const page1 = await getListings({});
    expect(page1.total).toBe(72);
    expect(page1.pageCount).toBe(6);
    expect(page1.items).toHaveLength(PAGE_SIZE);
    expect(page1.items.every((l) => l.status !== 'rented')).toBe(true);
    const last = await getListings({ page: 99 });
    expect(last.page).toBe(6);
    expect(last.items).toHaveLength(12);
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
    expect(counts.shinjuku).toBe(8);
    expect(counts.shibuya).toBe(3);
    expect(counts.kita).toBe(6);
    expect(counts.hachioji).toBe(9);
    expect(counts.yokohama).toBe(3);
  });

  it('getListingsByCodes keeps the requested order and skips unknown codes', async () => {
    const list = await getListingsByCodes(['A1003', 'NOPE', 'a1001']);
    expect(list.map((l) => l.code)).toEqual(['A1003', 'A1001']);
  });

  it('getStations filters by line; getListingRefs covers all 74', async () => {
    expect((await getStations('tozai')).map((s) => s.slug).sort()).toEqual(['nakano', 'takadanobaba']);
    expect(await getListingRefs()).toHaveLength(74);
  });

  it('applies the live status from the source: a room the source reports rented leaves the list', async () => {
    vi.mocked(checkLeopalace).mockImplementation(async (no) =>
      no === '0000024433204' ? { status: 'rented', checkedAt: '2026-11-12T05:00:00.000Z' } : null);
    const page = await getListings({});
    expect(page.total).toBe(71);
    expect((await getListing('L5001'))?.status).toBe('rented');
    expect((await getFeaturedListings(6)).some((l) => l.code === 'L5001')).toBe(false);
  });

  it('puts the source rooms first among featured listings', async () => {
    expect((await getFeaturedListings(6)).slice(0, 2).map((l) => l.code)).toEqual(['L5001', 'J6001']);
  });
});
