'use client';

import { useLocale } from 'next-intl';
import { formatMoney } from '@/lib/currency';
import type { Locale } from '@/lib/data/types';
import { usePreferences } from '@/components/providers/PreferencesProvider';

/** An amount stored in yen, shown in the visitor's chosen currency. */
export function Price({ yen, className }: { yen: number; className?: string }) {
  const { currency } = usePreferences();
  const locale = useLocale() as Locale;
  return <span className={className}>{formatMoney(yen, currency, locale)}</span>;
}
