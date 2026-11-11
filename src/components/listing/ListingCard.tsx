import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Listing, Locale, Station } from '@/lib/data/types';
import { pickText } from '@/lib/listing/format';
import { listingPath } from '@/lib/listing/paths';
import { Price } from '@/components/ui/Price';
import { FavoriteButton } from './FavoriteButton';
import { ListingStats } from './ListingStats';
import { StatusBadge } from './StatusBadge';

/** Vertical card for grids and carousels (home, similar listings, favorites). */
export function ListingCard({ listing, stations }: { listing: Listing; stations: Record<string, Station> }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const nearest = listing.stations[0];
  const station = stations[nearest.stationSlug];
  const title = pickText(listing.title, locale);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] bg-ink/5">
        <Image src={listing.images[0]} alt={title} fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]" />
        {listing.status !== 'available' && <div className="absolute left-3 top-3"><StatusBadge status={listing.status} /></div>}
        <FavoriteButton code={listing.code} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-semibold text-ink">
          <Link href={listingPath(listing)} className="after:absolute after:inset-0">{title}</Link>
        </h3>
        <p className="text-sm text-ink-soft">
          {t('common.stationName', { name: station ? pickText(station.name, locale) : '' })} · {t('common.minWalk', { minutes: nearest.walkMinutes })}
        </p>
        <ListingStats listing={listing} />
        <p className="mt-auto pt-1 text-xl font-bold text-accent">
          <Price yen={listing.rent} /><span className="text-sm font-normal text-ink-soft">{t('common.perMonth')}</span>
        </p>
      </div>
    </article>
  );
}
