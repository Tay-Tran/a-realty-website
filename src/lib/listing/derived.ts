import { CONDITION_KEYS, type ConditionKey, type Layout, type Listing } from '@/lib/data/types';

export const NEWLY_BUILT_YEARS = 3;
export const FAMILY_MIN_BEDROOMS = 2;
export const LUXURY_MIN_RENT = 150000;

/** Japanese layouts start with the number of rooms: 1R, 1K, 2DK, 3LDK… */
export function bedroomsOf(layout: Layout): number {
  return Number.parseInt(layout, 10);
}

export function buildingAge(listing: Pick<Listing, 'builtYear'>, now: Date = new Date()): number {
  return now.getFullYear() - listing.builtYear;
}

export function isNewlyBuilt(listing: Pick<Listing, 'builtYear'>, now: Date = new Date()): boolean {
  return buildingAge(listing, now) <= NEWLY_BUILT_YEARS;
}

export function hasCondition(listing: Listing, key: ConditionKey, now: Date = new Date()): boolean {
  switch (key) {
    case 'noKeyMoney': return listing.initialCosts.keyMoneyMonths === 0;
    case 'newlyBuilt': return isNewlyBuilt(listing, now);
    case 'family': return bedroomsOf(listing.layout) >= FAMILY_MIN_BEDROOMS;
    case 'luxury': return listing.rent >= LUXURY_MIN_RENT;
    default: return listing.conditions[key];
  }
}

export function activeConditions(listing: Listing, now: Date = new Date()): ConditionKey[] {
  return CONDITION_KEYS.filter((key) => hasCondition(listing, key, now));
}

export function monthlyTotal(listing: Pick<Listing, 'rent' | 'managementFee'>): number {
  return listing.rent + listing.managementFee;
}
