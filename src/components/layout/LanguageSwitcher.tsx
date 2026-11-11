'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALES, type Locale } from '@/lib/data/types';

const LABELS: Record<Locale, string> = { en: 'EN', my: 'မြန်မာ', ja: '日本語' };

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('lang');

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t('label')}</span>
      <select
        value={locale}
        onChange={(e) => router.replace(`${pathname}${window.location.search}`, { locale: e.target.value as Locale })}
        className="rounded-full border border-line bg-white py-1.5 pl-3 pr-7 text-sm text-ink"
      >
        {LOCALES.map((l) => <option key={l} value={l}>{LABELS[l]}</option>)}
      </select>
    </label>
  );
}
