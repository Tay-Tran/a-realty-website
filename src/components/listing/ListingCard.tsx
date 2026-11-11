import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Listing, Locale, Station } from '@/lib/data/types';
import { activeConditions } from '@/lib/listing/derived';
import { formatSize, formatYen, pickText } from '@/lib/listing/format';
import { listingPath } from '@/lib/listing/paths';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from './StatusBadge';

export function ListingCard({ listing, stations }: { listing: Listing; stations: Record<string, Station> }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const nearest = listing.stations[0];
  const station = stations[nearest.stationSlug];
  const badges = activeConditions(listing).filter((k) => k !== 'foreignerOk').slice(0, 3);
  const title = pickText(listing.title, locale);

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:shadow-md">
      <Link href={listingPath(listing)} className="block">
        <div className="relative aspect-[4/3] bg-ink/5">
          <Image src={listing.images[0]} alt={title} fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]" />
          {listing.status !== 'available' && <div className="absolute left-3 top-3"><StatusBadge status={listing.status} /></div>}
        </div>
        <div className="space-y-2 p-4">
          <p className="text-xl font-bold text-ink">
            {formatYen(listing.rent, locale)}<span className="text-sm font-normal text-ink-soft">{t('common.perMonth')}</span>
          </p>
          <p className="text-xs text-ink-soft">{t('listing.managementFee')} {formatYen(listing.managementFee, locale)}</p>
          <h3 className="line-clamp-2 font-medium text-ink">{title}</h3>
          <p className="text-sm text-ink-soft">
            {listing.layout} · {formatSize(listing.sizeM2)} · {t('common.stationName', { name: station ? pickText(station.name, locale) : '' })} {t('common.minWalk', { minutes: nearest.walkMinutes })}
          </p>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">{badges.map((k) => <Badge key={k} tone="accent">{t(`conditions.${k}`)}</Badge>)}</div>
          )}
        </div>
      </Link>
    </article>
  );
}
