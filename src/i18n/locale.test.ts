import { describe, expect, it } from 'vitest';
import { isLocale } from './locale';

describe('isLocale', () => {
  it('accepts only the supported locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('my')).toBe(true);
    expect(isLocale('ja')).toBe(true);
    // Static-file requests reach the [locale] segment when no file exists (e.g. /favicon.ico).
    expect(isLocale('favicon.ico')).toBe(false);
    expect(isLocale('.well-known')).toBe(false);
    expect(isLocale('fr')).toBe(false);
  });
});
