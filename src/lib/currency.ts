import type { Locale } from '@/lib/data/types';
import { formatYen } from '@/lib/listing/format';

export const CURRENCY_KEY = 'kurashi:currency';
export const CURRENCIES = ['JPY', 'USD', 'EUR', 'VND'] as const;
export type Currency = (typeof CURRENCIES)[number];

/**
 * Reference rates (2026-11-11), multiplied with an amount in yen.
 * 1 USD = ¥156 (rate used in the team's quote), 1 EUR ≈ ¥170, ¥1 ≈ 168₫.
 * Production should fetch live rates.
 */
export const YEN_TO: Record<Currency, number> = { JPY: 1, USD: 1 / 156, EUR: 1 / 170, VND: 168 };

const FORMAT_LOCALE: Record<Exclude<Currency, 'JPY'>, string> = { USD: 'en-US', EUR: 'en-US', VND: 'vi-VN' };

export function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && (CURRENCIES as readonly string[]).includes(value);
}

export function formatMoney(yen: number, currency: Currency, locale: Locale): string {
  if (currency === 'JPY') return formatYen(yen, locale);
  return new Intl.NumberFormat(FORMAT_LOCALE[currency], {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(Math.round(yen * YEN_TO[currency]));
}

/** Currency shown until the visitor picks one: English readers think in dollars, the others in yen. */
const LOCALE_CURRENCY: Record<Locale, Currency> = { en: 'USD', ja: 'JPY', my: 'JPY' };

export function defaultCurrency(locale: Locale): Currency {
  return LOCALE_CURRENCY[locale];
}
