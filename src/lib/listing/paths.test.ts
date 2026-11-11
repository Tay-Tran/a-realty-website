import { describe, expect, it } from 'vitest';
import { codeFromSlug, listingPath } from './paths';

describe('paths', () => {
  it('builds the detail path', () => {
    expect(listingPath({ areaSlug: 'shinjuku', slug: '1k-shin-okubo-a1001' })).toBe('/rent/shinjuku/1k-shin-okubo-a1001');
  });
  it('extracts the code from the slug', () => {
    expect(codeFromSlug('1k-shin-okubo-a1001')).toBe('A1001');
    expect(codeFromSlug('a1001')).toBe('A1001');
    expect(codeFromSlug('')).toBeNull();
    expect(codeFromSlug('bad slug!')).toBeNull();
  });
});
