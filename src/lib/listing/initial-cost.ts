import { site } from '@/config/site';
import type { CostKey, CostLine, Listing } from '@/lib/data/types';
import { monthlyTotal } from './derived';

export type InitialCostKey = CostKey;
export type InitialCostItem = CostLine;

export interface InitialCost {
  items: CostLine[];
  total: number;
  /** Optional services, not in the total. */
  optional: CostLine[];
  /** Items the source does not state. */
  toConfirm: CostKey[];
}

const sum = (items: CostLine[]) => items.reduce((s, i) => s + i.amount, 0);

export function calcInitialCost(
  listing: Pick<Listing, 'rent' | 'managementFee' | 'initialCosts' | 'costs'>,
): InitialCost {
  const { rent, initialCosts: c, costs } = listing;

  // Rooms from a listing site: the source's own items, plus our agency fee.
  if (costs) {
    const { months, taxRate } = site.agencyFee;
    const agency: CostLine = {
      key: 'brokerage', amount: Math.round(rent * months * (1 + taxRate)), months,
      note: { en: '+ consumption tax', my: '+ consumption tax', ja: '＋消費税' },
    };
    const items = [...costs.initial, agency];
    return { items, total: sum(items), optional: costs.optional, toConfirm: costs.toConfirm };
  }

  // Sample rooms: estimated from the standard terms.
  const byMonths = (key: CostKey, m: number): CostLine => ({ key, amount: Math.round(rent * m), months: m });
  const items: CostLine[] = [
    { key: 'advanceRent', amount: monthlyTotal(listing) },
    byMonths('deposit', c.depositMonths),
    byMonths('keyMoney', c.keyMoneyMonths),
    byMonths('brokerage', c.brokerageMonths),
    { key: 'guaranteeFee', amount: c.guaranteeFee },
    { key: 'insurance', amount: c.insurance },
    { key: 'keyExchange', amount: c.keyExchange },
    { key: 'cleaning', amount: c.cleaning },
  ];
  return { items, total: sum(items), optional: [], toConfirm: [] };
}
