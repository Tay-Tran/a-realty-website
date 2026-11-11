import { site } from '@/config/site';
import { LOCALES, type Locale } from '@/lib/data/types';

export function localeUrl(locale: Locale, path = ''): string {
  return `${site.url}/${locale}${path}`;
}

export function buildAlternates(locale: Locale, path = '') {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localeUrl(l, path);
  languages['x-default'] = localeUrl('en', path);
  return { canonical: localeUrl(locale, path), languages };
}

/** Only the production deployment may be indexed; previews stay noindex. */
export function isIndexable(): boolean {
  return site.env === 'production';
}
