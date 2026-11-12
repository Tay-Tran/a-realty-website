import { AREAS } from '../mock/areas';
import { STATIONS } from '../mock/stations';
import { buildDescription, buildTitle } from '../mock/text';
import {
  LAYOUTS, STORED_CONDITION_KEYS,
  type AmenityKey, type InitialCosts, type Layout, type Listing, type ListingSource, type ListingStatus,
  type Station, type StoredConditionKey,
} from '../types';

const norm = (s: string) => s.normalize('NFKC').toLowerCase().replace(/駅$/, '').replace(/[\s・\-]/g, '');

/** Names a source uses that differ from the station's official name. */
const ALIASES: Record<string, string> = { [norm('県立大学前')]: 'kenritsudaigaku' };

/** Finds a demo station by its English or Japanese name ("Nishi-sugamo", "大塚帝京大学駅"). */
export function findStation(name: string): Station | undefined {
  const key = norm(name);
  const alias = ALIASES[key];
  return STATIONS.find((s) => s.slug === alias || norm(s.name.en) === key || norm(s.name.ja) === key);
}

/** Finds the demo area whose Japanese name (区/市) appears in a Japanese address. */
export function findAreaSlug(addressJa: string): string | undefined {
  return AREAS.find((a) => addressJa.includes(a.name.ja))?.slug;
}

export function asLayout(value: string): Layout | undefined {
  const v = value.normalize('NFKC').toUpperCase();
  return (LAYOUTS as readonly string[]).includes(v) ? (v as Layout) : undefined;
}

export interface SourceInput {
  code: string;
  source: ListingSource;
  status: ListingStatus;
  areaSlug: string;
  address: string;
  stations: { station: Station; walk: number }[];
  layout: Layout;
  size: number;
  floor: number;
  builtYear: number;
  rent: number;
  managementFee: number;
  initialCosts: InitialCosts;
  conditions: StoredConditionKey[];
  amenities: AmenityKey[];
  images: string[];
  floorPlan?: string;
  featured: boolean;
  publishedAt: string;
}

/** Builds a demo listing; titles and descriptions come from the same templates as the mock rooms. */
export function toListing(i: SourceInput): Listing {
  const first = i.stations[0];
  const flags = new Set(i.conditions);
  return {
    code: i.code,
    slug: `${i.layout.toLowerCase()}-${first.station.slug}-${i.code.toLowerCase()}`,
    status: i.status,
    title: buildTitle(i.layout, first.station, first.walk),
    description: buildDescription({
      layout: i.layout, size: i.size, floor: i.floor, built: i.builtYear,
      station: first.station, walk: first.walk, conditions: STORED_CONDITION_KEYS.filter((k) => flags.has(k)),
    }),
    areaSlug: i.areaSlug,
    address: i.address,
    stations: i.stations.map(({ station, walk }) => ({ stationSlug: station.slug, walkMinutes: walk })),
    layout: i.layout,
    sizeM2: i.size,
    floor: i.floor,
    builtYear: i.builtYear,
    rent: i.rent,
    managementFee: i.managementFee,
    initialCosts: i.initialCosts,
    conditions: Object.fromEntries(STORED_CONDITION_KEYS.map((k) => [k, flags.has(k)])) as Listing['conditions'],
    amenities: i.amenities,
    images: i.images,
    ...(i.floorPlan ? { floorPlan: i.floorPlan } : {}),
    featured: i.featured,
    publishedAt: i.publishedAt,
    source: i.source,
  };
}
