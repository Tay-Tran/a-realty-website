import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Area, Line, Listing, Locale, Station } from '@/lib/data/types';
import { activeConditions } from '@/lib/listing/derived';
import { pickText } from '@/lib/listing/format';
import { listingPath } from '@/lib/listing/paths';
import { PinIcon, TrainIcon } from '@/components/ui/icons';
import { Price } from '@/components/ui/Price';
import { FavoriteButton } from './FavoriteButton';
import { FloorPlan } from './FloorPlan';
import { ListingStats } from './ListingStats';
import { StatusBadge } from './StatusBadge';

/** Horizontal result card for the search page, laid out like the reference: photos | details | price. */
export function ListingRow({ listing, stations, areas, lines }: {
  listing: Listing; stations: Record<string, Station>; areas: Record<string, Area>; lines: Record<string, Line>;
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const title = pickText(listing.title, locale);
  const area = areas[listing.areaSlug];
  const href = listingPath(listing);
  const badges = activeConditions(listing).filter((k) => k !== 'foreignerOk');

  return (
    <article className="grid gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:shadow-md md:grid-cols-[240px_1fr_auto]">
      <div>
        <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-ink/5">
          <Image src={listing.images[0]} alt={title} fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover" />
          {listing.status !== 'available' && <span className="absolute left-2 top-2"><StatusBadge status={listing.status} /></span>}
          <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-accent-dark shadow-sm">
            {t('hero.tabRent')}
          </span>
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

      <div className="min-w-0 space-y-2.5 md:pr-2">
        {area && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            <PinIcon className="h-3.5 w-3.5" />{pickText(area.name, locale)}, {t('common.tokyo')}
          </span>
        )}
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-ink">
          <Link href={href} className="hover:text-accent">{title}</Link>
        </h3>
        <ul className="space-y-1 text-sm text-ink-soft">
          {listing.stations.slice(0, 2).map((s) => {
            const st = stations[s.stationSlug];
            const line = st ? lines[st.lineSlugs[0]] : undefined;
            return (
              <li key={s.stationSlug} className="flex items-center gap-2">
                <TrainIcon className="h-4 w-4 shrink-0 text-ink-soft/70" />
                <span className="truncate">
                  {line && <>{pickText(line.name, locale)}, </>}
                  {st ? pickText(st.name, locale) : s.stationSlug} · {t('common.minWalk', { minutes: s.walkMinutes })}
                </span>
              </li>
            );
          })}
        </ul>
        <ListingStats listing={listing} className="max-w-md" />
        {badges.length > 0 && (
          // One row like the reference; extra tags scroll sideways instead of making the card taller.
          <div className="flex max-w-md gap-1.5 overflow-x-auto whitespace-nowrap pb-0.5 [mask-image:linear-gradient(to_right,black_88%,transparent)] [scrollbar-width:none]">
            {badges.map((k) => <span key={k} className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-xs text-ink">{t(`conditions.${k}`)}</span>)}
          </div>
        )}
      </div>

      <div className="flex flex-row items-end justify-between gap-3 md:flex-col md:items-end md:justify-between">
        <FavoriteButton code={listing.code} className="order-last md:order-first" />
        <div className="md:text-right">
          <p className="text-2xl font-bold text-accent"><Price yen={listing.rent} /></p>
          <p className="text-xs text-ink-soft">{t('listing.managementFee')} <Price yen={listing.managementFee} /></p>
        </div>
        <Link href={href} className="inline-block whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent">
          {t('common.viewDetails')}
        </Link>
      </div>
    </article>
  );
}
