import { describe, expect, it } from 'vitest';
import { parseFavorites, toggleFavorite } from './favorites';

describe('favorites', () => {
  it('parses stored JSON, keeping only valid unique listing codes', () => {
    expect(parseFavorites('["A1001","a1002","A1001","bad",3]')).toEqual(['A1001', 'A1002']);
  });
  it('returns an empty list for missing or broken data', () => {
    expect(parseFavorites(null)).toEqual([]);
    expect(parseFavorites('{not json')).toEqual([]);
    expect(parseFavorites('{"a":1}')).toEqual([]);
  });
  it('toggles a code on and off', () => {
    expect(toggleFavorite(['A1001'], 'A1002')).toEqual(['A1001', 'A1002']);
    expect(toggleFavorite(['A1001', 'A1002'], 'A1001')).toEqual(['A1002']);
  });
});
