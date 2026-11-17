import type { Job } from '../types';

// Sample openings for the demo; staff manage real ones in the CMS.
export const JOBS: Job[] = [
  {
    slug: 'rental-agent',
    title: { en: 'Rental agent (multilingual)', ja: '賃貸営業スタッフ（多言語）', my: 'အိမ်ငှားရောင်းချရေး ဝန်ထမ်း (ဘာသာစုံ)' },
    location: { en: 'Shinjuku office, Tokyo', ja: '東京・新宿オフィス', my: 'တိုကျို၊ Shinjuku ရုံး' },
    employment: 'fullTime',
    salary: { en: '¥250,000–¥350,000 / month + commission', ja: '月給25万〜35万円＋歩合', my: 'လစာ ¥250,000–¥350,000 + ကော်မရှင်' },
    languages: ['ja', 'en'],
    summary: {
      en: 'Help foreign residents find their home in Tokyo – from the first message to handing over the keys.',
      ja: '東京で部屋を探す外国人のお客様を、最初の問い合わせから鍵の受け渡しまでサポートします。',
      my: 'တိုကျိုတွင် အိမ်ရှာနေသော နိုင်ငံခြားသားများကို ပထမဆုံး မက်ဆေ့ချ်မှ သော့လွှဲပြောင်းသည်အထိ ကူညီပေးရမည်။',
    },
    duties: [
      { en: 'Answer inquiries by LINE, WhatsApp, phone and email', ja: 'LINE・WhatsApp・電話・メールでの問い合わせ対応', my: 'LINE၊ WhatsApp၊ ဖုန်းနှင့် အီးမေးလ်ဖြင့် မေးမြန်းချက်များကို ဖြေကြားခြင်း' },
      { en: 'Propose apartments and arrange viewings (in person or by video)', ja: '物件の提案と内見の手配（対面・オンライン）', my: 'အခန်းများ အကြံပြုခြင်းနှင့် ကြည့်ရှုချိန်း စီစဉ်ခြင်း (လူကိုယ်တိုင် သို့မဟုတ် ဗီဒီယို)' },
      { en: 'Support applications, screening and contracts with landlords', ja: '申込・審査・契約手続きのサポート', my: 'လျှောက်လွှာ၊ စိစစ်ခြင်းနှင့် စာချုပ်ချုပ်ဆိုခြင်းကို ကူညီခြင်း' },
    ],
    requirements: [
      { en: 'Business-level Japanese (JLPT N2 or above)', ja: 'ビジネスレベルの日本語（JLPT N2以上）', my: 'လုပ်ငန်းသုံး ဂျပန်စာ (JLPT N2 နှင့်အထက်)' },
      { en: 'Conversational English; Burmese is a plus', ja: '日常会話レベルの英語（ミャンマー語ができれば尚可）', my: 'နေ့စဉ်သုံး အင်္ဂလိပ်စာ၊ မြန်မာစာ တတ်လျှင် ပိုကောင်း' },
      { en: 'Real estate experience welcome but not required', ja: '不動産経験者歓迎（未経験可）', my: 'အိမ်ခြံမြေ အတွေ့အကြုံရှိလျှင် ပိုကောင်း (မရှိလည်း ရ)' },
    ],
    benefits: [
      { en: 'Visa sponsorship available', ja: 'ビザサポートあり', my: 'ဗီဇာ ကူညီပေးနိုင်' },
      { en: 'Social insurance and transport allowance', ja: '社会保険完備・交通費支給', my: 'လူမှုဖူလုံရေး အာမခံနှင့် ခရီးစရိတ်' },
      { en: 'Takken (real estate licence) exam support', ja: '宅建資格取得支援', my: 'Takken (အိမ်ခြံမြေ လိုင်စင်) စာမေးပွဲ ကူညီမှု' },
    ],
    postedAt: '2026-11-15',
    open: true,
  },
  {
    slug: 'customer-support-burmese',
    title: { en: 'Customer support (Burmese)', ja: 'カスタマーサポート（ミャンマー語）', my: 'ဖောက်သည် ဝန်ဆောင်မှု (မြန်မာစာ)' },
    location: { en: 'Shinjuku office / hybrid', ja: '新宿オフィス／一部在宅', my: 'Shinjuku ရုံး / အိမ်မှ တစ်စိတ်တစ်ပိုင်း' },
    employment: 'partTime',
    salary: { en: '¥1,300–¥1,600 / hour', ja: '時給1,300〜1,600円', my: 'တစ်နာရီ ¥1,300–¥1,600' },
    languages: ['my', 'ja'],
    summary: {
      en: 'Be the first voice our Burmese-speaking customers hear – explain rooms, costs and next steps in their language.',
      ja: 'ミャンマー語を話すお客様の最初の窓口として、物件・費用・手続きを母国語で案内します。',
      my: 'မြန်မာစကားပြော ဖောက်သည်များအတွက် ပထမဆုံး ဆက်သွယ်ရာ ဖြစ်ပြီး အခန်း၊ ကုန်ကျစရိတ်နှင့် နောက်အဆင့်များကို မြန်မာလို ရှင်းပြပေးရမည်။',
    },
    duties: [
      { en: 'Reply to messages from Burmese-speaking customers', ja: 'ミャンマー語での問い合わせへの返信', my: 'မြန်မာစကားပြော ဖောက်သည်များ၏ မက်ဆေ့ချ်များကို ပြန်ကြားခြင်း' },
      { en: 'Interpret during viewings and contract explanations', ja: '内見・重要事項説明時の通訳', my: 'အခန်းကြည့်ချိန်နှင့် စာချုပ်ရှင်းပြချိန်တွင် စကားပြန်ခြင်း' },
      { en: 'Check translated listing texts', ja: '物件紹介文の翻訳チェック', my: 'ဘာသာပြန်ထားသော အခန်းဖော်ပြချက်များကို စစ်ဆေးခြင်း' },
    ],
    requirements: [
      { en: 'Native Burmese', ja: 'ミャンマー語ネイティブ', my: 'မြန်မာစာ မိခင်ဘာသာ' },
      { en: 'Japanese at JLPT N3 level or above', ja: '日本語能力試験N3程度以上', my: 'ဂျပန်စာ JLPT N3 အဆင့်နှင့်အထက်' },
      { en: '3 days a week or more; students welcome', ja: '週3日以上・留学生歓迎', my: 'တစ်ပတ် ၃ ရက်နှင့်အထက်၊ ကျောင်းသားများ ကြိုဆိုသည်' },
    ],
    benefits: [
      { en: 'Flexible shifts around your classes', ja: '授業に合わせたシフト調整可', my: 'အတန်းချိန်နှင့် ကိုက်ညီအောင် အချိန်ညှိနိုင်' },
      { en: 'Transport allowance', ja: '交通費支給', my: 'ခရီးစရိတ်' },
      { en: 'Path to full-time after graduation', ja: '卒業後の正社員登用あり', my: 'ကျောင်းပြီးလျှင် အမြဲတမ်းဝန်ထမ်း ဖြစ်နိုင်' },
    ],
    postedAt: '2026-11-12',
    open: true,
  },
  {
    slug: 'social-media-marketer',
    title: { en: 'Social media & content marketer', ja: 'SNS・コンテンツマーケター', my: 'ဆိုရှယ်မီဒီယာနှင့် အကြောင်းအရာ စျေးကွက်ရှာဖွေသူ' },
    location: { en: 'Remote (Japan)', ja: 'リモート（日本国内）', my: 'အဝေးမှ (ဂျပန်နိုင်ငံအတွင်း)' },
    employment: 'contract',
    remote: true,
    salary: { en: 'From ¥200,000 / month (by experience)', ja: '月額20万円〜（経験による）', my: 'လစဉ် ¥200,000 မှစ၍ (အတွေ့အကြုံအလိုက်)' },
    languages: ['en', 'ja'],
    summary: {
      en: 'Grow our TikTok, Instagram and Facebook with useful videos and guides about living in Japan.',
      ja: '日本での暮らしに役立つ動画やガイドで、TikTok・Instagram・Facebookを伸ばします。',
      my: 'ဂျပန်တွင် နေထိုင်ခြင်းဆိုင်ရာ အသုံးဝင်သော ဗီဒီယိုနှင့် လမ်းညွှန်များဖြင့် TikTok၊ Instagram၊ Facebook ကို တိုးတက်စေရမည်။',
    },
    duties: [
      { en: 'Plan and post 3–4 short videos a week', ja: '週3〜4本のショート動画の企画・投稿', my: 'တစ်ပတ်လျှင် ဗီဒီယိုတို ၃–၄ ခု စီစဉ်တင်ခြင်း' },
      { en: 'Write area guides for the blog', ja: 'ブログ用エリアガイドの執筆', my: 'ဘလော့ဂ်အတွက် ဒေသလမ်းညွှန်များ ရေးသားခြင်း' },
      { en: 'Report monthly reach and inquiries', ja: '月次のリーチ・問い合わせ数のレポート', my: 'လစဉ် ရောက်ရှိမှုနှင့် မေးမြန်းချက် အစီရင်ခံခြင်း' },
    ],
    requirements: [
      { en: 'A portfolio of social media work', ja: 'SNS運用の実績（ポートフォリオ）', my: 'ဆိုရှယ်မီဒီယာ လုပ်ငန်း နမူနာများ' },
      { en: 'Good English; Japanese a plus', ja: '英語力（日本語ができれば尚可）', my: 'အင်္ဂလိပ်စာ ကောင်းမွန်ရမည်၊ ဂျပန်စာ တတ်လျှင် ပိုကောင်း' },
    ],
    benefits: [
      { en: 'Fully remote, flexible hours', ja: 'フルリモート・時間自由', my: 'အပြည့်အဝ အဝေးမှ၊ အချိန် လွတ်လပ်' },
      { en: 'Contract renewed every 6 months', ja: '6か月ごとの契約更新', my: '၆ လတစ်ကြိမ် စာချုပ် သက်တမ်းတိုး' },
    ],
    postedAt: '2026-11-08',
    open: true,
  },
  {
    slug: 'office-assistant',
    title: { en: 'Office assistant', ja: '一般事務', my: 'ရုံးလက်ထောက်' },
    location: { en: 'Shinjuku office, Tokyo', ja: '東京・新宿オフィス', my: 'တိုကျို၊ Shinjuku ရုံး' },
    employment: 'partTime',
    salary: { en: '¥1,200 / hour', ja: '時給1,200円', my: 'တစ်နာရီ ¥1,200' },
    languages: ['ja'],
    summary: { en: 'Filled – no longer open.', ja: '募集終了', my: 'လူရပြီ' },
    duties: [], requirements: [], benefits: [],
    postedAt: '2026-10-20',
    open: false,
  },
];
