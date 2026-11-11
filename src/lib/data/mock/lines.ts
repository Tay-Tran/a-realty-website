import type { Line } from '../types';

const line = (slug: string, en: string, ja: string, color: string): Line => ({ slug, name: { en, my: en, ja }, color });

export const LINES: Line[] = [
  line('yamanote', 'JR Yamanote Line', 'JR山手線', '#80c241'),
  line('chuo-sobu', 'JR Chuo-Sobu Line', 'JR中央・総武線', '#ffd400'),
  line('saikyo', 'JR Saikyo Line', 'JR埼京線', '#00ac9a'),
  line('keihin-tohoku', 'JR Keihin-Tohoku Line', 'JR京浜東北線', '#00b2e5'),
  line('marunouchi', 'Tokyo Metro Marunouchi Line', '東京メトロ丸ノ内線', '#f62e36'),
  line('tozai', 'Tokyo Metro Tozai Line', '東京メトロ東西線', '#009bbf'),
  line('fukutoshin', 'Tokyo Metro Fukutoshin Line', '東京メトロ副都心線', '#9c5e31'),
  line('namboku', 'Tokyo Metro Namboku Line', '東京メトロ南北線', '#00ada9'),
  line('oedo', 'Toei Oedo Line', '都営大江戸線', '#b6007a'),
  line('seibu-shinjuku', 'Seibu Shinjuku Line', '西武新宿線', '#0e9ad7'),
];
