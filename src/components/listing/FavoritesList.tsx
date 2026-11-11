'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Listing, Station } from '@/lib/data/types';
import { usePreferences } from '@/components/providers/PreferencesProvider';
import { ListingCard } from './ListingCard';

interface Payload { listings: Listing[]; stations: Station[] }

export function FavoritesList() {
  const t = useTranslations('favorites');
  const { favorites, ready } = usePreferences();
  const [data, setData] = useState<Payload | null>(null);
  const key = favorites.join(',');

  useEffect(() => {
    if (!ready) return;
    if (!key) { setData({ listings: [], stations: [] }); return; }
    let cancelled = false;
    fetch(`/api/listings?codes=${encodeURIComponent(key)}`)
      .then((r) => r.json() as Promise<Payload>)
      .then((payload) => { if (!cancelled) setData(payload); })
      .catch(() => { if (!cancelled) setData({ listings: [], stations: [] }); });
    return () => { cancelled = true; };
  }, [key, ready]);

  if (!data) return <p className="mt-8 text-ink-soft">…</p>;

  // Hide cards the visitor un-saved on this page without waiting for a refetch.
  const listings = data.listings.filter((l) => favorites.includes(l.code));
  if (listings.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
        <p className="text-3xl" aria-hidden>♡</p>
        <p className="mt-2 font-semibold">{t('empty')}</p>
        <p className="mt-1 text-sm text-ink-soft">{t('emptyHint')}</p>
        <Link href="/rent" className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">{t('browse')}</Link>
      </div>
    );
  }
  const stations = Object.fromEntries(data.stations.map((s) => [s.slug, s]));
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => <ListingCard key={l.code} listing={l} stations={stations} />)}
    </div>
  );
}
