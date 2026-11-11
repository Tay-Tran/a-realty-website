import { describe, expect, it } from 'vitest';
import { makeListing } from '@/test/factories';
import { activeConditions, hasCondition, isNewlyBuilt, monthlyTotal } from './derived';

const NOW = new Date('2026-11-11T00:00:00Z');

describe('derived values', () => {
  it('isNewlyBuilt: within 3 years of now', () => {
    expect(isNewlyBuilt({ builtYear: 2023 }, NOW)).toBe(true);
    expect(isNewlyBuilt({ builtYear: 2026 }, NOW)).toBe(true);
    expect(isNewlyBuilt({ builtYear: 2022 }, NOW)).toBe(false);
  });

  it('hasCondition reads stored flags and derived keys', () => {
    const l = makeListing({
      conditions: { ...makeListing().conditions, petOk: true },
      initialCosts: { ...makeListing().initialCosts, keyMoneyMonths: 0 },
      builtYear: 2024,
    });
    expect(hasCondition(l, 'petOk', NOW)).toBe(true);
    expect(hasCondition(l, 'studentOk', NOW)).toBe(false);
    expect(hasCondition(l, 'noKeyMoney', NOW)).toBe(true);
    expect(hasCondition(l, 'newlyBuilt', NOW)).toBe(true);
  });

  it('activeConditions returns keys in CONDITION_KEYS order', () => {
    const l = makeListing({
      conditions: { ...makeListing().conditions, autoLock: true, noGuarantor: true },
      initialCosts: { ...makeListing().initialCosts, keyMoneyMonths: 0 },
    });
    expect(activeConditions(l, NOW)).toEqual(['foreignerOk', 'noGuarantor', 'autoLock', 'noKeyMoney']);
  });

  it('monthlyTotal = rent + management fee', () => {
    expect(monthlyTotal({ rent: 80000, managementFee: 5000 })).toBe(85000);
  });
});
