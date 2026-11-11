import { useTranslations } from 'next-intl';
import type { AmenityKey, Listing } from '@/lib/data/types';
import { activeConditions } from '@/lib/listing/derived';

const ICONS: Record<AmenityKey, string> = {
  aircon: '❄️', balcony: '🌿', deliveryBox: '📦', elevator: '🛗', bikeParking: '🚲', separateToilet: '🚻',
  washlet: '🚽', internet: '📶', systemKitchen: '🍳', flooring: '🪵', storage: '🗄️',
};

export function Amenities({ listing }: { listing: Listing }) {
  const t = useTranslations();
  return (
    <section id="amenities" className="scroll-mt-48 rounded-2xl border border-line bg-white p-5">
      <h2 className="text-xl font-bold">{t('listing.amenities')}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {activeConditions(listing).map((k) => (
          <span key={k} className="rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent-dark">✓ {t(`conditions.${k}`)}</span>
        ))}
        {listing.amenities.map((k) => (
          <span key={k} className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm">
            <span aria-hidden className="mr-1">{ICONS[k]}</span>{t(`amenities.${k}`)}
          </span>
        ))}
      </div>
    </section>
  );
}
