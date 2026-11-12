import { AMENITY_KEYS, type AmenityKey, type Listing, type ListingStatus, type StoredConditionKey } from '../types';
import { asLayout, findAreaSlug, findStation, toListing } from './shared';
import type { LeopalaceDetail, LeopalaceRoom, LeopalaceUrlParts } from './types';

export const LEOPALACE_API = 'https://www.leopalace21.com/api';

/**
 * Room page as Leopalace21 links it: …/chintai/tokyo/nakano-ku-13114/g-forest-numabukuro-24433/204.
 * The building number is the propertyNo without its last 3 digits (the room), as at least 5 digits ("01379").
 */
export function leopalaceUrl(d: LeopalaceUrlParts): string {
  const building = String(Number(d.propertyNo.slice(0, -3))).padStart(5, '0');
  return `https://www.leopalace21.com/en/properties/chintai/${d.prefectureNameParam}/${d.area.areaNameParam}-${d.area.areaCode}/${d.propertyNameParam}-${building}/${d.roomNo}`;
}

/** "Vacant" and "Scheduled to leave" are both open for applications; "Occupied" is not. */
export function leopalaceStatus(d: Pick<LeopalaceDetail, 'status' | 'isRecruitment'>): ListingStatus {
  return d.status === 'Occupied' || d.isRecruitment === false ? 'rented' : 'available';
}

const AMENITY_WORDS: [AmenityKey, RegExp][] = [
  ['aircon', /air ?conditioner/i],
  ['balcony', /balcony/i],
  ['deliveryBox', /delivery box/i],
  ['elevator', /elevator/i],
  ['bikeParking', /bicycle|bike/i],
  ['separateToilet', /separated bath and toilet/i],
  ['washlet', /washlet/i],
  ['internet', /internet/i],
  ['systemKitchen', /system kitchen/i],
  ['flooring', /flooring/i],
  ['storage', /storage|closet/i],
];

/** Interior photos first, then the building; floor plans, maps and shared areas are left out. */
const PHOTO_ORDER = ['Living room', 'Bedroom', 'Kitchen', 'Bathroom', 'Toilet', 'Sink', 'Storage', 'Entrance', 'Exterior'];
const MAX_PHOTOS = 8;

export function mapLeopalace(room: LeopalaceRoom, code: string, publishedAt: string, featured = false): Listing {
  const d = room.detail;
  const layout = asLayout(d.layout);
  if (!layout) throw new Error(`Leopalace ${d.propertyNo}: unsupported layout ${d.layout}`);
  const stations = d.routes
    .map((r, i) => ({ r, ja: d.routesJa?.[i] }))
    .filter(({ r }) => !r.busStationName)
    .map(({ r, ja }) => ({ station: findStation(r.stationName) ?? (ja ? findStation(ja.stationName) : undefined), walk: r.stationWalkingTime }))
    .filter((s): s is { station: NonNullable<typeof s.station>; walk: number } => s.station !== undefined);
  if (stations.length === 0) throw new Error(`Leopalace ${d.propertyNo}: no known station in ${d.routes.map((r) => r.stationName)}`);

  const points = d.point.join(' | ');
  const conditions: StoredConditionKey[] = [];
  if (d.furnitureFlg) conditions.push('furnished');
  if (/auto-?lock/i.test(points)) conditions.push('autoLock');
  const found = new Set(AMENITY_WORDS.filter(([, re]) => re.test(points)).map(([k]) => k));

  const photos = room.images
    .filter((img) => !img.isMadoriImage && img.title && PHOTO_ORDER.includes(img.title))
    .sort((a, b) => PHOTO_ORDER.indexOf(a.title!) - PHOTO_ORDER.indexOf(b.title!))
    .map((img) => img.imagePath);

  return toListing({
    code,
    source: { name: 'leopalace21', id: d.propertyNo, label: `${d.propertyNameJa} ${d.roomNo}`.normalize('NFKC'), url: leopalaceUrl(d) },
    status: leopalaceStatus(d),
    areaSlug: findAreaSlug(d.addressJa) ?? room.areaSlug,
    address: d.addressJa.normalize('NFKC'),
    stations,
    layout,
    size: d.size,
    floor: d.floor,
    builtYear: Math.floor(d.buildDay / 100),
    rent: d.rentFee,
    managementFee: d.maintenanceFee,
    initialCosts: {
      depositMonths: d.shikikin,
      keyMoneyMonths: d.reikin,
      brokerageMonths: 1.1,
      guaranteeFee: d.rentFee + d.maintenanceFee,
      insurance: 20000,
      keyExchange: d.keyExchangeFee,
      cleaning: d.basicCleaningFee,
    },
    conditions,
    amenities: AMENITY_KEYS.filter((k) => found.has(k)),
    images: [...new Set(photos)].slice(0, MAX_PHOTOS),
    floorPlan: room.images.find((img) => img.isMadoriImage)?.imagePath,
    featured,
    publishedAt,
  });
}
