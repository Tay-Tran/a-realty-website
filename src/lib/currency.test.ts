import { describe, expect, it } from 'vitest';
import { defaultCurrency, formatMoney, isCurrency } from './currency';

describe('currency', () => {
  it('keeps yen formatting for JPY', () => {
    expect(formatMoney(78000, 'JPY', 'en')).toBe('¥78,000');
  });
  it('converts with the fixed reference rates and rounds to whole units', () => {
    expect(formatMoney(78000, 'USD', 'en')).toBe('$500');
    expect(formatMoney(78000, 'EUR', 'en')).toBe('€459');
    expect(formatMoney(78000, 'VND', 'en')).toMatch(/13\.104\.000/);
  });
  it('isCurrency guards stored values', () => {
    expect(isCurrency('USD')).toBe(true);
    expect(isCurrency('BTC')).toBe(false);
    expect(isCurrency(null)).toBe(false);
  });
});

describe('defaultCurrency', () => {
  it('shows English visitors US dollars and keeps yen for Japanese and Burmese', () => {
    expect(defaultCurrency('en')).toBe('USD');
    expect(defaultCurrency('ja')).toBe('JPY');
    expect(defaultCurrency('my')).toBe('JPY');
  });
});
