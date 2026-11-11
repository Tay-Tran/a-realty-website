import { describe, expect, it } from 'vitest';
import { makeListing } from '@/test/factories';
import { activeConditions, bedroomsOf, buildingAge, hasCondition, isNewlyBuilt, monthlyTotal } from './derived';

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

  it('bedroomsOf reads the leading digit of the layout', () => {
    expect(bedroomsOf('1R')).toBe(1);
    expect(bedroomsOf('1LDK')).toBe(1);
    expect(bedroomsOf('2DK')).toBe(2);
    expect(bedroomsOf('3LDK')).toBe(3);
  });

  it('family = 2+ bedrooms, luxury = rent from ¥150,000', () => {
    expect(hasCondition(makeListing({ layout: '2LDK' }), 'family', NOW)).toBe(true);
    expect(hasCondition(makeListing({ layout: '1LDK' }), 'family', NOW)).toBe(false);
    expect(hasCondition(makeListing({ rent: 150000 }), 'luxury', NOW)).toBe(true);
    expect(hasCondition(makeListing({ rent: 149999 }), 'luxury', NOW)).toBe(false);
  });

  it('buildingAge counts whole years since built', () => {
    expect(buildingAge({ builtYear: 2016 }, NOW)).toBe(10);
  });

  it('monthlyTotal = rent + management fee', () => {
    expect(monthlyTotal({ rent: 80000, managementFee: 5000 })).toBe(85000);
  });
});
