import { describe, expect, it } from 'vitest';
import { AREAS } from '../mock/areas';
import { STATIONS } from '../mock/stations';
import { SOURCE_LISTINGS } from './index';
import { jkRoomUrl, jkStatus, parseBuiltYear, parseDepositKey, parseWalk } from './jk';
import { leopalaceStatus, leopalaceUrl } from './leopalace';
import { checkJk, checkLeopalace } from './live';
import { findStation } from './shared';

const DATE = 'Thu, 12 Nov 2026 05:00:00 GMT';
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', date: DATE } });

describe('source listings from snapshot.json', () => {
  it('maps 25 Leopalace21 and 25 J&K rooms with demo codes', () => {
    const codes = (prefix: string, start: number) => Array.from({ length: 25 }, (_, i) => `${prefix}${start + i}`);
    expect(SOURCE_LISTINGS.map((l) => l.code)).toEqual([...codes('L', 5001), ...codes('J', 6001)]);
    expect(SOURCE_LISTINGS.filter((l) => l.source?.name === 'leopalace21')).toHaveLength(25);
    expect(SOURCE_LISTINGS.filter((l) => l.source?.name === 'jk')).toHaveLength(25);
  });

  it('keeps one room per building for each source', () => {
    const buildings = (name: string) => SOURCE_LISTINGS.filter((l) => l.source?.name === name).map((l) => l.source!.label.replace(/ \S+$/, ''));
    for (const name of ['leopalace21', 'jk']) expect(new Set(buildings(name)).size, name).toBe(25);
  });

  it('points to existing areas and stations, with photos, a source link and text in every language', () => {
    const areas = new Set(AREAS.map((a) => a.slug));
    const stations = new Set(STATIONS.map((s) => s.slug));
    for (const l of SOURCE_LISTINGS) {
      expect(areas.has(l.areaSlug), l.code).toBe(true);
      for (const s of l.stations) expect(stations.has(s.stationSlug), `${l.code}→${s.stationSlug}`).toBe(true);
      expect(l.images.length, l.code).toBeGreaterThan(0);
      expect(l.floorPlan, l.code).toMatch(/^https:\/\//);
      expect(l.source!.url, l.code).toMatch(/^https:\/\//);
      expect(l.title.en && l.title.my && l.title.ja && l.description.ja, l.code).toBeTruthy();
      expect(l.slug.endsWith(`-${l.code.toLowerCase()}`), l.code).toBe(true);
      expect(l.rent, l.code).toBeGreaterThan(0);
    }
  });

  it('features the first room of each source', () => {
    expect(SOURCE_LISTINGS.filter((l) => l.featured).map((l) => l.code)).toEqual(['L5001', 'J6001']);
  });
});

describe('parsing helpers', () => {
  it('reads Japanese era and western build years', () => {
    expect(parseBuiltYear('1983年8月')).toBe(1983);
    expect(parseBuiltYear('平成7年3月')).toBe(1995);
    expect(parseBuiltYear('昭和55年9月')).toBe(1980);
    expect(parseBuiltYear('令和元年5月')).toBe(2019);
  });
  it('reads walking minutes, including full-width digits, and rejects bus routes', () => {
    expect(parseWalk('徒歩8分')).toBe(8);
    expect(parseWalk('徒歩７分')).toBe(7);
    expect(parseWalk('バス乗車19分 遺跡公園 停歩5分')).toBeUndefined();
  });
  it('reads deposit and key money months', () => {
    expect(parseDepositKey('敷金：0　礼金：1')).toEqual({ deposit: 0, keyMoney: 1 });
  });
  it('matches station names in English or Japanese', () => {
    expect(findStation('Nishi-sugamo')?.slug).toBe('nishi-sugamo');
    expect(findStation('大塚帝京大学駅')?.slug).toBe('otsuka-teikyo-daigaku');
    expect(findStation('北野駅')?.slug).toBe('kitano');
    expect(findStation('県立大学前駅')?.slug).toBe('kenritsudaigaku');
    expect(findStation('Hachiojiminamino')?.slug).toBe('hachioji-minamino');
    expect(findStation('Nowhere')).toBeUndefined();
  });
});

describe('links to the room on the source site', () => {
  it('Leopalace21 uses area-code and building-number slugs, as its own site does', () => {
    expect(leopalaceUrl({
      prefectureNameParam: 'tokyo', area: { areaNameParam: 'nakano-ku', areaCode: '13114' },
      propertyNameParam: 'g-forest-numabukuro', propertyNo: '0000024433204', roomNo: '204',
    })).toBe('https://www.leopalace21.com/en/properties/chintai/tokyo/nakano-ku-13114/g-forest-numabukuro-24433/204');
    expect(leopalaceUrl({
      prefectureNameParam: 'tokyo', area: { areaNameParam: 'toshima-ku', areaCode: '13116' },
      propertyNameParam: 'tosa', propertyNo: '0000001379102', roomNo: '102',
    })).toBe('https://www.leopalace21.com/en/properties/chintai/tokyo/toshima-ku-13116/tosa-01379/102');
    expect(SOURCE_LISTINGS[0].source!.url).toBe('https://www.leopalace21.com/en/properties/chintai/tokyo/nakano-ku-13114/g-forest-numabukuro-24433/204');
  });
  it('J&K opens the room detail page in kViewer', () => {
    expect(jkRoomUrl('abc')).toBe('https://26bb69c2.viewer.kintoneapp.com/public/b5a02c30127646587293b7076e0fa383e4712bfc50ece9cdd495157884a3ee1e/detail/abc');
    expect(SOURCE_LISTINGS.find((l) => l.code === 'J6001')!.source!.url).toMatch(/\/detail\/def5/);
  });
});

describe('status rules', () => {
  it('Leopalace21: vacant or leaving soon is open, occupied is rented', () => {
    expect(leopalaceStatus({ status: 'Vacant', isRecruitment: true })).toBe('available');
    expect(leopalaceStatus({ status: 'Scheduled to leave', isRecruitment: true })).toBe('available');
    expect(leopalaceStatus({ status: 'Occupied', isRecruitment: false })).toBe('rented');
  });
  it('J&K: listed and open is available, applied is pending, gone from the list is rented', () => {
    expect(jkStatus({ 申込の有無: '募集中' })).toBe('available');
    expect(jkStatus({ 申込の有無: '申込あり' })).toBe('applied');
    expect(jkStatus(undefined)).toBe('rented');
  });
});

describe('live checks', () => {
  it('checkLeopalace reports the status and when the source answered', async () => {
    const f = (async () => json({ status: 'Occupied', isRecruitment: false })) as typeof fetch;
    expect(await checkLeopalace('0001', f)).toEqual({ status: 'rented', checkedAt: '2026-11-12T05:00:00.000Z' });
  });
  it('checkLeopalace returns null when the source fails', async () => {
    expect(await checkLeopalace('0001', (async () => json({}, 503)) as typeof fetch)).toBeNull();
    expect(await checkLeopalace('0001', (async () => { throw new Error('offline'); }) as typeof fetch)).toBeNull();
  });
  it('checkJk reads every page and marks missing rooms as rented', async () => {
    const pages: Record<string, unknown> = {
      1: { totalCount: 3, num: 2, records: [{ $id: { value: 'a' }, 申込の有無: { value: '募集中' } }, { $id: { value: 'b' }, 申込の有無: { value: '申込あり' } }] },
      2: { totalCount: 3, num: 2, records: [{ $id: { value: 'c' }, 申込の有無: { value: '募集中' } }] },
    };
    const seen: string[] = [];
    const f = (async (url: string) => { const page = url.split('/').pop()!; seen.push(page); return json(pages[page]); }) as typeof fetch;
    const result = await checkJk(['a', 'b', 'c', 'gone'], f);
    expect(seen.sort()).toEqual(['1', '2']);
    expect(Object.fromEntries([...result!].map(([id, c]) => [id, c.status]))).toEqual({ a: 'available', b: 'applied', c: 'available', gone: 'rented' });
  });
  it('checkJk returns null when a page fails, so no room is wrongly hidden', async () => {
    const f = (async (url: string) => (url.endsWith('/1')
      ? json({ totalCount: 3, num: 2, records: [] })
      : json({}, 500))) as typeof fetch;
    expect(await checkJk(['a'], f)).toBeNull();
  });
});
