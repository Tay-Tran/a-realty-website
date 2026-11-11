import { useTranslations } from 'next-intl';
import type { Listing, Station } from '@/lib/data/types';
import { ListingCard } from './ListingCard';

export function SimilarListings({ listings, stations }: { listings: Listing[]; stations: Record<string, Station> }) {
  const t = useTranslations('listing');
  if (!listings.length) return null;
  return (
    <section>
      <h2 className="text-xl font-bold">{t('similar')}</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((l) => <ListingCard key={l.code} listing={l} stations={stations} />)}
      </div>
    </section>
  );
}
