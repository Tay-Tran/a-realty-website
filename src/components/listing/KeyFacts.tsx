import { useLocale, useTranslations } from 'next-intl';
import type { Listing, Locale, Station } from '@/lib/data/types';
import { formatSize, pickText } from '@/lib/listing/format';

export function KeyFacts({ listing, stations }: { listing: Listing; stations: Record<string, Station> }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const rows: [string, React.ReactNode][] = [
    [t('listing.layout'), listing.layout],
    [t('listing.size'), formatSize(listing.sizeM2)],
    [t('listing.floor'), t('listing.floorValue', { floor: listing.floor })],
    [t('listing.built'), t('listing.builtValue', { year: listing.builtYear })],
    [t('listing.stations'), (
      <ul className="space-y-0.5">
        {listing.stations.map((s) => {
          const st = stations[s.stationSlug];
          return <li key={s.stationSlug}>{t('common.stationName', { name: st ? pickText(st.name, locale) : s.stationSlug })} · {t('common.minWalk', { minutes: s.walkMinutes })}</li>;
        })}
      </ul>
    )],
    [t('listing.address'), listing.address],
  ];
  return (
    <dl className="grid grid-cols-1 divide-y divide-line rounded-2xl border border-line bg-white sm:grid-cols-2 sm:divide-y-0">
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-4 p-4 sm:border-b sm:border-line">
          <dt className="w-32 shrink-0 text-sm text-ink-soft">{label}</dt>
          <dd className="text-sm font-medium text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
