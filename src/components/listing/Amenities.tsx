import { useTranslations } from 'next-intl';
import type { Listing } from '@/lib/data/types';
import { activeConditions } from '@/lib/listing/derived';
import { AMENITY_ICONS } from '@/components/ui/feature-icons';

export function Amenities({ listing }: { listing: Listing }) {
  const t = useTranslations();
  return (
    <section id="amenities" className="scroll-mt-48 rounded-2xl border border-line bg-white p-5">
      <h2 className="text-xl font-bold">{t('listing.amenities')}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {activeConditions(listing).map((k) => (
          <span key={k} className="rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent-dark">✓ {t(`conditions.${k}`)}</span>
        ))}
        {listing.amenities.map((k) => {
          const Icon = AMENITY_ICONS[k];
          return (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-sm">
              <Icon className="h-4 w-4 text-accent" />{t(`amenities.${k}`)}
            </span>
          );
        })}
      </div>
    </section>
  );
}
