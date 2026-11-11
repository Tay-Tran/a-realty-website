import { useLocale, useTranslations } from 'next-intl';
import { site } from '@/config/site';
import type { Listing, Locale } from '@/lib/data/types';
import { monthlyTotal } from '@/lib/listing/derived';
import { formatYen } from '@/lib/listing/format';
import { calcInitialCost } from '@/lib/listing/initial-cost';
import { InquiryForm } from '@/components/forms/InquiryForm';

export function PriceCard({ listing }: { listing: Listing }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const rented = listing.status === 'rented';
  const contact = [
    { href: site.contact.line, label: t('contact.line'), className: 'bg-[#06c755]' },
    { href: site.contact.whatsapp, label: t('contact.whatsapp'), className: 'bg-[#25d366]' },
    { href: site.contact.messenger, label: t('contact.messenger'), className: 'bg-[#0084ff]' },
  ];
  return (
    <div className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div>
        <p className="text-3xl font-bold">{formatYen(listing.rent, locale)}<span className="text-base font-normal text-ink-soft">{t('common.perMonth')}</span></p>
        <p className="text-sm text-ink-soft">{t('listing.managementFee')} {formatYen(listing.managementFee, locale)}</p>
        <p className="mt-2 text-sm">{t('listing.monthlyTotal')}: <strong>{formatYen(monthlyTotal(listing), locale)}</strong></p>
        <p className="text-sm">{t('listing.initialCostTitle')}: <strong>{formatYen(calcInitialCost(listing).total, locale)}</strong></p>
      </div>
      {!rented && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {contact.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                className={`rounded-lg py-2 text-center text-xs font-semibold text-white ${c.className}`}>{c.label}</a>
            ))}
          </div>
          <div>
            <p className="mb-2 font-semibold">{t('listing.inquire')}</p>
            <InquiryForm listingCode={listing.code} />
          </div>
        </>
      )}
    </div>
  );
}
