import type { Locale, LocalizedText } from '@/lib/data/types';

// Burmese readers in Japan see yen amounts with Latin digits, so `my` formats like `en`.
const NUMBER_LOCALE: Record<Locale, string> = { en: 'en-US', my: 'en-US', ja: 'ja-JP' };

export function pickText(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.en;
}

export function formatYen(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
    style: 'currency', currency: 'JPY', maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSize(m2: number): string {
  return `${m2} m²`;
}
