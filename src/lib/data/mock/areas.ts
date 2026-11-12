import type { Area, Prefecture } from '../types';

const area = (slug: string, en: string, ja: string, prefecture: Prefecture = 'tokyo'): Area => ({
  slug, name: { en, my: en, ja }, prefecture,
});

export const AREAS: Area[] = [
  area('shinjuku', 'Shinjuku', '新宿区'),
  area('toshima', 'Toshima (Ikebukuro)', '豊島区'),
  area('shibuya', 'Shibuya', '渋谷区'),
  area('nakano', 'Nakano', '中野区'),
  area('bunkyo', 'Bunkyo', '文京区'),
  area('taito', 'Taito (Ueno)', '台東区'),
  area('sumida', 'Sumida', '墨田区'),
  area('kita', 'Kita (Akabane)', '北区'),
  // Areas added for the rooms pulled from J&K (see ../sources).
  area('setagaya', 'Setagaya', '世田谷区'),
  area('hachioji', 'Hachioji', '八王子市'),
  area('tama', 'Tama', '多摩市'),
  area('higashikurume', 'Higashikurume', '東久留米市'),
  area('yokohama', 'Yokohama', '横浜市', 'kanagawa'),
  area('yokosuka', 'Yokosuka', '横須賀市', 'kanagawa'),
  area('hadano', 'Hadano', '秦野市', 'kanagawa'),
  area('zama', 'Zama', '座間市', 'kanagawa'),
  area('isehara', 'Isehara', '伊勢原市', 'kanagawa'),
  area('minamiashigara', 'Minamiashigara', '南足柄市', 'kanagawa'),
  area('matsuda', 'Matsuda', '松田町', 'kanagawa'),
];
