'use client';

import { useTranslations } from 'next-intl';
import { CURRENCIES, type Currency } from '@/lib/currency';
import { usePreferences } from '@/components/providers/PreferencesProvider';

const LABELS: Record<Currency, string> = { JPY: '¥ JPY', USD: '$ USD', EUR: '€ EUR', VND: '₫ VND' };

export function CurrencySwitcher({ className = '' }: { className?: string }) {
  const t = useTranslations('common');
  const { currency, setCurrency } = usePreferences();
  return (
    <label className={`relative inline-flex items-center ${className}`} title={t('rateNote')}>
      <span className="sr-only">{t('currency')}</span>
      <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
        className="rounded-full border border-line bg-white py-1.5 pl-3 pr-7 text-sm text-ink">
        {CURRENCIES.map((c) => <option key={c} value={c}>{LABELS[c]}</option>)}
      </select>
    </label>
  );
}
