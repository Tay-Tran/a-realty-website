import type { Layout, Locale, LocalizedText, Station, StoredConditionKey } from '../types';

// Burmese and Japanese copy is a draft for the client's native speakers to review.
const PHRASES: Record<StoredConditionKey, LocalizedText> = {
  foreignerOk: { en: 'Foreigners welcome.', my: 'နိုင်ငံခြားသားများ ငှားရမ်းနိုင်သည်။', ja: '外国籍の方歓迎。' },
  noGuarantor: { en: 'No guarantor needed (guarantor company available).', my: 'အာမခံသူ မလိုအပ်ပါ (အာမခံကုမ္ပဏီ အသုံးပြုနိုင်သည်)။', ja: '保証人不要（保証会社利用可）。' },
  studentOk: { en: 'Students welcome.', my: 'ကျောင်းသားများ ငှားရမ်းနိုင်သည်။', ja: '学生可。' },
  petOk: { en: 'Pets allowed (please ask for details).', my: 'အိမ်မွေးတိရစ္ဆာန် မွေးမြူနိုင်သည် (အသေးစိတ် မေးမြန်းပါ)။', ja: 'ペット相談可。' },
  furnished: { en: 'Comes furnished.', my: 'ပရိဘောဂ ပါဝင်သည်။', ja: '家具付き。' },
  overseasApplication: { en: 'You can apply from overseas.', my: 'နိုင်ငံခြားမှ လျှောက်ထားနိုင်သည်။', ja: '海外からのお申込み可。' },
  autoLock: { en: 'Auto-lock entrance.', my: 'အလိုအလျောက်သော့ (auto-lock) တံခါး ပါသည်။', ja: 'オートロック付き。' },
};

export function buildTitle(layout: Layout, station: Station, walk: number): LocalizedText {
  return {
    en: `${layout} apartment, ${walk} min from ${station.name.en} Station`,
    my: `${station.name.my} ဘူတာမှ လမ်းလျှောက် ${walk} မိနစ် · ${layout} တိုက်ခန်း`,
    ja: `${station.name.ja}駅 徒歩${walk}分の${layout}`,
  };
}

export function buildDescription(p: {
  layout: Layout; size: number; floor: number; built: number;
  station: Station; walk: number; conditions: StoredConditionKey[];
}): LocalizedText {
  const phrases = (locale: Locale) => p.conditions.map((c) => PHRASES[c][locale]).join(locale === 'ja' ? '' : ' ');
  return {
    en: `A ${p.size} m² ${p.layout} apartment on floor ${p.floor}, built in ${p.built}. ${p.station.name.en} Station is a ${p.walk}-minute walk away. ${phrases('en')}`.trim(),
    my: `${p.station.name.my} ဘူတာမှ လမ်းလျှောက် ${p.walk} မိနစ်အကွာတွင်ရှိသော ${p.built} ခုနှစ်ဆောက် ${p.layout} တိုက်ခန်း (${p.size} m²၊ ${p.floor} ထပ်) ဖြစ်ပါသည်။ ${phrases('my')}`.trim(),
    ja: `${p.station.name.ja}駅から徒歩${p.walk}分、${p.built}年築の${p.layout}（${p.size}㎡・${p.floor}階）です。${phrases('ja')}`,
  };
}
