import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { serializeFilters, type Filters } from '@/lib/listing/filters';

export function Pagination({ filters, page, pageCount }: { filters: Filters; page: number; pageCount: number }) {
  const t = useTranslations('search');
  if (pageCount <= 1) return null;
  const href = (p: number) => {
    const qs = serializeFilters({ ...filters, page: p });
    return qs ? `/rent?${qs}` : '/rent';
  };
  const btn = 'rounded-full border border-line bg-white px-4 py-2 text-sm';
  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label={t('pageOf', { page, pageCount })}>
      {page > 1 ? <Link href={href(page - 1)} className={btn}>← {t('prev')}</Link> : <span className={`${btn} opacity-40`}>← {t('prev')}</span>}
      <span className="text-sm text-ink-soft">{t('pageOf', { page, pageCount })}</span>
      {page < pageCount ? <Link href={href(page + 1)} className={btn}>{t('next')} →</Link> : <span className={`${btn} opacity-40`}>{t('next')} →</span>}
    </nav>
  );
}
