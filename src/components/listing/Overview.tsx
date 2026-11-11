import { useLocale, useTranslations } from 'next-intl';
import type { Listing, Locale, Station } from '@/lib/data/types';
import { bedroomsOf } from '@/lib/listing/derived';
import { formatSize, pickText } from '@/lib/listing/format';
import { calcInitialCost } from '@/lib/listing/initial-cost';
import { Price } from '@/components/ui/Price';

export function Overview({ listing, stations }: { listing: Listing; stations: Record<string, Station> }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const stats: [string, React.ReactNode][] = [
    [t('listing.layout'), listing.layout],
    [t('listing.bedrooms'), bedroomsOf(listing.layout)],
    [t('listing.floor'), t('listing.floorValue', { floor: listing.floor })],
    [t('listing.size'), formatSize(listing.sizeM2)],
  ];
  return (
    <section id="overview" className="scroll-mt-48 grid gap-6 rounded-2xl border border-line bg-white p-5 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <h2 className="font-bold">{t('listing.address')}</h2>
          <p className="mt-1 text-ink-soft">{listing.address}</p>
        </div>
        <div>
          <h2 className="font-bold">{t('listing.stations')}</h2>
          <ul className="mt-2 space-y-2">
            {listing.stations.map((s) => {
              const st = stations[s.stationSlug];
              return (
                <li key={s.stationSlug} className="flex items-center justify-between gap-3 text-sm">
                  <span><span aria-hidden className="mr-2">🚉</span>{t('common.stationName', { name: st ? pickText(st.name, locale) : s.stationSlug })}</span>
                  <span className="text-ink-soft">🚶 {t('common.minWalk', { minutes: s.walkMinutes })}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 rounded-2xl bg-paper p-3 sm:grid-cols-4 lg:grid-cols-2">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white p-3">
            <p className="text-xs text-ink-soft">{label}</p>
            <p className="text-lg font-bold">{value}</p>
          </div>
        ))}
        <div className="col-span-2 rounded-xl bg-white p-3 sm:col-span-4 lg:col-span-2">
          <p className="text-xs text-ink-soft">{t('listing.initialCostEstimate')}</p>
          <p className="text-lg font-bold text-accent"><Price yen={calcInitialCost(listing).total} /></p>
        </div>
      </div>
    </section>
  );
}
