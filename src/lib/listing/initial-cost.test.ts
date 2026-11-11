import { describe, expect, it } from 'vitest';
import { makeListing } from '@/test/factories';
import { calcInitialCost } from './initial-cost';

describe('calcInitialCost', () => {
  it('lists every line item in a fixed order and sums the total', () => {
    const { items, total } = calcInitialCost(makeListing());
    expect(items).toEqual([
      { key: 'advanceRent', amount: 85000 },
      { key: 'deposit', amount: 80000, months: 1 },
      { key: 'keyMoney', amount: 80000, months: 1 },
      { key: 'brokerage', amount: 88000, months: 1.1 },
      { key: 'guaranteeFee', amount: 40000 },
      { key: 'insurance', amount: 18000 },
      { key: 'keyExchange', amount: 16500 },
      { key: 'cleaning', amount: 33000 },
    ]);
    expect(total).toBe(440500);
  });

  it('keeps zero items so the UI can show "free"', () => {
    const l = makeListing({ initialCosts: { ...makeListing().initialCosts, keyMoneyMonths: 0, depositMonths: 0 } });
    const { items, total } = calcInitialCost(l);
    expect(items.find((i) => i.key === 'keyMoney')).toEqual({ key: 'keyMoney', amount: 0, months: 0 });
    expect(items.find((i) => i.key === 'deposit')?.amount).toBe(0);
    expect(total).toBe(440500 - 160000);
  });

  it('rounds month-based amounts to whole yen', () => {
    const l = makeListing({ rent: 77777 });
    const brokerage = calcInitialCost(l).items.find((i) => i.key === 'brokerage');
    expect(brokerage?.amount).toBe(85555);
  });
});
