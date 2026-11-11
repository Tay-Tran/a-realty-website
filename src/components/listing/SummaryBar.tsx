import { useLocale, useTranslations } from 'next-intl';
import { site } from '@/config/site';
import type { Area, Listing, Locale } from '@/lib/data/types';
import { monthlyTotal } from '@/lib/listing/derived';
import { formatSize, pickText } from '@/lib/listing/format';
import { Container } from '@/components/ui/Container';
import { PhoneIcon, PinIcon } from '@/components/ui/icons';
import { Price } from '@/components/ui/Price';

/** Sticky bar under the header: name, monthly total, inquiry/call, and section tabs. */
export function SummaryBar({ listing, area }: { listing: Listing; area?: Area }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const rented = listing.status === 'rented';
  const tabs = [
    ['overview', t('listing.overview')],
    ['amenities', t('listing.amenities')],
    ['details', t('listing.details')],
    ['map', t('listing.map')],
  ] as const;
  return (
    <div className="sticky top-16 z-30 border-y border-line bg-white/95 shadow-sm backdrop-blur">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="hidden min-w-0 sm:block">
          {area && <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky"><PinIcon className="h-3.5 w-3.5" />{pickText(area.name, locale)}, {t('common.tokyo')}</span>}
          <p className="truncate font-bold text-ink">{pickText(listing.title, locale)}</p>
          <p className="text-xs text-ink-soft">{listing.layout} · {formatSize(listing.sizeM2)} · {t('common.code', { code: listing.code })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-ink-soft">{t('listing.monthlyTotal')}</p>
            <p className="text-xl font-bold text-sky"><Price yen={monthlyTotal(listing)} /></p>
          </div>
          {!rented && (
            <a href="#inquiry" className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark">
              {t('listing.inquire')}
            </a>
          )}
          <a href={site.contact.phoneHref} className="hidden items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm hover:border-accent sm:inline-flex">
            <PhoneIcon className="h-4 w-4 text-sky" />{site.contact.phoneDisplay}
          </a>
        </div>
      </Container>
      <Container>
        <nav className="-mb-px flex gap-6 overflow-x-auto text-sm">
          {tabs.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap border-b-2 border-transparent pb-2 text-ink-soft hover:border-accent hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
