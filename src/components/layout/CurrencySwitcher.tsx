'use client';

import { useTranslations } from 'next-intl';
import { CURRENCIES, type Currency } from '@/lib/currency';
import { usePreferences } from '@/components/providers/PreferencesProvider';
import { Picker } from '@/components/ui/Picker';

const LABELS: Record<Currency, string> = { JPY: '¥ JPY', USD: '$ USD', EUR: '€ EUR', VND: '₫ VND' };

export function CurrencySwitcher({ align = 'right' }: { align?: 'left' | 'right' }) {
  const t = useTranslations('common');
  const { currency, setCurrency } = usePreferences();
  return (
    <div title={t('rateNote')}>
      <Picker variant="pill" align={align} allowEmpty={false} label={t('currency')} placeholder={LABELS[currency]}
        value={currency} onChange={(v) => setCurrency(v as Currency)}
        options={CURRENCIES.map((c) => ({ value: c, label: LABELS[c] }))} />
    </div>
  );
}
