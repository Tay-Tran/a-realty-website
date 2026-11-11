'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALES, type Locale } from '@/lib/data/types';
import { Picker } from '@/components/ui/Picker';

const LABELS: Record<Locale, string> = { en: 'EN', my: 'မြန်မာ', ja: '日本語' };
/** Each language named in itself, plus its English name as a hint. */
const HINTS: Record<Locale, string> = { en: 'English', my: 'Burmese', ja: 'Japanese' };

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('lang');

  return (
    <Picker variant="pill" align="right" allowEmpty={false} label={t('label')} placeholder={LABELS[locale]}
      value={locale}
      onChange={(l) => router.replace(`${pathname}${window.location.search}`, { locale: l as Locale })}
      options={LOCALES.map((l) => ({ value: l, label: LABELS[l], hint: HINTS[l] }))} />
  );
}
