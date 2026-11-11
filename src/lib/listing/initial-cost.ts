import type { Listing } from '@/lib/data/types';
import { monthlyTotal } from './derived';

export type InitialCostKey =
  | 'advanceRent' | 'deposit' | 'keyMoney' | 'brokerage'
  | 'guaranteeFee' | 'insurance' | 'keyExchange' | 'cleaning';

export interface InitialCostItem { key: InitialCostKey; amount: number; months?: number }

export function calcInitialCost(
  listing: Pick<Listing, 'rent' | 'managementFee' | 'initialCosts'>,
): { items: InitialCostItem[]; total: number } {
  const { rent, initialCosts: c } = listing;
  const byMonths = (key: InitialCostKey, months: number): InitialCostItem => ({
    key, amount: Math.round(rent * months), months,
  });
  const items: InitialCostItem[] = [
    { key: 'advanceRent', amount: monthlyTotal(listing) },
    byMonths('deposit', c.depositMonths),
    byMonths('keyMoney', c.keyMoneyMonths),
    byMonths('brokerage', c.brokerageMonths),
    { key: 'guaranteeFee', amount: c.guaranteeFee },
    { key: 'insurance', amount: c.insurance },
    { key: 'keyExchange', amount: c.keyExchange },
    { key: 'cleaning', amount: c.cleaning },
  ];
  return { items, total: items.reduce((sum, i) => sum + i.amount, 0) };
}
