import { useTranslations } from 'next-intl';
import type { Listing } from '@/lib/data/types';
import { bedroomsOf } from '@/lib/listing/derived';
import { formatSize } from '@/lib/listing/format';

/** Small 4-cell table: layout · size · floor · bedrooms. */
export function ListingStats({ listing, className = '' }: { listing: Listing; className?: string }) {
  const t = useTranslations('listing');
  const cells: [string, string][] = [
    [t('layout'), listing.layout],
    [t('size'), formatSize(listing.sizeM2)],
    [t('floor'), t('floorValue', { floor: listing.floor })],
    [t('bedrooms'), String(bedroomsOf(listing.layout))],
  ];
  return (
    // 2×2 in narrow cards (phone carousels), one row of 4 once there is room – read from the
    // card's own width, so labels like "Bedrooms" never get cut off.
    <div className={`@container ${className}`}>
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-line text-center @[18rem]:grid-cols-4">
      {cells.map(([label, value]) => (
        <div key={label} className="bg-paper px-1 py-2">
          <dt className="line-clamp-2 text-[11px] leading-tight text-ink-soft">{label}</dt>
          <dd className="text-sm font-semibold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
    </div>
  );
}
