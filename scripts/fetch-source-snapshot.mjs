// Pulls a handful of real rooms from Leopalace21 and J&K (kViewer) for the demo.
// Usage: node scripts/fetch-source-snapshot.mjs
// Writes src/lib/data/sources/snapshot.json. Requests run one at a time with a pause in between.

import { writeFile } from 'node:fs/promises';

const OUT = new URL('../src/lib/data/sources/snapshot.json', import.meta.url);
const PAUSE_MS = 600;

const LEO = 'https://www.leopalace21.com/api';
/** One vacant room per demo ward (Leopalace areaCode → demo area slug). */
const LEO_AREAS = [
  ['13114', 'nakano'],
  ['13104', 'shinjuku'],
  ['13117', 'kita'],
  ['13116', 'toshima'],
  ['13107', 'sumida'],
];

export const JK_VIEW = 'b5a02c30127646587293b7076e0fa383e4712bfc50ece9cdd495157884a3ee1e';
const JK = `https://26bb69c2.viewer.kintoneapp.com/public/internal/api/records/${JK_VIEW}`;
/** Tokyo rooms with photos and a walking route, picked by hand on 2026-11-12. */
const JK_IDS = ['13780', '13760', '13756', '13752', '13759'];
const JK_FIELDS = [
  '$id', '物件名', '部屋番号', '都道府県', '住所', '交通＿線', '交通＿駅', '交通＿徒歩バス', '賃料', '管理費',
  '間取り', '占有面積_', '築年数', '条件1＿_敷金・礼金について', 'ペット', 'エアコン', 'バス・トイレ',
  'エレベーター', '駐輪場', '申込の有無', '部屋の現況', '図面＿間取り', '図面＿外観',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(url) {
  await sleep(PAUSE_MS);
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function leopalaceRoom(areaCode, areaSlug) {
  const search = await getJson(`${LEO}/properties/search?contractType=chintai&language=en&isRecruitment=true&areaCode=${areaCode}&page=1`);
  const rooms = search.apartments.flatMap((a) => a.properties);
  const room = rooms.find((p) => p.route?.stationWalkingTime && !p.route.busStationName);
  if (!room) throw new Error(`No walkable room in ${areaCode}`);
  const d = await getJson(`${LEO}/properties/${room.propertyNo}?contractType=chintai&language=en`);
  const img = await getJson(`${LEO}/properties/${room.propertyNo}/image?language=en`);
  return {
    source: 'leopalace21',
    areaSlug,
    detail: {
      propertyNo: d.propertyNo, propertyName: d.propertyName, propertyNameJa: d.propertyNameJa,
      propertyNameParam: d.propertyNameParam, roomNo: d.roomNo, address: d.address, addressJa: d.addressJa,
      rentFee: d.rentFee, maintenanceFee: d.maintenanceFee, shikikin: d.shikikin, reikin: d.reikin,
      layout: d.layout, size: d.size, floor: d.floor, buildDay: d.buildDay, routes: d.routes,
      station: d.station, area: d.area, point: d.point, furnitureFlg: d.furnitureFlg,
      keyExchangeFee: d.keyExchangeFee, basicCleaningFee: d.basicCleaningFee,
      status: d.status, isRecruitment: d.isRecruitment, brokerageFee: d.brokerageFee,
      prefectureNameParam: d.prefecture?.prefectureNameParam, updateDate: d.updateDate,
    },
    images: img.propertyImages,
  };
}

async function jkRooms() {
  const records = [];
  for (let page = 1; ; page++) {
    const data = await getJson(`${JK}/${page}`);
    records.push(...data.records);
    if (records.length >= data.totalCount || data.records.length === 0) break;
  }
  return JK_IDS.map((id) => {
    const r = records.find((x) => x.$id.value === id);
    if (!r) throw new Error(`J&K room ${id} is no longer listed`);
    const record = Object.fromEntries(JK_FIELDS.map((k) => [k, r[k]?.value ?? null]));
    // kViewer's key for the room's own page: /public/{view}/detail/{recordCode}
    return { source: 'jk', record: { ...record, recordCode: r.__kviewer_record_code__ } };
  });
}

const leopalace = [];
for (const [code, slug] of LEO_AREAS) leopalace.push(await leopalaceRoom(code, slug));
const jk = await jkRooms();

await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), leopalace, jk }, null, 2) + '\n');
console.log(`Saved ${leopalace.length} Leopalace21 + ${jk.length} J&K rooms`);
