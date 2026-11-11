import type { Station } from '../types';

const st = (slug: string, en: string, ja: string, lineSlugs: string[], areaSlug: string): Station => ({
  slug, name: { en, my: en, ja }, lineSlugs, areaSlug,
});

export const STATIONS: Station[] = [
  st('shin-okubo', 'Shin-Okubo', '新大久保', ['yamanote'], 'shinjuku'),
  st('okubo', 'Okubo', '大久保', ['chuo-sobu'], 'shinjuku'),
  st('takadanobaba', 'Takadanobaba', '高田馬場', ['yamanote', 'tozai', 'seibu-shinjuku'], 'shinjuku'),
  st('shinjuku', 'Shinjuku', '新宿', ['yamanote', 'chuo-sobu', 'saikyo', 'marunouchi', 'oedo'], 'shinjuku'),
  st('higashi-shinjuku', 'Higashi-Shinjuku', '東新宿', ['fukutoshin', 'oedo'], 'shinjuku'),
  st('nakai', 'Nakai', '中井', ['seibu-shinjuku', 'oedo'], 'shinjuku'),
  st('shimo-ochiai', 'Shimo-Ochiai', '下落合', ['seibu-shinjuku'], 'shinjuku'),
  st('ikebukuro', 'Ikebukuro', '池袋', ['yamanote', 'saikyo', 'marunouchi', 'fukutoshin'], 'toshima'),
  st('otsuka', 'Otsuka', '大塚', ['yamanote'], 'toshima'),
  st('mejiro', 'Mejiro', '目白', ['yamanote'], 'toshima'),
  st('shibuya', 'Shibuya', '渋谷', ['yamanote', 'saikyo', 'fukutoshin'], 'shibuya'),
  st('ebisu', 'Ebisu', '恵比寿', ['yamanote', 'saikyo'], 'shibuya'),
  st('nakano', 'Nakano', '中野', ['chuo-sobu', 'tozai'], 'nakano'),
  st('higashi-nakano', 'Higashi-Nakano', '東中野', ['chuo-sobu', 'oedo'], 'nakano'),
  st('myogadani', 'Myogadani', '茗荷谷', ['marunouchi'], 'bunkyo'),
  st('korakuen', 'Korakuen', '後楽園', ['marunouchi', 'namboku'], 'bunkyo'),
  st('kasuga', 'Kasuga', '春日', ['oedo'], 'bunkyo'),
  st('ueno', 'Ueno', '上野', ['yamanote', 'keihin-tohoku'], 'taito'),
  st('okachimachi', 'Okachimachi', '御徒町', ['yamanote', 'keihin-tohoku'], 'taito'),
  st('ueno-okachimachi', 'Ueno-Okachimachi', '上野御徒町', ['oedo'], 'taito'),
  st('kinshicho', 'Kinshicho', '錦糸町', ['chuo-sobu'], 'sumida'),
  st('ryogoku', 'Ryogoku', '両国', ['chuo-sobu', 'oedo'], 'sumida'),
  st('akabane', 'Akabane', '赤羽', ['saikyo', 'keihin-tohoku'], 'kita'),
  st('oji', 'Oji', '王子', ['keihin-tohoku', 'namboku'], 'kita'),
  st('jujo', 'Jujo', '十条', ['saikyo'], 'kita'),
];
