// Shape of snapshot.json, written by scripts/fetch-source-snapshot.mjs.

export interface LeopalaceRoute {
  lineName: string;
  stationName: string;
  stationWalkingTime: number;
  busStationName?: string;
}

export interface LeopalaceImage {
  imagePath: string;
  title?: string;
  isMadoriImage: boolean;
}

/** Fields kept from GET /api/properties/{propertyNo}. */
export interface LeopalaceDetail {
  propertyNo: string;
  propertyName: string;
  propertyNameJa: string;
  propertyNameParam: string;
  roomNo: string;
  address: string;
  addressJa: string;
  rentFee: number;
  maintenanceFee: number;
  shikikin: number;
  reikin: number;
  layout: string;
  size: number;
  floor: number;
  /** yyyymm */
  buildDay: number;
  routes: LeopalaceRoute[];
  /** Same routes with Japanese names (language=ja). */
  routesJa?: LeopalaceRoute[];
  station: { stationName: string; stationNameJa: string; stationNameParam: string };
  area: { areaName: string; areaNameJa: string; areaNameParam: string; areaCode: string };
  point: string[];
  furnitureFlg: boolean;
  keyExchangeFee: number;
  basicCleaningFee: number;
  /** "Vacant", "Scheduled to leave", "Occupied" */
  status: string;
  isRecruitment: boolean;
  brokerageFee: number;
  prefectureNameParam: string;
  updateDate: string;
}

export interface LeopalaceUrlParts {
  prefectureNameParam: string;
  area: { areaNameParam: string; areaCode: string };
  propertyNameParam: string;
  propertyNo: string;
  roomNo: string;
}

export interface LeopalaceRoom {
  source: 'leopalace21';
  areaSlug: string;
  detail: LeopalaceDetail;
  images: LeopalaceImage[];
}

export interface JkFile { fileKey: string; name: string; contentType: string }

/** A J&K Kintone record flattened to field → value (Japanese field names as on the source). */
export interface JkRecord {
  $id: string;
  物件名: string;
  部屋番号: string;
  都道府県: string;
  住所: string;
  交通＿線: string;
  交通＿駅: string;
  交通＿徒歩バス: string;
  賃料: string;
  管理費: string;
  間取り: string;
  占有面積_: string;
  築年数: string;
  '条件1＿_敷金・礼金について': string;
  ペット: string | null;
  エアコン: string | null;
  'バス・トイレ': string | null;
  エレベーター: string | null;
  駐輪場: string | null;
  申込の有無: string | null;
  部屋の現況: string | null;
  図面＿間取り: JkFile[] | null;
  図面＿外観: JkFile[] | null;
  /** kViewer key for the room's own page. */
  recordCode: string;
}

export interface JkRoom { source: 'jk'; record: JkRecord }

export interface Snapshot {
  fetchedAt: string;
  leopalace: LeopalaceRoom[];
  jk: JkRoom[];
}
