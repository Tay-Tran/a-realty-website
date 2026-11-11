import type { Listing } from '@/lib/data/types';

export function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    code: 'T0001',
    slug: '1k-shin-okubo-t0001',
    status: 'available',
    title: { en: 'Test', my: 'Test', ja: 'テスト' },
    description: { en: 'Desc', my: 'Desc', ja: '説明' },
    areaSlug: 'shinjuku',
    address: '東京都新宿区百人町1丁目',
    stations: [{ stationSlug: 'shin-okubo', walkMinutes: 5 }],
    layout: '1K',
    sizeM2: 20,
    floor: 2,
    builtYear: 2015,
    rent: 80000,
    managementFee: 5000,
    initialCosts: {
      depositMonths: 1, keyMoneyMonths: 1, brokerageMonths: 1.1,
      guaranteeFee: 40000, insurance: 18000, keyExchange: 16500, cleaning: 33000,
    },
    conditions: {
      foreignerOk: true, noGuarantor: false, studentOk: false, petOk: false,
      furnished: false, overseasApplication: false, autoLock: false,
    },
    amenities: [],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
    featured: false,
    publishedAt: '2026-10-01',
    ...overrides,
  };
}
