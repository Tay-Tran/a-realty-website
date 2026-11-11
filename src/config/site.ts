export type SiteEnv = 'production' | 'staging';

export const site = {
  name: 'Kurashi Homes',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  env: (process.env.NEXT_PUBLIC_SITE_ENV === 'production' ? 'production' : 'staging') as SiteEnv,
  colors: { ink: '#1f2a44', accent: '#2272c9', paper: '#f3f8fd' },
  contact: {
    phoneDisplay: '03-0000-0000',
    phoneHref: 'tel:+81300000000',
    line: 'https://line.me/R/ti/p/@kurashi-demo',
    /** LINE Official Account ID – used to open a chat with the message pre-filled. */
    lineId: '@kurashi-demo',
    whatsapp: 'https://wa.me/810000000000',
    messenger: 'https://m.me/kurashi.demo',
    email: 'hello@example.com',
  },
};
