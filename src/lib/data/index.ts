import { filterListings, type Filters } from '@/lib/listing/filters';
import { AREAS } from './mock/areas';
import { LINES } from './mock/lines';
import { LISTINGS } from './mock/listings';
import { STATIONS } from './mock/stations';
import { SOURCE_LISTINGS, getSourceListings } from './sources';
import type { Area, Line, Listing, ListingPage, Station } from './types';

// Data-access layer. Pages import only from here; in week 2 these bodies switch to Payload.

export const PAGE_SIZE = 12;

const isOpen = (l: Listing) => l.status !== 'rented';

/** Rooms pulled from outside sites (with live status) come first, then the mock rooms. */
async function allListings(): Promise<Listing[]> {
  return [...(await getSourceListings()), ...LISTINGS];
}

export async function getListings(filters: Filters, now: Date = new Date()): Promise<ListingPage> {
  const matched = filterListings((await allListings()).filter(isOpen), filters, { stations: STATIONS, now });
  const total = matched.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(filters.page ?? 1, 1), pageCount);
  return { items: matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total, page, pageCount };
}

export async function getListing(code: string): Promise<Listing | null> {
  return (await allListings()).find((l) => l.code === code.toUpperCase()) ?? null;
}

export async function getListingsByCodes(codes: string[]): Promise<Listing[]> {
  const all = await allListings();
  return codes
    .map((code) => all.find((l) => l.code === code.toUpperCase()))
    .filter((l): l is Listing => l !== undefined);
}

export async function getSimilarListings(listing: Listing, limit = 4): Promise<Listing[]> {
  const stationSet = new Set(listing.stations.map((s) => s.stationSlug));
  const score = (l: Listing) =>
    (l.areaSlug === listing.areaSlug ? 2 : 0) +
    (l.stations.some((s) => stationSet.has(s.stationSlug)) ? 3 : 0) +
    (Math.abs(l.rent - listing.rent) <= listing.rent * 0.2 ? 1 : 0);
  return (await allListings())
    .filter((l) => isOpen(l) && l.code !== listing.code)
    .map((l) => ({ l, s: score(l) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || Math.abs(a.l.rent - listing.rent) - Math.abs(b.l.rent - listing.rent))
    .slice(0, limit)
    .map(({ l }) => l);
}

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
  return (await allListings()).filter((l) => l.featured && isOpen(l)).slice(0, limit);
}

export async function getAreas(): Promise<Area[]> {
  return AREAS;
}

export async function getLines(): Promise<Line[]> {
  return LINES;
}

export async function getStations(lineSlug?: string): Promise<Station[]> {
  return lineSlug ? STATIONS.filter((s) => s.lineSlugs.includes(lineSlug)) : STATIONS;
}

export async function countListingsByArea(): Promise<Record<string, number>> {
  const counts: Record<string, number> = Object.fromEntries(AREAS.map((a) => [a.slug, 0]));
  for (const l of await allListings()) if (isOpen(l)) counts[l.areaSlug] = (counts[l.areaSlug] ?? 0) + 1;
  return counts;
}

export async function getListingRefs(): Promise<{ code: string; areaSlug: string; slug: string }[]> {
  return [...SOURCE_LISTINGS, ...LISTINGS].map(({ code, areaSlug, slug }) => ({ code, areaSlug, slug }));
}
