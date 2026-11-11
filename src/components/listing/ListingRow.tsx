import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Area, Listing, Locale, Station } from '@/lib/data/types';
import { activeConditions } from '@/lib/listing/derived';
import { pickText } from '@/lib/listing/format';
import { listingPath } from '@/lib/listing/paths';
import { Price } from '@/components/ui/Price';
import { FavoriteButton } from './FavoriteButton';
import { FloorPlan } from './FloorPlan';
import { ListingStats } from './ListingStats';
import { StatusBadge } from './StatusBadge';

/** Horizontal result card for the search page: photos | details | price. */
export function ListingRow({ listing, stations, areas }: {
  listing: Listing; stations: Record<string, Station>; areas: Record<string, Area>;
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const title = pickText(listing.title, locale);
  const area = areas[listing.areaSlug];
  const href = listingPath(listing);
  const badges = activeConditions(listing).filter((k) => k !== 'foreignerOk');

  return (
    <article className="grid gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm md:grid-cols-[240px_1fr_auto]">
      <div>
        <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-ink/5">
          <Image src={listing.images[0]} alt={title} fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover" />
          {listing.status !== 'available' && <span className="absolute left-2 top-2"><StatusBadge status={listing.status} /></span>}
        </Link>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border border-line bg-white p-1"
            title={t('floorPlan.title')}>
            {listing.floorPlan
              ? <Image src={listing.floorPlan} alt={t('floorPlan.title')} fill sizes="80px" className="object-contain" />
              : <FloorPlan layout={listing.layout} labels={false} className="h-full w-auto" />}
          </div>
          {listing.images.slice(1, 3).map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink/5">
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 space-y-3">
        {area && (
          <span className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">
            <span aria-hidden>◉</span>{pickText(area.name, locale)}
          </span>
        )}
        <h3 className="text-lg font-bold text-ink"><Link href={href} className="hover:text-accent">{title}</Link></h3>
        <ul className="space-y-0.5 text-sm text-ink-soft">
          {listing.stations.slice(0, 2).map((s) => {
            const st = stations[s.stationSlug];
            return (
              <li key={s.stationSlug}>
                <span aria-hidden>🚉 </span>
                {t('common.stationName', { name: st ? pickText(st.name, locale) : s.stationSlug })} · {t('common.minWalk', { minutes: s.walkMinutes })}
              </li>
            );
          })}
        </ul>
        <ListingStats listing={listing} className="max-w-md" />
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((k) => <span key={k} className="rounded-full bg-paper px-2.5 py-0.5 text-xs text-ink">{t(`conditions.${k}`)}</span>)}
          </div>
        )}
      </div>

      <div className="flex flex-row items-end justify-between gap-3 md:flex-col md:items-end md:justify-between">
        <FavoriteButton code={listing.code} className="order-last md:order-first" />
        <div className="md:text-right">
          <p className="text-2xl font-bold text-accent"><Price yen={listing.rent} /></p>
          <p className="text-xs text-ink-soft">{t('listing.managementFee')} <Price yen={listing.managementFee} /></p>
          <Link href={href} className="mt-3 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent">
            {t('common.viewDetails')}
          </Link>
        </div>
      </div>
    </article>
  );
}
