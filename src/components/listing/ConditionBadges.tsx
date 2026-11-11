import { useTranslations } from 'next-intl';
import type { Listing } from '@/lib/data/types';
import { activeConditions } from '@/lib/listing/derived';
import { Badge } from '@/components/ui/Badge';

export function ConditionBadges({ listing }: { listing: Listing }) {
  const t = useTranslations();
  return (
    <section>
      <h2 className="text-xl font-bold">{t('listing.features')}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {activeConditions(listing).map((k) => <Badge key={k} tone="accent">{t(`conditions.${k}`)}</Badge>)}
      </div>
    </section>
  );
}
