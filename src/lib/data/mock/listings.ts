import {
  AMENITY_KEYS, STORED_CONDITION_KEYS,
  type AmenityKey, type Layout, type Listing, type ListingStatus, type StoredConditionKey,
} from '../types';
import { photosFor } from './photos';
import { STATIONS } from './stations';
import { buildDescription, buildTitle } from './text';

interface Input {
  code: string;
  area: string;
  address: string;
  stations: [string, number][];
  layout: Layout;
  size: number;
  floor: number;
  built: number;
  rent: number;
  fee: number;
  deposit?: number;
  keyMoney?: number;
  cleaning?: number;
  conditions?: StoredConditionKey[];
  status?: ListingStatus;
  featured?: boolean;
  published: string;
}

/** Plausible amenities from building age, floor and size – mock data only. */
function amenitiesFor(input: Input, index: number): AmenityKey[] {
  const list: AmenityKey[] = ['aircon', 'flooring', 'separateToilet', 'internet'];
  if (input.built >= 2015) list.push('washlet', 'deliveryBox', 'systemKitchen');
  if (input.floor >= 4) list.push('elevator');
  if (input.size >= 30) list.push('storage', 'balcony');
  if (index % 2 === 0) list.push('bikeParking');
  return AMENITY_KEYS.filter((k) => list.includes(k));
}

function make(input: Input, index: number): Listing {
  const [firstSlug, firstWalk] = input.stations[0];
  const station = STATIONS.find((s) => s.slug === firstSlug);
  if (!station) throw new Error(`Unknown station ${firstSlug} in ${input.code}`);
  const flags = new Set<StoredConditionKey>(['foreignerOk', ...(input.conditions ?? [])]);
  const conditions = Object.fromEntries(STORED_CONDITION_KEYS.map((k) => [k, flags.has(k)])) as Listing['conditions'];
  const activeFlags = STORED_CONDITION_KEYS.filter((k) => flags.has(k));
  return {
    code: input.code,
    slug: `${input.layout.toLowerCase()}-${firstSlug}-${input.code.toLowerCase()}`,
    status: input.status ?? 'available',
    title: buildTitle(input.layout, station, firstWalk),
    description: buildDescription({
      layout: input.layout, size: input.size, floor: input.floor, built: input.built,
      station, walk: firstWalk, conditions: activeFlags,
    }),
    areaSlug: input.area,
    address: input.address,
    stations: input.stations.map(([stationSlug, walkMinutes]) => ({ stationSlug, walkMinutes })),
    layout: input.layout,
    sizeM2: input.size,
    floor: input.floor,
    builtYear: input.built,
    rent: input.rent,
    managementFee: input.fee,
    initialCosts: {
      depositMonths: input.deposit ?? 1,
      keyMoneyMonths: input.keyMoney ?? 1,
      brokerageMonths: 1.1,
      guaranteeFee: Math.round(input.rent * 0.5),
      insurance: 18000,
      keyExchange: 16500,
      cleaning: input.cleaning ?? 33000,
    },
    conditions,
    amenities: amenitiesFor(input, index),
    images: photosFor(index),
    featured: input.featured ?? false,
    publishedAt: input.published,
  };
}

const INPUTS: Input[] = [
  { code: 'A1001', area: 'shinjuku', address: '東京都新宿区百人町1丁目', stations: [['shin-okubo', 4], ['okubo', 7]], layout: '1K', size: 22.5, floor: 3, built: 2019, rent: 78000, fee: 5000, keyMoney: 0, conditions: ['noGuarantor', 'studentOk', 'overseasApplication'], featured: true, published: '2026-11-08' },
  { code: 'A1002', area: 'shinjuku', address: '東京都新宿区高田馬場3丁目', stations: [['takadanobaba', 6]], layout: '1R', size: 18.2, floor: 2, built: 2008, rent: 62000, fee: 3000, deposit: 0, keyMoney: 0, conditions: ['studentOk'], published: '2026-10-21' },
  { code: 'A1003', area: 'shinjuku', address: '東京都新宿区新宿7丁目', stations: [['higashi-shinjuku', 5], ['shinjuku', 12]], layout: '1LDK', size: 38.4, floor: 7, built: 2023, rent: 168000, fee: 12000, conditions: ['autoLock', 'petOk', 'furnished', 'shortTermOk'], featured: true, published: '2026-11-05' },
  { code: 'A1004', area: 'shinjuku', address: '東京都新宿区中井2丁目', stations: [['nakai', 3], ['shimo-ochiai', 9]], layout: '1K', size: 21, floor: 1, built: 2015, rent: 69000, fee: 4000, conditions: ['studentOk', 'noGuarantor'], published: '2026-10-12' },
  { code: 'A1005', area: 'shinjuku', address: '東京都新宿区西新宿4丁目', stations: [['shinjuku', 10]], layout: '1DK', size: 30, floor: 4, built: 2012, rent: 125000, fee: 8000, conditions: ['autoLock'], status: 'applied', published: '2026-10-30' },
  { code: 'A1006', area: 'toshima', address: '東京都豊島区東池袋2丁目', stations: [['ikebukuro', 8], ['mejiro', 10]], layout: '1K', size: 24, floor: 6, built: 2021, rent: 92000, fee: 6000, conditions: ['autoLock', 'noGuarantor', 'overseasApplication', 'furnished', 'shortTermOk'], featured: true, published: '2026-11-07' },
  { code: 'A1007', area: 'toshima', address: '東京都豊島区南大塚3丁目', stations: [['otsuka', 5]], layout: '1R', size: 16.5, floor: 2, built: 1998, rent: 52000, fee: 3000, deposit: 0, keyMoney: 0, cleaning: 25000, conditions: ['studentOk', 'noGuarantor'], published: '2026-10-08' },
  { code: 'A1008', area: 'toshima', address: '東京都豊島区目白3丁目', stations: [['mejiro', 7], ['takadanobaba', 11]], layout: '2DK', size: 40, floor: 3, built: 2005, rent: 135000, fee: 7000, conditions: ['petOk'], published: '2026-10-15' },
  { code: 'A1009', area: 'shibuya', address: '東京都渋谷区恵比寿南2丁目', stations: [['ebisu', 9]], layout: '1K', size: 23, floor: 4, built: 2020, rent: 128000, fee: 8000, conditions: ['autoLock', 'furnished', 'shortTermOk'], status: 'rented', published: '2026-09-28' },
  { code: 'A1010', area: 'shibuya', address: '東京都渋谷区渋谷3丁目', stations: [['shibuya', 12]], layout: '1LDK', size: 35, floor: 9, built: 2024, rent: 178000, fee: 12000, conditions: ['autoLock', 'overseasApplication'], featured: true, published: '2026-11-03' },
  { code: 'A1011', area: 'nakano', address: '東京都中野区中野5丁目', stations: [['nakano', 6]], layout: '1K', size: 20.5, floor: 2, built: 2016, rent: 76000, fee: 4000, conditions: ['studentOk', 'noGuarantor'], published: '2026-10-25' },
  { code: 'A1012', area: 'nakano', address: '東京都中野区東中野4丁目', stations: [['higashi-nakano', 4]], layout: '2K', size: 32, floor: 1, built: 2001, rent: 88000, fee: 3000, keyMoney: 0, conditions: ['petOk'], published: '2026-10-18' },
  { code: 'A1013', area: 'nakano', address: '東京都中野区中野2丁目', stations: [['nakano', 11]], layout: '1DK', size: 28, floor: 3, built: 2010, rent: 98000, fee: 5000, conditions: ['furnished', 'overseasApplication', 'shortTermOk'], published: '2026-10-10' },
  { code: 'A1014', area: 'bunkyo', address: '東京都文京区小日向4丁目', stations: [['myogadani', 5]], layout: '1K', size: 22, floor: 5, built: 2018, rent: 95000, fee: 6000, conditions: ['studentOk', 'autoLock'], published: '2026-10-27' },
  { code: 'A1015', area: 'bunkyo', address: '東京都文京区春日1丁目', stations: [['kasuga', 3], ['korakuen', 5]], layout: '1LDK', size: 41, floor: 8, built: 2022, rent: 175000, fee: 10000, conditions: ['autoLock'], status: 'applied', published: '2026-11-01' },
  { code: 'A1016', area: 'bunkyo', address: '東京都文京区本郷4丁目', stations: [['korakuen', 9]], layout: '1R', size: 17.8, floor: 3, built: 2003, rent: 64000, fee: 4000, keyMoney: 0, conditions: ['studentOk', 'noGuarantor'], published: '2026-10-05' },
  { code: 'A1017', area: 'taito', address: '東京都台東区東上野3丁目', stations: [['ueno', 7], ['okachimachi', 6]], layout: '1K', size: 21.5, floor: 4, built: 2014, rent: 82000, fee: 5000, conditions: ['noGuarantor', 'overseasApplication', 'furnished', 'shortTermOk'], featured: true, published: '2026-11-06' },
  { code: 'A1018', area: 'taito', address: '東京都台東区台東4丁目', stations: [['ueno-okachimachi', 4]], layout: '2DK', size: 42, floor: 6, built: 2009, rent: 128000, fee: 8000, conditions: ['petOk', 'studentOk'], published: '2026-10-20' },
  { code: 'A1019', area: 'sumida', address: '東京都墨田区江東橋3丁目', stations: [['kinshicho', 5]], layout: '1K', size: 23.4, floor: 7, built: 2023, rent: 89000, fee: 6000, keyMoney: 0, conditions: ['autoLock', 'noGuarantor', 'studentOk'], published: '2026-11-02' },
  { code: 'A1020', area: 'sumida', address: '東京都墨田区両国2丁目', stations: [['ryogoku', 8]], layout: '1LDK', size: 36, floor: 2, built: 2011, rent: 118000, fee: 7000, conditions: ['petOk'], status: 'rented', published: '2026-09-30' },
  { code: 'A1021', area: 'kita', address: '東京都北区赤羽1丁目', stations: [['akabane', 6], ['jujo', 12]], layout: '1K', size: 22, floor: 3, built: 2017, rent: 68000, fee: 4000, keyMoney: 0, conditions: ['studentOk', 'noGuarantor', 'overseasApplication'], featured: true, published: '2026-11-04' },
  { code: 'A1022', area: 'kita', address: '東京都北区王子1丁目', stations: [['oji', 4]], layout: '2LDK', size: 55, floor: 5, built: 2013, rent: 165000, fee: 9000, conditions: ['petOk', 'autoLock'], published: '2026-10-22' },
  { code: 'A1023', area: 'kita', address: '東京都北区上十条2丁目', stations: [['jujo', 8]], layout: '1R', size: 15, floor: 2, built: 1995, rent: 45000, fee: 2000, deposit: 0, keyMoney: 0, conditions: ['studentOk', 'noGuarantor'], published: '2026-10-02' },
  { code: 'A1024', area: 'toshima', address: '東京都豊島区池袋3丁目', stations: [['ikebukuro', 12]], layout: '3LDK', size: 65, floor: 4, built: 2006, rent: 180000, fee: 10000, conditions: ['petOk'], published: '2026-10-14' },
];

export const LISTINGS: Listing[] = INPUTS.map(make);
