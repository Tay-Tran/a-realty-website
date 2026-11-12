// Pulls a handful of real rooms from Leopalace21 and J&K (kViewer) for the demo.
// Usage: node scripts/fetch-source-snapshot.mjs            refresh the rooms already in the snapshot
//        node scripts/fetch-source-snapshot.mjs --repick   choose the rooms again
// Writes src/lib/data/sources/snapshot.json. Requests run one at a time with a pause in between.

import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/lib/data/sources/snapshot.json', import.meta.url);
const PAUSE_MS = 600;

const LEO = 'https://www.leopalace21.com/api';
/** Vacant rooms per area: [Leopalace areaCode, demo area slug, how many]. 25 rooms in all. */
const LEO_AREAS = [
  ['13114', 'nakano', 3],
  ['13104', 'shinjuku', 3],
  ['13117', 'kita', 3],
  ['13116', 'toshima', 3],
  ['13107', 'sumida', 3],
  ['13105', 'bunkyo', 2],
  ['13113', 'shibuya', 2],
  ['13106', 'taito', 2],
  ['13112', 'setagaya', 2],
  ['13201', 'hachioji', 2],
];

export const JK_VIEW = 'b5a02c30127646587293b7076e0fa383e4712bfc50ece9cdd495157884a3ee1e';
const JK = `https://26bb69c2.viewer.kintoneapp.com/public/internal/api/records/${JK_VIEW}`;
/** Tokyo rooms picked by hand on 2026-11-12; the rest are picked automatically (see jkRooms) up to JK_COUNT. */
const JK_IDS = ['13780', '13760', '13756', '13752', '13759'];
const JK_COUNT = 25;
const JK_PREFECTURES = ['東京都', '神奈川県', '千葉県', '埼玉県'];
const LAYOUTS = ['1R', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK'];
const JK_FIELDS = [
  '$id', '物件名', '部屋番号', '都道府県', '住所', '交通＿線', '交通＿駅', '交通＿徒歩バス', '賃料', '管理費',
  '間取り', '占有面積_', '築年数', '条件1＿_敷金・礼金について', 'ペット', 'エアコン', 'バス・トイレ',
  'エレベーター', '駐輪場', '申込の有無', '部屋の現況', '図面＿間取り', '図面＿外観',
  // Cost conditions, used for the initial-cost breakdown.
  '条件2＿保証会社の加入条件', '条件3＿_更新料・解約予告・違約金', '安心サポート費',
  '固定費項目＿1', '固定費＿1', '固定費項目＿2', '固定費＿2',
];
/** Leopalace21 optional services, asked once with everything switched on to learn their prices. */
const LEO_OPTIONS = ['hasLeopalaceInsurance', 'hasBasicCleaningFee', 'hasResidentSupportSystem', 'hasAntibacterialConstructionService']
  .map((k) => `&${k}=true`).join('');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(url) {
  await sleep(PAUSE_MS);
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** Up to `count` walkable rooms in an area, one per building (looks at the first 5 result pages). */
async function leopalacePicks(areaCode, count) {
  const picks = [];
  for (let page = 1; page <= 5 && picks.length < count; page++) {
    const search = await getJson(`${LEO}/properties/search?contractType=chintai&language=en&isRecruitment=true&areaCode=${areaCode}&page=${page}`);
    for (const a of search.apartments) {
      const room = a.properties.find((p) => p.route?.stationWalkingTime && !p.route.busStationName && LAYOUTS.includes(p.layout));
      if (room && picks.length < count) picks.push(room.propertyNo);
    }
    if (page * 20 >= search.count) break;
  }
  if (picks.length === 0) throw new Error(`No walkable room in ${areaCode}`);
  return picks;
}

async function leopalaceRoom(propertyNo, areaSlug) {
  const d = await getJson(`${LEO}/properties/${propertyNo}?contractType=chintai&language=en`);
  const ja = await getJson(`${LEO}/properties/${propertyNo}?contractType=chintai&language=ja`);
  const img = await getJson(`${LEO}/properties/${propertyNo}/image?language=en`);
  // Leopalace21's own initial-cost calculator: required items, then the same with optional services.
  const cost = await getJson(`${LEO}/properties/${propertyNo}/cost?contractType=chintai&isCorporate=false`);
  const costWithOptions = await getJson(`${LEO}/properties/${propertyNo}/cost?contractType=chintai&isCorporate=false${LEO_OPTIONS}`);
  return {
    source: 'leopalace21',
    areaSlug,
    detail: {
      propertyNo: d.propertyNo, propertyName: d.propertyName, propertyNameJa: d.propertyNameJa,
      propertyNameParam: d.propertyNameParam, roomNo: d.roomNo, address: d.address, addressJa: d.addressJa,
      rentFee: d.rentFee, maintenanceFee: d.maintenanceFee, shikikin: d.shikikin, reikin: d.reikin,
      layout: d.layout, size: d.size, floor: d.floor, buildDay: d.buildDay, routes: d.routes, routesJa: ja.routes,
      station: d.station, area: d.area, point: d.point, furnitureFlg: d.furnitureFlg,
      keyExchangeFee: d.keyExchangeFee, basicCleaningFee: d.basicCleaningFee,
      status: d.status, isRecruitment: d.isRecruitment, brokerageFee: d.brokerageFee,
      prefectureNameParam: d.prefecture?.prefectureNameParam, updateDate: d.updateDate,
    },
    images: img.propertyImages,
    cost: { required: cost.rentContractFee, monthly: cost.rentUsageFeePerMonth, withOptions: costWithOptions.rentContractFee },
  };
}

async function jkRooms(keepIds) {
  const records = [];
  for (let page = 1; ; page++) {
    const data = await getJson(`${JK}/${page}`);
    records.push(...data.records);
    if (records.length >= data.totalCount || data.records.length === 0) break;
  }
  const v = (r, k) => String(r[k]?.value ?? '').normalize('NFKC').trim();
  // Walk from a train station (not from a bus stop), a supported layout and at least one photo.
  const usable = (r) => LAYOUTS.includes(v(r, '間取り').toUpperCase()) && /^徒歩\d+分/.test(v(r, '交通＿徒歩バス'))
    && !/バス/.test(v(r, '交通＿線')) && !/停留所$/.test(v(r, '交通＿駅'))
    && (r['図面＿外観']?.value ?? []).length > 0 && JK_PREFECTURES.includes(v(r, '都道府県'));
  if (keepIds) {
    return keepIds.flatMap((id) => {
      const r = records.find((x) => x.$id.value === id);
      if (!r) console.warn(`J&K room ${id} is no longer listed – left out`);
      return r ? [jkEntry(r)] : [];
    });
  }
  const pinned = JK_IDS.map((id) => {
    const r = records.find((x) => x.$id.value === id);
    if (!r) throw new Error(`J&K room ${id} is no longer listed`);
    return r;
  });
  // One room per building, Tokyo first, newest records first.
  const buildings = new Set(pinned.map((r) => v(r, '物件名')));
  const extra = records
    .filter(usable)
    .sort((a, b) => JK_PREFECTURES.indexOf(v(a, '都道府県')) - JK_PREFECTURES.indexOf(v(b, '都道府県')) || Number(b.$id.value) - Number(a.$id.value))
    .filter((r) => !buildings.has(v(r, '物件名')) && buildings.add(v(r, '物件名')))
    .slice(0, JK_COUNT - pinned.length);
  return [...pinned, ...extra].map(jkEntry);
}

function jkEntry(r) {
  const record = Object.fromEntries(JK_FIELDS.map((k) => [k, r[k]?.value ?? null]));
  // kViewer's key for the room's own page: /public/{view}/detail/{recordCode}
  return { source: 'jk', record: { ...record, recordCode: r.__kviewer_record_code__ } };
}

const previous = process.argv.includes('--repick') ? null : await readFile(OUT, 'utf8').then(JSON.parse).catch(() => null);
const leopalace = [];
let jk;
if (previous) {
  // Same rooms in the same order, so every room keeps its demo code.
  for (const room of previous.leopalace) {
    try {
      leopalace.push(await leopalaceRoom(room.detail.propertyNo, room.areaSlug));
    } catch (e) {
      console.warn(`Leopalace21 room ${room.detail.propertyNo} failed (${e.message}) – left out`);
    }
  }
  jk = await jkRooms(previous.jk.map((room) => room.record.$id));
} else {
  // Round-robin over the areas, so the first room of every area keeps its place (and its demo code).
  const picks = [];
  for (const [code, slug, count] of LEO_AREAS) picks.push({ slug, nos: await leopalacePicks(code, count) });
  for (let round = 0; round < Math.max(...picks.map((p) => p.nos.length)); round++) {
    for (const { slug, nos } of picks) if (nos[round]) leopalace.push(await leopalaceRoom(nos[round], slug));
  }
  jk = await jkRooms();
}

await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), leopalace, jk }, null, 2) + '\n');
console.log(`Saved ${leopalace.length} Leopalace21 + ${jk.length} J&K rooms`);
