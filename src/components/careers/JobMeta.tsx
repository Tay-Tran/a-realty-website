import { useLocale, useTranslations } from 'next-intl';
import type { Job, Locale } from '@/lib/data/types';
import { pickText } from '@/lib/listing/format';
import { PinIcon } from '@/components/ui/icons';

const KNOWN_LANGS = ['en', 'ja', 'my', 'vi'] as const;

/** Employment type, place, salary and languages of a job – shared by the list and the job page. */
export function JobMeta({ job, className = '' }: { job: Job; className?: string }) {
  const t = useTranslations('careers');
  const locale = useLocale() as Locale;
  const langs = job.languages
    .filter((l): l is (typeof KNOWN_LANGS)[number] => (KNOWN_LANGS as readonly string[]).includes(l))
    .map((l) => t(`lang.${l}`));
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft ${className}`}>
      <span className="rounded-full bg-tint px-2.5 py-0.5 text-xs font-semibold text-accent-dark">{t(`employment.${job.employment}`)}</span>
      <span className="inline-flex items-center gap-1"><PinIcon className="h-4 w-4 text-sky" />{pickText(job.location, locale)}</span>
      <span className="font-medium text-ink">{pickText(job.salary, locale)}</span>
      {langs.length > 0 && <span>{t('languages')}: {langs.join(', ')}</span>}
    </div>
  );
}

export function formatPosted(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'my' ? 'en' : locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Tokyo' })
    .format(new Date(`${date}T00:00:00+09:00`));
}
