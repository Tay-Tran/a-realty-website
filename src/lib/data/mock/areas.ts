import type { Area } from '../types';

const area = (slug: string, en: string, ja: string): Area => ({ slug, name: { en, my: en, ja } });

export const AREAS: Area[] = [
  area('shinjuku', 'Shinjuku', '新宿区'),
  area('toshima', 'Toshima (Ikebukuro)', '豊島区'),
  area('shibuya', 'Shibuya', '渋谷区'),
  area('nakano', 'Nakano', '中野区'),
  area('bunkyo', 'Bunkyo', '文京区'),
  area('taito', 'Taito (Ueno)', '台東区'),
  area('sumida', 'Sumida', '墨田区'),
  area('kita', 'Kita (Akabane)', '北区'),
];
