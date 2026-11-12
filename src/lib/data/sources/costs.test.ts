import { describe, expect, it } from 'vitest';
import { calcInitialCost } from '@/lib/listing/initial-cost';
import { monthlyTotal } from '@/lib/listing/derived';
import rawSnapshot from './snapshot.json';
import { parseJkTerms } from './costs';
import { SOURCE_LISTINGS } from './index';
import type { Snapshot } from './types';

const snapshot = rawSnapshot as Snapshot;
const byCode = (code: string) => SOURCE_LISTINGS.find((l) => l.code === code)!;
const JK_TERMS = '◇ 保証会社加入必須 (家賃引落し必須) ◇\n【初回保証料】総賃料の85％ \n【手数料】総賃料の1.3％ ※属性により違いあり\n【保証会社更新料】10,000円/1年毎\n【火災保険】21,500〜22,000円/2年毎\n【カギ交換】任意\n・ユーナインタイプ：16,500円(税込)\n・ディンプルタイプ：27,000円(税込)';

describe('Leopalace21 costs', () => {
  it('required items add up to Leopalace21\'s own total for every room', () => {
    snapshot.leopalace.forEach((room, i) => {
      const listing = SOURCE_LISTINGS[i];
      const required = listing.costs!.initial.reduce((s, c) => s + c.amount, 0);
      expect(required, listing.code).toBe(room.cost.required.totalFee);
    });
  });

  it('L5001: 255,600 yen from Leopalace21 plus our agency fee (1 month + tax)', () => {
    const l = byCode('L5001');
    const { items, total, optional, toConfirm } = calcInitialCost(l);
    expect(items.map((i) => [i.key, i.amount])).toEqual([
      ['advanceRent', 82050], ['deposit', 0], ['keyMoney', 75000], ['guaranteeFee', 82050], ['keyExchange', 16500], ['brokerage', 82500],
    ]);
    expect(total).toBe(255600 + 82500);
    expect(optional.map((o) => o.key)).toEqual(['insurance', 'cleaning', 'residentSupport', 'antibacterial']);
    expect(toConfirm).toEqual([]);
    expect(monthlyTotal(l)).toBe(75000 + 6500 + 550);
  });
});

describe('J&K costs', () => {
  it('reads the guarantor, insurance and key terms', () => {
    expect(parseJkTerms(JK_TERMS)).toEqual({
      guaranteePct: 85, monthlyFeePct: 1.3, insurance: { min: 21500, max: 22000, years: 2 }, keyExchange: 16500,
    });
    expect(parseJkTerms(null)).toEqual({ guaranteePct: undefined, monthlyFeePct: undefined, insurance: undefined, keyExchange: undefined });
  });

  it('J6001: guarantee is 85% of rent + fee + support fee; cleaning is left to confirm', () => {
    const l = byCode('J6001');
    expect(monthlyTotal(l)).toBe(77000 + 3000 + 1100);
    const { items, optional, toConfirm } = calcInitialCost(l);
    expect(items.find((i) => i.key === 'guaranteeFee')?.amount).toBe(Math.round(81100 * 0.85));
    expect(items.find((i) => i.key === 'insurance')?.amount).toBe(22000);
    expect(items.find((i) => i.key === 'brokerage')?.amount).toBe(84700);
    expect(optional).toEqual([expect.objectContaining({ key: 'keyExchange', amount: 16500 })]);
    expect(toConfirm).toEqual(['cleaning']);
  });

  it('adds a room\'s own fixed monthly fee (固定水道) to its monthly total', () => {
    const withWater = SOURCE_LISTINGS.filter((l) => l.costs?.monthlyExtras.some((c) => c.label?.includes('水道')));
    expect(withWater.length).toBeGreaterThan(0);
    for (const l of withWater) expect(monthlyTotal(l), l.code).toBe(l.rent + l.managementFee + 1100 + 2200);
  });

  it('every J&K room has a guarantee and insurance amount', () => {
    for (const l of SOURCE_LISTINGS.filter((x) => x.source?.name === 'jk')) {
      const keys = l.costs!.initial.map((c) => c.key);
      expect(keys, l.code).toContain('guaranteeFee');
      expect(keys, l.code).toContain('insurance');
    }
  });
});
