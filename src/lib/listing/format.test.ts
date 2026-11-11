import { describe, expect, it } from 'vitest';
import { formatSize, formatYen, pickText } from './format';

describe('format', () => {
  it('pickText falls back to English when a translation is empty', () => {
    expect(pickText({ en: 'Hi', my: '', ja: 'こんにちは' }, 'my')).toBe('Hi');
    expect(pickText({ en: 'Hi', my: 'x', ja: 'こんにちは' }, 'ja')).toBe('こんにちは');
  });
  it('formatYen uses Latin digits for every locale', () => {
    expect(formatYen(85000, 'en')).toBe('¥85,000');
    expect(formatYen(85000, 'my')).toBe('¥85,000');
    expect(formatYen(85000, 'ja')).toMatch(/85,000/);
  });
  it('formatSize', () => expect(formatSize(22.5)).toBe('22.5 m²'));
});
