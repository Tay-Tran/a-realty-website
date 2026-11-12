import type { AmenityKey, Listing, ListingStatus, StoredConditionKey } from '../types';
import { jkCosts } from './costs';
import { asLayout, findAreaSlug, findStation, toListing } from './shared';
import type { JkRecord, JkRoom } from './types';

export const JK_HOST = 'https://26bb69c2.viewer.kintoneapp.com';
export const JK_VIEW = 'b5a02c30127646587293b7076e0fa383e4712bfc50ece9cdd495157884a3ee1e';
export const JK_RECORDS_API = `${JK_HOST}/public/internal/api/records/${JK_VIEW}`;
export const jkRoomUrl = (recordCode: string) => `${JK_HOST}/public/${JK_VIEW}/detail/${recordCode}`;

export const jkFileUrl = (recordId: string, fileKey: string) =>
  `${JK_HOST}/public/file/inline/${JK_VIEW}/${recordId}/${fileKey}`;

/** J&K's view lists open rooms only: a room that drops off the list has been taken. */
export function jkStatus(record: Pick<JkRecord, '申込の有無'> | undefined): ListingStatus {
  if (!record) return 'rented';
  return record.申込の有無 === '募集中' ? 'available' : 'applied';
}

const ERA_START: Record<string, number> = { 昭和: 1925, 平成: 1988, 令和: 2018 };

/** "1983年8月", "平成7年3月", "昭和55年9月" → 1983, 1995, 1980 */
export function parseBuiltYear(text: string): number {
  const m = /(昭和|平成|令和)?\s*(\d+|元)年/.exec(text.normalize('NFKC'));
  if (!m) throw new Error(`Unrecognised build date: ${text}`);
  const n = m[2] === '元' ? 1 : Number(m[2]);
  return m[1] ? ERA_START[m[1]] + n : n;
}

/** "徒歩8分" → 8; bus routes are not supported. */
export function parseWalk(text: string): number | undefined {
  const m = /^徒歩(\d+)分/.exec(text.normalize('NFKC').trim());
  return m ? Number(m[1]) : undefined;
}

/** "敷金：0　礼金：1" → months for each. */
export function parseDepositKey(text: string): { deposit: number; keyMoney: number } {
  const t = text.normalize('NFKC');
  const num = (label: string) => Number(new RegExp(`${label}:\\s*([\\d.]+)`).exec(t)?.[1] ?? 0);
  return { deposit: num('敷金'), keyMoney: num('礼金') };
}

const has = (value: string | null, word = '有') => (value ?? '').normalize('NFKC').includes(word);

export function mapJk(room: JkRoom, code: string, publishedAt: string, featured = false): Listing {
  const r = room.record;
  const layout = asLayout(r.間取り);
  if (!layout) throw new Error(`J&K ${r.$id}: unsupported layout ${r.間取り}`);
  const station = findStation(r.交通＿駅);
  const walk = parseWalk(r.交通＿徒歩バス);
  if (!station || walk === undefined) throw new Error(`J&K ${r.$id}: unknown station or no walking route (${r.交通＿駅} ${r.交通＿徒歩バス})`);
  const address = `${r.都道府県}${r.住所}`.normalize('NFKC').trim();
  const areaSlug = findAreaSlug(address);
  if (!areaSlug) throw new Error(`J&K ${r.$id}: no demo area for ${address}`);

  const rent = Number(r.賃料);
  const fee = Number(r.管理費 || 0);
  const { deposit, keyMoney } = parseDepositKey(r['条件1＿_敷金・礼金について']);
  const conditions: StoredConditionKey[] = [];
  if (has(r.ペット, '可') && !has(r.ペット, '不可')) conditions.push('petOk');
  const amenities: AmenityKey[] = [];
  if (r.エアコン && !has(r.エアコン, '無')) amenities.push('aircon');
  if (has(r.エレベーター)) amenities.push('elevator');
  if (has(r.駐輪場)) amenities.push('bikeParking');
  if (has(r['バス・トイレ'], '別')) amenities.push('separateToilet');

  return toListing({
    code,
    source: { name: 'jk', id: r.$id, label: `${r.物件名} ${r.部屋番号}`.normalize('NFKC'), url: jkRoomUrl(r.recordCode) },
    status: jkStatus(r),
    areaSlug,
    address,
    stations: [{ station, walk }],
    layout,
    size: Number(r.占有面積_),
    floor: Math.max(1, Math.floor(Number.parseInt(r.部屋番号, 10) / 100) || 1),
    builtYear: parseBuiltYear(r.築年数),
    rent,
    managementFee: fee,
    // Only deposit/key months are read from here (search filters); the cost table uses `costs`.
    initialCosts: { depositMonths: deposit, keyMoneyMonths: keyMoney, brokerageMonths: 0, guaranteeFee: 0, insurance: 0, keyExchange: 0, cleaning: 0 },
    costs: jkCosts(r, rent, fee, deposit, keyMoney),
    conditions,
    amenities,
    images: (r.図面＿外観 ?? []).map((f) => jkFileUrl(r.$id, f.fileKey)),
    floorPlan: r.図面＿間取り?.[0] ? jkFileUrl(r.$id, r.図面＿間取り[0].fileKey) : undefined,
    featured,
    publishedAt,
  });
}
