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
    <dl className={`grid grid-cols-4 divide-x divide-line rounded-xl bg-paper text-center ${className}`}>
      {cells.map(([label, value]) => (
        <div key={label} className="px-1 py-2">
          <dt className="truncate text-[11px] text-ink-soft">{label}</dt>
          <dd className="text-sm font-semibold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
