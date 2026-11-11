import { CONDITION_KEYS, type ConditionKey, type Listing } from '@/lib/data/types';

export const NEWLY_BUILT_YEARS = 3;

export function isNewlyBuilt(listing: Pick<Listing, 'builtYear'>, now: Date = new Date()): boolean {
  return now.getFullYear() - listing.builtYear <= NEWLY_BUILT_YEARS;
}

export function hasCondition(listing: Listing, key: ConditionKey, now: Date = new Date()): boolean {
  if (key === 'noKeyMoney') return listing.initialCosts.keyMoneyMonths === 0;
  if (key === 'newlyBuilt') return isNewlyBuilt(listing, now);
  return listing.conditions[key];
}

export function activeConditions(listing: Listing, now: Date = new Date()): ConditionKey[] {
  return CONDITION_KEYS.filter((key) => hasCondition(listing, key, now));
}

export function monthlyTotal(listing: Pick<Listing, 'rent' | 'managementFee'>): number {
  return listing.rent + listing.managementFee;
}
