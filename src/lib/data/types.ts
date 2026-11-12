export const LOCALES = ['en', 'my', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];
export type LocalizedText = Record<Locale, string>;

export const PREFECTURES = ['tokyo', 'kanagawa', 'chiba', 'saitama'] as const;
export type Prefecture = (typeof PREFECTURES)[number];

export interface Area { slug: string; name: LocalizedText; prefecture: Prefecture }
export interface Line { slug: string; name: LocalizedText; color: string }
export interface Station { slug: string; name: LocalizedText; lineSlugs: string[]; areaSlug: string }

export const LAYOUTS = ['1R', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK'] as const;
export type Layout = (typeof LAYOUTS)[number];

export const LISTING_STATUSES = ['available', 'applied', 'rented'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const STORED_CONDITION_KEYS = [
  'foreignerOk', 'noGuarantor', 'studentOk', 'petOk', 'furnished', 'overseasApplication', 'autoLock', 'shortTermOk',
] as const;
export type StoredConditionKey = (typeof STORED_CONDITION_KEYS)[number];

/** Stored flags plus values derived from other fields. */
export const CONDITION_KEYS = [...STORED_CONDITION_KEYS, 'noKeyMoney', 'newlyBuilt', 'family', 'luxury'] as const;
export type ConditionKey = (typeof CONDITION_KEYS)[number];

export const AMENITY_KEYS = [
  'aircon', 'balcony', 'deliveryBox', 'elevator', 'bikeParking', 'separateToilet',
  'washlet', 'internet', 'systemKitchen', 'flooring', 'storage',
] as const;
export type AmenityKey = (typeof AMENITY_KEYS)[number];

export const SORTS = ['newest', 'price-asc', 'price-desc'] as const;
export type SortKey = (typeof SORTS)[number];

export interface InitialCosts {
  depositMonths: number;   // 敷金
  keyMoneyMonths: number;  // 礼金
  brokerageMonths: number; // 仲介手数料
  guaranteeFee: number;    // yen
  insurance: number;       // yen
  keyExchange: number;     // yen
  cleaning: number;        // yen
}

export interface Listing {
  code: string;
  slug: string;
  status: ListingStatus;
  title: LocalizedText;
  description: LocalizedText;
  areaSlug: string;
  address: string;
  stations: { stationSlug: string; walkMinutes: number }[];
  layout: Layout;
  sizeM2: number;
  floor: number;
  builtYear: number;
  rent: number;
  managementFee: number;
  initialCosts: InitialCosts;
  conditions: Record<StoredConditionKey, boolean>;
  amenities: AmenityKey[];
  images: string[];
  /** Real floor-plan image; when missing the site draws a schematic from the layout. */
  floorPlan?: string;
  featured: boolean;
  publishedAt: string;
  /** Set when the room was pulled from an outside listing site (see lib/data/sources). */
  source?: ListingSource;
}

export const SOURCE_NAMES = ['leopalace21', 'jk'] as const;
export type SourceName = (typeof SOURCE_NAMES)[number];

export interface ListingSource {
  name: SourceName;
  /** The room's id on the source site. */
  id: string;
  /** Building name and room number as the source shows them. */
  label: string;
  url: string;
}

export interface ListingPage { items: Listing[]; total: number; page: number; pageCount: number }
