import { describe, expect, it } from 'vitest';
import { buildAlternates, isIndexable } from './seo';

describe('seo', () => {
  it('builds canonical and hreflang alternates', () => {
    expect(buildAlternates('ja', '/rent')).toEqual({
      canonical: 'http://localhost:3000/ja/rent',
      languages: {
        en: 'http://localhost:3000/en/rent',
        my: 'http://localhost:3000/my/rent',
        ja: 'http://localhost:3000/ja/rent',
        'x-default': 'http://localhost:3000/en/rent',
      },
    });
  });
  it('is not indexable unless NEXT_PUBLIC_SITE_ENV=production', () => {
    expect(isIndexable()).toBe(false);
  });
});
